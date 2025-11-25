/**
 * Stop-Loss Handler
 * Processes stop-loss signals
 * Reserved for future implementation (v2+)
 */

const cornixFormatter = require('../services/cornixFormatter');
const telegramService = require('../services/telegramService');
const logger = require('../utils/logger');

class SlHandler {
  /**
   * Handles a stop-loss signal
   * @param {Object} validatedData - Validated webhook data
   * @returns {Promise<Object>} Handler result with status and data
   */
  async handle(validatedData) {
    try {
      logger.info('Processing stop-loss signal', {
        symbol: validatedData.symbol
      });

      // Format the Cornix command
      const cornixCommand = cornixFormatter.formatSlCommand(validatedData);

      // Send to Telegram/Cornix
      await telegramService.sendCornixCommand(cornixCommand, validatedData);

      logger.info('✅ Stop-loss executed', {
        symbol: validatedData.symbol,
        cornixCommand
      });

      return {
        success: true,
        action: 'sl',
        cornixCommand,
        symbol: validatedData.symbol,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('SL handler error', {
        error: error.message,
        data: validatedData
      });

      throw error;
    }
  }
}

module.exports = new SlHandler();
