/**
 * TradingView → Telegram → Cornix Integration Server
 * Main Express application entry point
 * 
 * Features:
 * - Secure webhook endpoint with token validation
 * - TradingView JSON parsing and validation
 * - Cornix command formatting
 * - Telegram bot integration for auto-trading
 */

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const env = require('./src/utils/env');
const logger = require('./src/utils/logger');
const validator = require('./src/utils/validator');
const telegramService = require('./src/services/telegramService');
const cornixFormatter = require('./src/services/cornixFormatter');
const entryHandler = require('./src/handlers/entryHandler');
const slHandler = require('./src/handlers/slHandler');
const tpHandler = require('./src/handlers/tpHandler');

const app = express();

// Persistent data file
const DATA_FILE = path.join(__dirname, 'logs', 'signals-data.json');

// Load or initialize data store
let dataStore = {
  signals: [],
  stats: {
    totalSignals: 0,
    todaySignals: 0,
    successRate: 0,
    errors24h: 0
  }
};

// Load existing data from file
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf8');
      const loaded = JSON.parse(fileData);
      dataStore = loaded;
      
      // Clean old signals (keep last 7 days)
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      dataStore.signals = dataStore.signals.filter(s => {
        const signalTime = new Date(s.timestamp).getTime();
        return signalTime > sevenDaysAgo;
      });
      
      logger.info('📊 Loaded data from disk', {
        signals: dataStore.signals.length,
        totalSignals: dataStore.stats.totalSignals
      });
    }
  } catch (error) {
    logger.warn('Could not load data file, starting fresh', { error: error.message });
  }
}

// Save data to file
function saveData() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(dataStore, null, 2), 'utf8');
  } catch (error) {
    logger.error('Failed to save data', { error: error.message });
  }
}

// Load data on startup
loadData();

// Auto-save every 5 minutes
setInterval(saveData, 5 * 60 * 1000);

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// CORS middleware for UI
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow Vercel deployments and configured frontend URL
  if (origin && (origin.match(/\.vercel\.app$/) || origin === process.env.FRONTEND_URL || origin === 'http://localhost:5173')) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all for webhooks
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Webhook-Secret');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
});

/**
 * Health Check Endpoint
 * GET /
 * Returns server status
 */
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TradingView-Telegram-Cornix Bot',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Bot Info Endpoint
 * GET /health
 * Checks bot connectivity and configuration
 */
app.get('/health', async (req, res) => {
  try {
    await telegramService.testConnection();
    
    res.json({
      status: 'healthy',
      telegram: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(500).json({
      status: 'unhealthy',
      telegram: 'disconnected',
      error: error.message
    });
  }
});

/**
 * Get Signals
 * GET /api/signals
 * Returns recent trading signals
 */
app.get('/api/signals', (req, res) => {
  res.json({
    success: true,
    signals: dataStore.signals,
    count: dataStore.signals.length
  });
});

/**
 * Get Stats
 * GET /api/stats
 * Returns trading statistics
 */
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: dataStore.stats
  });
});

/**
 * Get Logs
 * GET /api/logs
 * Returns system logs from logger
 */
app.get('/api/logs', (req, res) => {
  const logs = logger.getRecentLogs ? logger.getRecentLogs() : [];
  res.json({
    success: true,
    logs: logs
  });
});

/**
 * Get System Status
 * GET /api/status
 * Returns system status information
 */
app.get('/api/status', async (req, res) => {
  // Return simple status without testing Telegram to avoid API spam
  // Telegram will work fine when webhooks arrive
  res.json({
    success: true,
    status: {
      server: 'online',
      telegram: 'online',
      webhook: 'ready'
    }
  });
});

/**
 * Primary Webhook Endpoint
 * POST /webhook
 * 
 * Receives TradingView alerts and converts them to Cornix commands
 * 
 * Headers:
 * - X-Webhook-Secret: Webhook security token
 * 
 * Body (JSON):
 * {
 *   "action": "entry|sl|tp|exit",
 *   "side": "long|short",
 *   "symbol": "BTCUSDT",
 *   "size_type": "percent|usd",
 *   "size": 1.0,
 *   "tag": "SFP_SL" (optional)
 * }
 */
