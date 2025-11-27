/**
 * Telegram Bot Service
 * Handles all communication with Telegram Bot API
 */

const axios = require('axios');
const https = require('https');
const dns = require('dns').promises;
const env = require('../utils/env');
const logger = require('../utils/logger');

class TelegramService {
  constructor() {
    this.botToken = env.TELEGRAM_BOT_TOKEN;
    this.chatId = env.TELEGRAM_CHAT_ID;
    
    // Validate bot token format
    if (!this.botToken || !this.botToken.includes(':')) {
      logger.error('❌ Invalid Telegram bot token format', {
        tokenPresent: !!this.botToken,
        hasColon: this.botToken?.includes(':')
      });
    }
    
    // Support custom API base URL and proxy
    this.apiBaseUrl = env.TELEGRAM_API_BASE_URL || 'https://api.telegram.org';
    this.apiProxy = env.TELEGRAM_API_PROXY;
    
    // If proxy is configured, use it as base URL
    if (this.apiProxy) {
      this.apiUrl = `${this.apiProxy}/bot${this.botToken}`;
      logger.info('🔄 Using Telegram API Proxy', { proxy: this.apiProxy });
    } else {
      this.apiUrl = `${this.apiBaseUrl}/bot${this.botToken}`;
    }
    
    this.timeout = 30000; // 30s timeout
    
    logger.info('📱 Telegram Service initialized', {
      apiUrl: this.apiUrl.replace(this.botToken, '***TOKEN***'),
      apiBaseUrl: this.apiBaseUrl,
      usingProxy: !!this.apiProxy,
      proxyUrl: this.apiProxy || 'none',
      chatId: this.chatId,
      tokenLength: this.botToken?.length || 0,
      tokenFormat: this.botToken ? `${this.botToken.substring(0, 10)}...` : 'MISSING'
    });
    
    // Configure axios with timeout and connection settings
    this.axiosConfig = {
      timeout: this.timeout,
      httpsAgent: new https.Agent({
        keepAlive: true,
        keepAliveMsecs: 10000,
        maxSockets: 50,
        maxFreeSockets: 10,
        timeout: this.timeout,
        rejectUnauthorized: true,
        family: 4 // Force IPv4 - some platforms have IPv6 issues
      }),
      headers: {
        'Connection': 'keep-alive',
        'User-Agent': 'TradingBot/1.0'
      }
    };
    
    // Test DNS resolution on init (skip if using proxy)
    if (!this.apiProxy) {
      this.testDNS();
    } else {
      logger.info('⏭️ Skipping DNS test (using proxy)');
    }
  }
  
  async testDNS() {
    try {
      const addresses = await dns.resolve4('api.telegram.org');
      logger.info('DNS resolution successful', { 
        domain: 'api.telegram.org',
        addresses: addresses 
      });
    } catch (error) {
      logger.error('DNS resolution failed - Railway may be blocking Telegram', { 
        error: error.message,
        code: error.code
      });
    }
  }

