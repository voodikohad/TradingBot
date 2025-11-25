/**
 * Take-Profit Handler
 * Processes take-profit signals
 * Reserved for future implementation (v2+)
 */

const cornixFormatter = require('../services/cornixFormatter');
const telegramService = require('../services/telegramService');
const logger = require('../utils/logger');

class TpHandler {
  /**
   * Handles a take-profit signal
   * @param {Object} validatedData - Validated webhook data
   * @returns {Promise<Object>} Handler result with status and data
   */
  async handle(validatedData) {
    try {
      logger.info('Processing take-profit signal', {
        symbol: validatedData.symbol
      });

      // Format the Cornix command
      const cornixCommand = cornixFormatter.formatTpCommand(validatedData);

      // Send to Telegram/Cornix
      await telegramService.sendCornixCommand(cornixCommand, validatedData);

      logger.info('✅ Take-profit executed', {
        symbol: validatedData.symbol,
        cornixCommand
      });

      return {
        success: true,
        action: 'tp',
        cornixCommand,
        symbol: validatedData.symbol,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('TP handler error', {
        error: error.message,
        data: validatedData
      });

      throw error;
    }
  }
}

module.exports = new TpHandler();
