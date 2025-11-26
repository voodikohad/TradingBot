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
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
    this.timeout = 30000; // Reduced to 30s - if it takes longer, there's a network issue
    
    // Configure axios with aggressive timeout and connection settings
    this.axiosConfig = {
      timeout: this.timeout,
      httpsAgent: new https.Agent({
        keepAlive: true,
        keepAliveMsecs: 10000,
        maxSockets: 50,
        maxFreeSockets: 10,
        timeout: this.timeout,
        // Railway-specific settings
        rejectUnauthorized: true,
        family: 4 // Force IPv4 - some platforms have IPv6 issues
      }),
      // Add headers that help with cloud platform routing
      headers: {
        'Connection': 'keep-alive',
        'User-Agent': 'TradingBot/1.0'
      }
    };
    
    // Test DNS resolution on init
    this.testDNS();
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
        logger.debug(`Telegram message attempt ${attempt}/${retries + 1}`, {
          chatId: this.chatId,
          messageLength: message.length
        });

        const response = await axios.post(
          `${this.apiUrl}/sendMessage`,
          {
            chat_id: this.chatId,
            text: message,
            parse_mode: 'Markdown'
          },
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
          duration: `${duration}ms`
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
          data: error.response?.data
        };
        
        if (isLastAttempt) {
          logger.error('Failed to send Telegram message after all retries', errorDetails);
          throw new Error(`Telegram API Error: ${error.message}`);
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

    const message = `
${cornixCommand}

🚀 *TRADE SIGNAL EXECUTED*
═══════════════════════════
*Symbol:* \`${data.symbol}\`
*Action:* \`${data.action.toUpperCase()}\`
*Side:* \`${data.side.toUpperCase()}\`
*Size:* \`${data.size}${data.size_type === 'percent' ? '%' : 'USD'}\`
${data.tag ? `*Tag:* \`${data.tag}\`` : ''}
*Timestamp:* ${timestamp}
    `.trim();

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
    const testMessage = `
🧪 *TEST MESSAGE*
═══════════════════════════
Bot connection is working correctly!
Time: ${new Date().toISOString()}
    `.trim();

    return await this.sendMessage(testMessage);
  }
}

module.exports = new TelegramService();
