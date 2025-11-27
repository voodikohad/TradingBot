/**
 * Cornix Command Formatter
 * Converts TradingView webhook data into Cornix-readable trade commands
 */

const logger = require('../utils/logger');

class CornixFormatter {
  /**
   * Extracts clean trading symbol from exchange-prefixed format
   * Examples: 
   *   BYBIT:BTCUSDT.P → BTCUSDT
   *   BINANCE:ETHUSDT → ETHUSDT
   *   BTCUSDT → BTCUSDT
   * @param {string} symbol - Raw symbol from TradingView
   * @returns {string} Clean symbol for Cornix
   */
  parseSymbol(symbol) {
    // Remove exchange prefix (e.g., BYBIT:, BINANCE:)
    let clean = symbol.split(':').pop();
    
    // Remove perpetual suffix (.P)
    clean = clean.replace(/\.P$/i, '');
    
    return clean.toUpperCase();
  }

  /**
   * Converts validated webhook data into Cornix text signal format
   * Cornix requires this specific format with TP and SL included
   * @param {Object} data - Validated webhook data
   * @returns {string} Cornix-formatted signal
   */
  formatEntryCommand(data) {
    try {
      const { symbol, side, leverage, tp1, tp2, tp3, tp4, tp5, sl, tag } = data;

      // Parse clean symbol for Cornix
      const cleanSymbol = this.parseSymbol(symbol);

      // Build Cornix signal format
      const lines = [];
      
      // Tag (optional, but recommended)
      if (tag) {
        lines.push(tag);
      }
      
      // Pair
      lines.push(`Pair: ${cleanSymbol}`);
      
      // Action (Long/Short)
      lines.push(`Action: ${side.charAt(0).toUpperCase() + side.slice(1)}`);
      
      // Leverage (optional)
      if (leverage) {
        lines.push(`Leverage: ${leverage}x`);
      }
      
      // Entry
      lines.push(`Entry: Market`);
      
      // TP levels (at least TP1 is required)
      if (tp1) lines.push(`TP1: ${tp1}`);
      if (tp2) lines.push(`TP2: ${tp2}`);
      if (tp3) lines.push(`TP3: ${tp3}`);
      if (tp4) lines.push(`TP4: ${tp4}`);
      if (tp5) lines.push(`TP5: ${tp5}`);
      
      // Stop Loss (required)
      if (sl) lines.push(`Stop Loss: ${sl}`);

      const command = lines.join('\n');

      logger.debug('Cornix signal formatted', {
        input: data,
        output: command
      });

      return command;
    } catch (error) {
      logger.error('Error formatting Cornix signal', { error: error.message, data });
      throw error;
    }
  }

  /**
   * Converts validated webhook data into a Cornix stop-loss command
   * Format: /sl SYMBOL #TAG
   * @param {Object} data - Validated webhook data
   * @returns {string} Cornix-formatted SL command
   */
  formatSlCommand(data) {
    const { symbol, tag } = data;
    
    // Parse clean symbol for Cornix
    const cleanSymbol = this.parseSymbol(symbol);
    
    // Build tag string (if exists)
    const tagString = tag ? ` ${tag}` : '';
    
    // Cornix SL command: /sl SYMBOL #TAG
    const command = `/sl ${cleanSymbol}${tagString}`;
    
    logger.debug('Cornix SL command formatted', {
      input: data,
      output: command
    });
    
    return command;
  }

  /**
   * Converts validated webhook data into a Cornix take-profit command
   * Format: /tp SYMBOL 1 #TAG (for TP1)
   * @param {Object} data - Validated webhook data
   * @returns {string} Cornix-formatted TP command
   */
  formatTpCommand(data) {
    const { symbol, tp_number, tag } = data;
    
    // Parse clean symbol for Cornix
    const cleanSymbol = this.parseSymbol(symbol);
    
    // Build TP number string (default to 1 if not specified)
    const tpNum = tp_number || 1;
    
    // Build tag string (if exists)
    const tagString = tag ? ` ${tag}` : '';
    
    // Cornix TP command: /tp SYMBOL 1 #TAG
    const command = `/tp ${cleanSymbol} ${tpNum}${tagString}`;
    
    logger.debug('Cornix TP command formatted', {
      input: data,
      output: command,
      tpNumber: tpNum
    });
    
    return command;
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
