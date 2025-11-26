/**
 * Telegram Bot Service
 * Handles all communication with Telegram Bot API
 */

const axios = require('axios');
const env = require('../utils/env');
const logger = require('../utils/logger');

class TelegramService {
  constructor() {
    this.botToken = env.TELEGRAM_BOT_TOKEN;
    this.chatId = env.TELEGRAM_CHAT_ID;
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
    this.timeout = 60000; // 60 seconds for cloud platforms with slow networks
    
    // Configure axios defaults for cloud environments
    this.axiosConfig = {
      timeout: this.timeout,
      httpsAgent: new (require('https')).Agent({
        keepAlive: true,
        rejectUnauthorized: false // Some cloud platforms need this
      })
    };
  }

  /**
   * Sends a message to the configured Telegram chat/channel
   * @param {string} message - Message text (supports Markdown formatting)
   * @returns {Promise<Object>} Telegram API response
   */
  async sendMessage(message) {
    try {
      logger.debug('Sending Telegram message', {
        chatId: this.chatId,
        messageLength: message.length
      });

      const response = await axios.post(
        `${this.apiUrl}/sendMessage`,
        {
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown' // Enable Markdown formatting
        },
        this.axiosConfig
      );

      logger.info('✉️ Telegram message sent successfully', {
        messageId: response.data.result.message_id,
        chatId: this.chatId
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to send Telegram message', {
        error: error.message,
        chatId: this.chatId,
        status: error.response?.status,
        data: error.response?.data
      });

      throw new Error(`Telegram API Error: ${error.message}`);
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
🚀 *TRADE SIGNAL EXECUTED*
═══════════════════════════
*Symbol:* \`${data.symbol}\`
*Action:* \`${data.action.toUpperCase()}\`
*Side:* \`${data.side.toUpperCase()}\`
*Size:* \`${data.size}${data.size_type === 'percent' ? '%' : 'USD'}\`
${data.tag ? `*Tag:* \`${data.tag}\`` : ''}
═══════════════════════════
*Cornix Command:*
\`\`\`
${cornixCommand}
\`\`\`
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
