/**
 * Logging Service
 * Provides consistent logging across the application
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    this.recentLogs = []; // Store recent logs in memory
    this.maxRecentLogs = 500;
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, data = null) {
    let output = `[${this.getTimestamp()}] [${level.toUpperCase()}] ${message}`;
    if (data) {
      output += ` | ${JSON.stringify(data)}`;
    }
    return output;
  }

  writeToFile(level, message, data) {
    try {
      const fileName = `${level}_${new Date().toISOString().split('T')[0]}.log`;
      const filePath = path.join(this.logDir, fileName);
      const logEntry = this.formatMessage(level, message, data) + '\n';
      fs.appendFileSync(filePath, logEntry);

      // Store in recent logs
      this.recentLogs.unshift({
        id: Date.now() + Math.random(),
        timestamp: this.getTimestamp(),
        level: level,
        message: message,
        data: data,
        type: this.determineLogType(message)
      });

      if (this.recentLogs.length > this.maxRecentLogs) {
        this.recentLogs = this.recentLogs.slice(0, this.maxRecentLogs);
      }
    } catch (err) {
      console.error('Error writing to log file:', err);
    }
  }

  determineLogType(message) {
    if (message.toLowerCase().includes('webhook')) return 'webhook';
    if (message.toLowerCase().includes('telegram')) return 'telegram';
    if (message.toLowerCase().includes('trade')) return 'trade';
    return 'system';
  }

  getRecentLogs() {
    return this.recentLogs;
  }

  shouldLog(level) {
    return this.levels[level] >= this.levels[this.logLevel];
  }

  debug(message, data = null) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, data));
      this.writeToFile('debug', message, data);
    }
  }

  info(message, data = null) {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, data));
      this.writeToFile('info', message, data);
    }
  }

  warn(message, data = null) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, data));
      this.writeToFile('warn', message, data);
    }
  }

  error(message, data = null) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, data));
      this.writeToFile('error', message, data);
    }
  }

  /**
   * Log successful trade execution
   */
  logTrade(tradeData, cornixCommand) {
    this.info('✅ TRADE EXECUTED', {
      action: tradeData.action,
      symbol: tradeData.symbol,
      side: tradeData.side,
      size: `${tradeData.size}${tradeData.size_type === 'percent' ? '%' : 'USD'}`,
      tag: tradeData.tag,
      cornixCommand
    });
  }

  /**
   * Log webhook errors
   */
  logWebhookError(error, requestData = null) {
    this.error('❌ WEBHOOK ERROR', {
      error: error.message,
      stack: error.stack,
      requestData
    });
  }
}

module.exports = new Logger();
