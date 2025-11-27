/**
 * TradingView → Telegram → Cornix Integration Server
 * Main Express application entry point
 * 
 * Features:
 * - Secure webhook endpoint with token validation
 * - TradingView JSON parsing and validation
 * - Cornix command formatting
 * - Telegram bot integration for auto-trading
 * - Real-time bot connection status monitoring
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
 * Environment Debug Endpoint
 * GET /debug/env
 * Shows environment variable status (for troubleshooting)
 */
app.get('/debug/env', (req, res) => {
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  
  res.json({
    environment: env.NODE_ENV,
    variables: {
      PORT: { present: !!env.PORT, value: env.PORT },
      WEBHOOK_SECRET: { present: !!env.WEBHOOK_SECRET, length: env.WEBHOOK_SECRET?.length },
      TELEGRAM_BOT_TOKEN: { 
        present: !!botToken, 
        length: botToken?.length,
        hasColon: botToken?.includes(':'),
        botId: botToken?.split(':')[0],
        format: botToken?.includes(':') ? 'valid' : 'invalid'
      },
      TELEGRAM_CHAT_ID: { 
        present: !!chatId, 
        value: chatId,
        length: chatId?.length 
      },
      LOG_LEVEL: { present: !!env.LOG_LEVEL, value: env.LOG_LEVEL }
    },
    telegram: {
      connected: telegramConnected,
      botInfo: botInfo
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Bot Info Endpoint
 * GET /health
 * Checks bot connectivity and configuration
 */
app.get('/health', async (req, res) => {
  res.json({
    status: 'healthy',
    telegram: telegramConnected ? 'connected' : 'disconnected',
    botInfo: botInfo ? {
      username: botInfo.username,
      id: botInfo.id,
      firstName: botInfo.first_name
    } : null,
    timestamp: new Date().toISOString()
  });
});

/**
 * Network Diagnostics
 * GET /test-network
 * Test DNS and network connectivity to Telegram
 */
app.get('/test-network', async (req, res) => {
  const dns = require('dns').promises;
  const axios = require('axios');
  const results = {};
  
  // Test DNS resolution
  try {
    const addresses = await dns.resolve4('api.telegram.org');
    results.dns = {
      success: true,
      addresses: addresses,
      message: 'DNS resolution successful'
    };
  } catch (error) {
    results.dns = {
      success: false,
      error: error.message,
      code: error.code
    };
  }
  
  // Test HTTP connectivity
  try {
    const start = Date.now();
    const response = await axios.get('https://api.telegram.org', {
      timeout: 10000,
      validateStatus: () => true // Accept any status
    });
    results.http = {
      success: true,
      status: response.status,
      duration: `${Date.now() - start}ms`
    };
  } catch (error) {
    results.http = {
      success: false,
      error: error.message,
      code: error.code
    };
  }
  
  // Test bot API
  try {
    const start = Date.now();
    const response = await axios.get(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getMe`,
      { timeout: 10000 }
    );
    results.telegram = {
      success: true,
      duration: `${Date.now() - start}ms`,
      bot: response.data.result?.username
    };
  } catch (error) {
    results.telegram = {
      success: false,
      error: error.message,
      code: error.code
    };
  }
  
  res.json({
    timestamp: new Date().toISOString(),
    platform: process.env.RAILWAY_ENVIRONMENT || 'unknown',
    results: results
  });
});

/**
 * Test Telegram Connection
 * GET /test-telegram-connection
 * Manually test Telegram bot connection
 */
app.get('/test-telegram-connection', async (req, res) => {
  try {
    await telegramService.testConnection();
    res.json({
      success: true,
      telegram: 'connected',
      message: 'Telegram bot is working correctly',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      telegram: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Send Test Message to Telegram
 * GET /test-send-message
 * Directly test sending a message to the configured channel
 */
app.get('/test-send-message', async (req, res) => {
  try {
    logger.info('Test message endpoint called');
    
    const testPayload = {
      action: 'entry',
      side: 'long',
      symbol: 'BTCUSDT',
      size_type: 'percent',
      size: 1.0,
      tag: 'TEST_FROM_BACKEND'
    };
    
    const cornixCommand = cornixFormatter.formatEntryCommand(testPayload);
    const result = await telegramService.sendCornixCommand(cornixCommand, testPayload);
    
    res.json({
      success: true,
      message: 'Test message sent successfully',
      messageId: result.result?.message_id,
      cornixCommand: cornixCommand,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Test message failed', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || 'No additional details',
      timestamp: new Date().toISOString()
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
  res.json({
    success: true,
    status: {
      server: 'online',
      telegram: telegramConnected ? 'online' : 'offline',
      webhook: 'ready',
      cornix: telegramConnected ? 'online' : 'unknown',
      botInfo: botInfo ? {
        username: botInfo.username,
        id: botInfo.id,
        firstName: botInfo.first_name
      } : null
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
    logger.info('📥 Webhook received', {
      method: req.method,
      path: req.path,
      contentType: req.headers['content-type'],
      hasBody: !!req.body,
      bodyType: typeof req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      body: req.body
    });

    // Check if this is a Telegram update (misconfigured webhook)
    if (req.body && (req.body.update_id || req.body.message || req.body.channel_post || req.body.my_chat_member)) {
      logger.info('ℹ️ Received Telegram update on TradingView webhook endpoint. Ignoring.', {
        update_id: req.body.update_id,
        type: req.body.message ? 'message' : (req.body.channel_post ? 'channel_post' : 'other')
      });
      return res.status(200).json({ status: 'ignored', message: 'Telegram updates not supported on this endpoint' });
    }

    // Step 1: Validate Secret Token
    const tokenFromHeader = req.headers['x-webhook-secret'];
    const tokenFromQuery = req.query.token;
    const providedToken = tokenFromHeader || tokenFromQuery;

    logger.debug('🔐 Token validation', {
      hasHeaderToken: !!tokenFromHeader,
      hasQueryToken: !!tokenFromQuery,
      providedTokenLength: providedToken?.length,
      expectedTokenLength: env.WEBHOOK_SECRET?.length
    });

    if (!validator.validateToken(providedToken, env.WEBHOOK_SECRET)) {
      logger.warn('❌ Webhook authentication failed', {
        hasToken: !!providedToken,
        tokenLength: providedToken?.length,
        expectedLength: env.WEBHOOK_SECRET?.length,
        timestamp: new Date().toISOString()
      });
      return res.status(401).json({
        error: 'Unauthorized: Invalid or missing webhook secret token'
      });
    }

    logger.debug('✅ Token validated successfully');

    // Step 2: Parse and Validate Webhook Data
    const requestData = req.body;
    const validation = validator.validateWebhookData(requestData);

    if (!validation.isValid) {
      logger.warn('❌ Webhook validation failed', {
        errors: validation.errors,
        receivedData: requestData,
        dataKeys: Object.keys(requestData || {}),
        action: requestData?.action,
        side: requestData?.side,
        symbol: requestData?.symbol,
        size_type: requestData?.size_type,
        size: requestData?.size
      });
      return res.status(400).json({
        error: 'Invalid webhook data',
        details: validation.errors,
        received: requestData
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

// Global variable to store bot info
let botInfo = null;
let telegramConnected = false;

// Start Server
const PORT = env.PORT;
const HOST = '0.0.0.0'; // Bind to all interfaces for Docker/Cloud deployments

const server = app.listen(PORT, HOST, async () => {
  logger.info('🚀 SERVER STARTED', {
    port: PORT,
    host: HOST,
    environment: env.NODE_ENV,
    webhook: `/webhook`,
    health: `/health`
  });

  // Test Telegram connection on startup (non-blocking with retry)
  const testTelegramConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const axios = require('axios');
        const response = await axios.get(
          `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getMe`,
          { 
            timeout: 30000, // 30 seconds for cloud platforms
            httpsAgent: new (require('https')).Agent({
              keepAlive: true,
              rejectUnauthorized: false // Some cloud platforms need this
            })
          }
        );
        
        if (response.data && response.data.ok) {
          botInfo = response.data.result;
          telegramConnected = true;
          logger.info('✅ TELEGRAM BOT CONNECTED', {
            botName: botInfo.username,
            botId: botInfo.id,
            firstName: botInfo.first_name,
            attempt: i + 1
          });
          return true;
        }
      } catch (error) {
        telegramConnected = false;
        logger.warn(`⚠️ Telegram connection attempt ${i + 1}/${retries} failed`, {
          error: error.message,
          botToken: env.TELEGRAM_BOT_TOKEN ? 'Present (Hidden)' : 'Missing'
        });
        
        if (i < retries - 1) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, (i + 1) * 2000));
        }
      }
    }
    
    logger.error('❌ TELEGRAM BOT CONNECTION FAILED after all retries');
    return false;
  };
  
  // Run connection test in background (don't block server startup)
  testTelegramConnection().catch(err => {
    logger.error('Telegram connection test error', { error: err.message });
  });
  
  // Keep-alive: Self-ping every 5 minutes to prevent Koyeb from stopping instance
  if (env.NODE_ENV === 'production') {
    setInterval(() => {
      const https = require('https');
      https.get('https://strange-dyanne-tradingbot12-29686213.koyeb.app/health', (res) => {
        logger.info('Keep-alive ping successful');
      }).on('error', (e) => {
        logger.warn('Keep-alive ping failed', { error: e.message });
      });
    }, 5 * 60 * 1000); // Every 5 minutes
  }
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