  /**
   * Sends a message to the configured Telegram chat/channel with retry logic
   * @param {string} message - Message text (supports Markdown formatting)
   * @param {number} retries - Number of retry attempts
   * @returns {Promise<Object>} Telegram API response
   */
  async sendMessage(message, retries = 2) {
    const startTime = Date.now();
    
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        const url = `${this.apiUrl}/sendMessage`;
        const payload = {
          chat_id: this.chatId,
          text: message
        };
        
        logger.debug(`Telegram message attempt ${attempt}/${retries + 1}`, {
          url: url.replace(this.botToken, '***TOKEN***'),
          chatId: this.chatId,
          messageLength: message.length,
          payload: {
            chat_id: payload.chat_id,
            text_preview: message.substring(0, 50) + '...',
            parse_mode: payload.parse_mode
          }
        });

        const response = await axios.post(
          url,
          payload,
          {
            ...this.axiosConfig,
            timeout: 15000 // Shorter timeout per attempt (15s)
          }
        );

        const duration = Date.now() - startTime;
        logger.info('✉️ Telegram message sent successfully', {
          messageId: response.data.result.message_id,
          chatId: this.chatId,
          attempt: attempt,
          duration: `${duration}ms`,
          responseOk: response.data.ok
        });

        return response.data;
      } catch (error) {
        const duration = Date.now() - startTime;
        const isLastAttempt = attempt === retries + 1;
        
        // Log detailed error info
        const errorDetails = {
          error: error.message,
          code: error.code,
          attempt: `${attempt}/${retries + 1}`,
          duration: `${duration}ms`,
          chatId: this.chatId,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url?.replace(this.botToken, '***TOKEN***'),
          method: error.config?.method,
          timeout: error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
        };
        
        if (isLastAttempt) {
          logger.error('Failed to send Telegram message after all retries', errorDetails);
          
          // Add helpful error message
          let helpMessage = '';
          if (error.code === 'ENOTFOUND') {
            helpMessage = ' DNS resolution failed - check network connectivity';
          } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            helpMessage = ' Request timed out - Telegram API might be blocked by hosting platform';
          } else if (error.response?.status === 404) {
            helpMessage = ' API endpoint not found - check bot token format';
          } else if (error.response?.status === 401 || error.response?.status === 403) {
            helpMessage = ' Unauthorized - check bot token and chat permissions';
          }
          
          throw new Error(`Telegram API Error: ${error.message}${helpMessage}`);
        } else {
          logger.warn(`Telegram message attempt ${attempt} failed, retrying...`, errorDetails);
          // Wait 2 seconds before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
  }

  /**
   * Sends a Cornix command to Telegram
   * @param {string} cornixCommand - Formatted Cornix command
   * @param {Object} data - Original webhook data for context
   * @returns {Promise<Object>} Telegram API response
   */
  async sendCornixCommand(cornixCommand, data) {
    try {
      const message = this.formatCornixMessage(cornixCommand, data);
      return await this.sendMessage(message);
    } catch (error) {
      logger.error('Failed to send Cornix command', {
        error: error.message,
        cornixCommand,
        data
      });
      throw error;
    }
  }

  /**
   * Formats a message with the Cornix command
   * @param {string} cornixCommand - Cornix command
   * @param {Object} data - Webhook data
   * @returns {string} Formatted message
   */
  formatCornixMessage(cornixCommand, data) {
    const timestamp = new Date().toLocaleString();

    // Use simple formatting without special characters that break Markdown
    const message = `${cornixCommand}

🚀 TRADE SIGNAL
─────────────────────
Symbol: ${data.symbol}
Action: ${data.action.toUpperCase()}
Side: ${data.side.toUpperCase()}
Size: ${data.size}${data.size_type === 'percent' ? '%' : 'USD'}
${data.tag ? `Tag: ${data.tag}` : ''}
Time: ${timestamp}`;

    return message;
  }

  /**
   * Tests bot connectivity
   * @returns {Promise<boolean>} True if bot is accessible
   */
  async testConnection() {
    try {
      const response = await axios.get(
        `${this.apiUrl}/getMe`,
        this.axiosConfig
      );

      logger.info('✅ Telegram bot connection successful', {
        botName: response.data.result.username,
        botId: response.data.result.id
      });

      return true;
    } catch (error) {
      logger.error('❌ Telegram bot connection failed', {
        error: error.message,
        code: error.code,
        response: error.response?.data
      });

      throw error;
    }
  }

  /**
   * Sends a test message (for debugging)
   * @returns {Promise<Object>} Telegram API response
   */
  async sendTestMessage() {
    const testMessage = `🧪 TEST MESSAGE
─────────────────
Bot connection is working correctly!
Time: ${new Date().toISOString()}`;

    return await this.sendMessage(testMessage);
  }
}

module.exports = new TelegramService();
