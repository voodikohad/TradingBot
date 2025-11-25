/**
 * Entry Handler
 * Processes entry signals and coordinates with Telegram/Cornix services
 * Modular design allows easy addition of SL/TP handlers in future versions
 */

const cornixFormatter = require('../services/cornixFormatter');
const telegramService = require('../services/telegramService');
const logger = require('../utils/logger');

class EntryHandler {
  /**
   * Handles an entry signal
   * @param {Object} validatedData - Validated webhook data
   * @returns {Promise<Object>} Handler result with status and data
   */
  async handle(validatedData) {
    try {
      logger.info('Processing entry signal', {
        symbol: validatedData.symbol,
        side: validatedData.side,
        size: `${validatedData.size}${validatedData.size_type === 'percent' ? '%' : 'USD'}`
      });

      // Format the Cornix command
      const cornixCommand = cornixFormatter.formatEntryCommand(validatedData);

      // Send to Telegram/Cornix
      await telegramService.sendCornixCommand(cornixCommand, validatedData);

      // Log successful trade
      logger.logTrade(validatedData, cornixCommand);

      return {
        success: true,
        action: 'entry',
        cornixCommand,
        symbol: validatedData.symbol,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Entry handler error', {
        error: error.message,
        data: validatedData
      });

      throw error;
    }
  }
}

module.exports = new EntryHandler();
