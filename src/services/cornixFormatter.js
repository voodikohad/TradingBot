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
      const { symbol, side, leverage, tp1, tp2, tp3, tp4, tp5, sl, tag, exchange, entry_type } = data;

      // Parse clean symbol for Cornix
      const cleanSymbol = this.parseSymbol(symbol);

      // Build comprehensive Cornix signal format
      const lines = [];
      
      // Header with emojis
      lines.push(`⚡⚡ #${cleanSymbol} ⚡⚡`);
      
      // Exchange info
      if (exchange) {
        lines.push(`Exchanges: ${exchange}`);
      } else {
        lines.push(`Exchanges: Binance Futures`);
      }
      
      // Signal Type
      const signalType = `Regular (${side.charAt(0).toUpperCase() + side.slice(1)})`;
      lines.push(`Signal Type: ${signalType}`);
      
      // Leverage (optional)
      if (leverage) {
        lines.push(`Leverage: Isolated (${leverage}X)`);
      }
      
      lines.push(''); // Empty line
      
      // Entry Zone
      lines.push(`Entry Zone:`);
      if (entry_type) {
        lines.push(entry_type);
      } else {
        lines.push(`Buy at current price`);
      }
      
      lines.push(''); // Empty line
      
      // Take-Profit Targets
      lines.push(`Take-Profit Targets:`);
      if (tp1) lines.push(`1) ${tp1}`);
      if (tp2) lines.push(`2) ${tp2}`);
      if (tp3) lines.push(`3) ${tp3}`);
      if (tp4) lines.push(`4) ${tp4}`);
      if (tp5) lines.push(`5) ${tp5}`);
      
      lines.push(''); // Empty line
      
      // Stop Targets
      lines.push(`Stop Targets:`);
      if (sl) lines.push(`1) ${sl}`);
      
      lines.push(''); // Empty line
      
      // Trailing Configuration
      lines.push(`Trailing Configuration:`);
      lines.push(`Entry: Percentage (0.5%)`);
      lines.push(`Take-Profit: Percentage (0.5%)`);
      lines.push(`Stop: Moving Target -`);
      lines.push(`Trigger: Target (1)`);
      
      lines.push(''); // Empty line
      
      // Trade Signal section
      lines.push(`🚀 TRADE SIGNAL`);
      lines.push(`─────────────────────`);
      lines.push(`Symbol: ${cleanSymbol}`);
      lines.push(`Side: ${side.toUpperCase()}`);
      lines.push(`Size: ${data.size}%`);
      if (tag) {
        lines.push(`Tag: ${tag}`);
      }

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
   * Converts validated webhook data into a Cornix close/cancel command
   * When SFP SL line is broken, we need to CLOSE the position
   * Format: /close SYMBOL #TAG (closes position when SL is triggered)
   * @param {Object} data - Validated webhook data
   * @returns {string} Cornix-formatted close command
   */
  formatSlCommand(data) {
    const { symbol, side, tag } = data;
    
    // Parse clean symbol for Cornix
    const cleanSymbol = this.parseSymbol(symbol);
    
    // Build tag string (if exists)
    const tagString = tag ? ` ${tag}` : '';
    
    // Cornix CLOSE command: /close SYMBOL #TAG
    // This closes the open position when SFP SL line is broken
    // The 'side' indicates which position to close (long or short)
    const command = `/close ${cleanSymbol}${tagString}`;
    
    logger.debug('Cornix CLOSE command formatted (SL triggered)', {
      input: data,
      output: command,
      side: side,
      reason: 'SFP SL line broken'
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