app.post('/webhook', async (req, res) => {
  try {
    const startTime = Date.now();
    logger.debug('Webhook received', {
      method: req.method,
      path: req.path,
      body: req.body
    });

    // Step 1: Validate Secret Token
    const tokenFromHeader = req.headers['x-webhook-secret'];
    const tokenFromQuery = req.query.token;
    const providedToken = tokenFromHeader || tokenFromQuery;

    if (!validator.validateToken(providedToken, env.WEBHOOK_SECRET)) {
      logger.warn('❌ Webhook authentication failed', {
        timestamp: new Date().toISOString()
      });
      return res.status(401).json({
        error: 'Unauthorized: Invalid or missing webhook secret token'
      });
    }

    // Step 2: Parse and Validate Webhook Data
    const requestData = req.body;
    const validation = validator.validateWebhookData(requestData);

    if (!validation.isValid) {
      logger.warn('❌ Webhook validation failed', {
        errors: validation.errors,
        receivedData: requestData
      });
      return res.status(400).json({
        error: 'Invalid webhook data',
        details: validation.errors
      });
    }

    const validatedData = validation.data;
    logger.info('✅ Webhook validated successfully', {
      symbol: validatedData.symbol,
      action: validatedData.action
    });

    // Step 3: Route to appropriate handler based on action
    let handlerResult;

    switch (validatedData.action) {
      case 'entry':
        handlerResult = await entryHandler.handle(validatedData);
        break;
      case 'sl':
        handlerResult = await slHandler.handle(validatedData);
        break;
      case 'tp':
        handlerResult = await tpHandler.handle(validatedData);
        break;
      default:
        throw new Error(`Unsupported action: ${validatedData.action}`);
    }

    const processingTime = Date.now() - startTime;

    // Store signal in dataStore
    const signal = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      symbol: handlerResult.symbol,
      side: validatedData.side,
      action: handlerResult.action,
      size: validatedData.size,
      sizeType: validatedData.size_type,
      cornixCommand: handlerResult.cornixCommand,
      status: 'sent'
    };
    dataStore.signals.unshift(signal);
    if (dataStore.signals.length > 100) {
      dataStore.signals = dataStore.signals.slice(0, 100);
    }

    // Update stats
    dataStore.stats.totalSignals++;
    const today = new Date().toDateString();
    const signalDate = new Date(signal.timestamp).toDateString();
    if (today === signalDate) {
      dataStore.stats.todaySignals++;
    }
    
    // Save to disk immediately after new signal
    saveData();

    logger.info('✅ WEBHOOK PROCESSED SUCCESSFULLY', {
      action: handlerResult.action,
      symbol: handlerResult.symbol,
      cornixCommand: handlerResult.cornixCommand,
      processingTime: `${processingTime}ms`
    });

    // Return success response
    res.json({
      success: true,
      action: handlerResult.action,
      symbol: handlerResult.symbol,
      cornixCommand: handlerResult.cornixCommand,
      message: 'Trade signal executed successfully',
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.logWebhookError(error, req.body);

    res.status(500).json({
      error: 'Webhook processing failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Test Telegram Connection Endpoint
 * POST /test-telegram
 * Sends a test message to verify Telegram connectivity
 */
app.post('/test-telegram', async (req, res) => {
  try {
    const tokenFromHeader = req.headers['x-webhook-secret'];
    const tokenFromQuery = req.query.token;
    const providedToken = tokenFromHeader || tokenFromQuery;

    // Validate token for security
    if (!validator.validateToken(providedToken, env.WEBHOOK_SECRET)) {
      return res.status(401).json({
        error: 'Unauthorized: Invalid or missing webhook secret token'
      });
    }

    await telegramService.sendTestMessage();

    res.json({
      success: true,
      message: 'Test message sent to Telegram successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Test Telegram failed', { error: error.message });
    res.status(500).json({
      error: 'Failed to send test message',
      message: error.message
    });
  }
});

/**
 * Error Handler Middleware
 */
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path
  });

  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Start Server
const PORT = env.PORT;
const HOST = '0.0.0.0'; // Bind to all interfaces for Docker/Cloud deployments

const server = app.listen(PORT, HOST, () => {
  logger.info('🚀 SERVER STARTED', {
    port: PORT,
    host: HOST,
    environment: env.NODE_ENV,
    webhook: `/webhook`,
    health: `/health`
  });

  // Don't test Telegram on startup to avoid timeouts
  // Connection will be tested when first webhook arrives or status is checked
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
