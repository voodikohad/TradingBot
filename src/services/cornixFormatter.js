/**
 * Cornix Command Formatter
 * Converts TradingView webhook data into Cornix-readable trade commands
 */

const logger = require('../utils/logger');

class CornixFormatter {
  /**
   * Converts validated webhook data into a Cornix command
   * @param {Object} data - Validated webhook data
   * @returns {string} Cornix-formatted command
   */
  formatEntryCommand(data) {
    try {
      const { symbol, side, size, size_type, tag } = data;

      // Build size string
      const sizeString = size_type === 'percent' 
        ? `${size}%` 
        : `${size}USD`;

      // Build tag string (if exists)
      const tagString = tag ? ` ${tag}` : '';

      // Format: /entry SYMBOL SIDE SIZE_WITH_UNIT TAG
      const command = `/entry ${symbol} ${side} ${sizeString}${tagString}`;

      logger.debug('Cornix command formatted', {
        input: data,
        output: command
      });

      return command;
    } catch (error) {
      logger.error('Error formatting Cornix command', { error: error.message, data });
      throw error;
    }
  }

  /**
   * Converts validated webhook data into a Cornix stop-loss command
   * Reserved for future implementation
   * @param {Object} data - Validated webhook data
   * @returns {string} Cornix-formatted SL command
   */
  formatSlCommand(data) {
    const { symbol, price, offset } = data;
    
    if (offset) {
      return `/sl ${symbol} offset ${offset}`;
    }
    
    return `/sl ${symbol} ${price}`;
  }

  /**
   * Converts validated webhook data into a Cornix take-profit command
   * Reserved for future implementation
   * @param {Object} data - Validated webhook data
   * @returns {string} Cornix-formatted TP command
   */
  formatTpCommand(data) {
    const { symbol, price, offset } = data;
    
    if (offset) {
      return `/tp ${symbol} offset ${offset}`;
    }
    
    return `/tp ${symbol} ${price}`;
  }

  /**
   * Routes formatting based on action type
   * @param {Object} data - Validated webhook data
   * @returns {string} Formatted Cornix command
   */
  formatCommand(data) {
    const { action } = data;

    switch (action) {
      case 'entry':
        return this.formatEntryCommand(data);
      case 'sl':
        return this.formatSlCommand(data);
      case 'tp':
        return this.formatTpCommand(data);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Creates a formatted Telegram message with the Cornix command
   * @param {Object} data - Validated webhook data
   * @returns {string} Full Telegram message
   */
  createTelegramMessage(data) {
    const command = this.formatCommand(data);
    const timestamp = new Date().toISOString();

    const message = `
🚀 *AUTO-TRADE SIGNAL*
═══════════════════════════
*Symbol:* \`${data.symbol}\`
*Action:* \`${data.action.toUpperCase()}\`
*Side:* \`${data.side.toUpperCase()}\`
*Size:* \`${data.size}${data.size_type === 'percent' ? '%' : 'USD'}\`
${data.tag ? `*Tag:* \`${data.tag}\`` : ''}
═══════════════════════════
*Command:*
\`\`\`
${command}
\`\`\`
*Time:* ${timestamp}
    `.trim();

    return message;
  }
}

module.exports = new CornixFormatter();
