/**
 * Input Validation and Sanitization
 * Ensures TradingView webhook data is safe and properly formatted
 */

class Validator {
  /**
   * Detects and normalizes the new TradingView JSON format
   * Converts nested structure to flat structure compatible with existing handlers
   * @param {Object} data - Raw webhook data (could be new or old format)
   * @returns {Object} Normalized flat data structure
   */
  normalizeNewFormat(data) {
    // Check if this is the array-based format (has trade object and arrays)
    if (data.trade && data.trade.side && Array.isArray(data.take_profit_targets)) {
      const normalized = {
        // Extract from trade object
        symbol: data.symbol || data.pair?.replace('/', ''),
        side: data.trade.side ? data.trade.side.toLowerCase() : (data.position ? data.position.toLowerCase() : null),
        size: parseFloat(data.trade.size) || 1,
        size_type: 'percent',
        tag: data.trade.tag ? (data.trade.tag.startsWith('#') ? data.trade.tag : '#' + data.trade.tag) : '#SFP_SL',
        
        // Extract action from signal_type and position
        action: 'entry', // Array format is always entry
        
        // Extract leverage from nested object or string
        leverage: this.extractLeverageFromObject(data.leverage),
        
        // Extract TP targets from array
        tp1: data.take_profit_targets[0] ? parseFloat(data.take_profit_targets[0].price) : null,
        tp2: data.take_profit_targets[1] ? parseFloat(data.take_profit_targets[1].price) : null,
        tp3: data.take_profit_targets[2] ? parseFloat(data.take_profit_targets[2].price) : null,
        tp4: data.take_profit_targets[3] ? parseFloat(data.take_profit_targets[3].price) : null,
        tp5: data.take_profit_targets[4] ? parseFloat(data.take_profit_targets[4].price) : null,
        
        // Extract SL from array
        sl: data.stop_targets && data.stop_targets[0] ? parseFloat(data.stop_targets[0].price) : null,
        
        // Store original format metadata
        _original_format: 'array',
        entry: data.entry,
        exchange: data.exchange,
        trailing_configuration: data.trailing_configuration
      };
      
      // Remove null and NaN values
      Object.keys(normalized).forEach(key => {
        if ((normalized[key] === null || (typeof normalized[key] === 'number' && isNaN(normalized[key]))) && !key.startsWith('_')) {
          delete normalized[key];
        }
      });
      
      return normalized;
    }
    
    // Check if this is the new format (has trade_signal object)
    if (data.trade_signal && data.trade_signal.symbol) {
      const normalized = {
        // Extract from trade_signal
        symbol: data.trade_signal.symbol || data.pair,
        side: data.trade_signal.side ? data.trade_signal.side.toLowerCase() : null,
        size: parseFloat(data.trade_signal.size) || parseFloat(data.position_size),
        size_type: 'percent', // The new format uses percentage
        tag: data.trade_signal.tag || '#SFP_SL',
        
        // Extract action from signal_type
        action: this.extractAction(data.signal_type),
        
        // Extract leverage (remove 'X' and 'Isolated' prefix)
        leverage: this.extractLeverage(data.leverage),
        
        // Extract TP targets from nested object (only if they exist)
        tp1: data.take_profit_targets && data.take_profit_targets['1'] !== undefined ? parseFloat(data.take_profit_targets['1']) : null,
        tp2: data.take_profit_targets && data.take_profit_targets['2'] !== undefined ? parseFloat(data.take_profit_targets['2']) : null,
        tp3: data.take_profit_targets && data.take_profit_targets['3'] !== undefined ? parseFloat(data.take_profit_targets['3']) : null,
        tp4: data.take_profit_targets && data.take_profit_targets['4'] !== undefined ? parseFloat(data.take_profit_targets['4']) : null,
        tp5: data.take_profit_targets && data.take_profit_targets['5'] !== undefined ? parseFloat(data.take_profit_targets['5']) : null,
        
        // Extract SL from stop_targets
        sl: data.stop_targets && data.stop_targets['1'] !== undefined ? parseFloat(data.stop_targets['1']) : null,
        
        // Store original format metadata
        _original_format: 'new',
        entry_type: data.entry_type,
        exchange: data.exchange,
        trailing_configuration: data.trailing_configuration
      };
      
      // Remove null and NaN values
      Object.keys(normalized).forEach(key => {
        if ((normalized[key] === null || (typeof normalized[key] === 'number' && isNaN(normalized[key]))) && !key.startsWith('_')) {
          delete normalized[key];
        }
      });
      
      return normalized;
    }
    
    // Old format, return as-is
    return { ...data, _original_format: 'legacy' };
  }

  /**
   * Extracts action type from signal_type string
   * Examples: "Regular (Long)" -> "entry", "Regular (Short)" -> "entry"
   * @param {string} signalType - Signal type from new format
   * @returns {string} Action type (entry, sl, tp, exit)
   */
  extractAction(signalType) {
    if (!signalType) return 'entry';
    
    const lower = signalType.toLowerCase();
    if (lower.includes('long') || lower.includes('short')) {
      return 'entry';
    }
    if (lower.includes('stop') || lower.includes('sl')) {
      return 'sl';
    }
    if (lower.includes('take') || lower.includes('tp')) {
      return 'tp';
    }
    return 'entry'; // Default to entry
  }

  /**
   * Extracts numeric leverage from string format
   * Examples: "Isolated (10X)" -> 10, "10X" -> 10, "10" -> 10
   * @param {string|number} leverage - Leverage from new format
   * @returns {number} Numeric leverage value
   */
  extractLeverage(leverage) {
    if (!leverage) return null;
    
    if (typeof leverage === 'number') return leverage;
    
    // Extract number from strings like "Isolated (10X)" or "10X"
    const match = leverage.toString().match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Extracts numeric leverage from object format
   * Examples: {type: "Isolated", value: "10X"} -> 10
   * @param {Object|string|number} leverage - Leverage from array format
   * @returns {number} Numeric leverage value
   */
  extractLeverageFromObject(leverage) {
    if (!leverage) return null;
    
    if (typeof leverage === 'number') return leverage;
    
    // Handle object format: {type: "Isolated", value: "10X"}
    if (typeof leverage === 'object' && leverage.value) {
      const match = leverage.value.toString().match(/(\d+)/);
      return match ? parseInt(match[1]) : null;
    }
    
    // Handle string format
    if (typeof leverage === 'string') {
      const match = leverage.match(/(\d+)/);
      return match ? parseInt(match[1]) : null;
    }
    
    return null;
  }

  /**
   * Validates TradingView webhook JSON structure
   * @param {Object} data - Raw webhook data
   * @returns {Object} { isValid: boolean, errors: Array, data: Object }
   */
  validateWebhookData(data) {
    const errors = [];

    // First, normalize the data if it's in the new format
    const normalizedData = this.normalizeNewFormat(data);

    // Check required fields
    if (!normalizedData.action) errors.push('Missing required field: action');
    if (!normalizedData.side) errors.push('Missing required field: side');
    if (!normalizedData.symbol) errors.push('Missing required field: symbol');
    
    // For entry actions, require size and at least TP1 + SL
    if (normalizedData.action === 'entry') {
      if (normalizedData.size_type === undefined) errors.push('Missing required field: size_type (required for entry)');
      if (normalizedData.size === undefined) errors.push('Missing required field: size (required for entry)');
      // Cornix requires at least TP and SL in entry signals
      if (!normalizedData.tp1 && !normalizedData.tp_1) errors.push('Missing required field: tp1 (at least TP1 is required for entry)');
      if (!normalizedData.sl && !normalizedData.stop_loss) errors.push('Missing required field: sl (stop loss is required for entry)');
    }

    // Validate field values
    if (normalizedData.action && !['entry', 'sl', 'tp', 'exit'].includes(normalizedData.action)) {
      errors.push(`Invalid action: ${normalizedData.action}. Must be: entry, sl, tp, or exit`);
    }

    if (normalizedData.side && !['long', 'short'].includes(normalizedData.side)) {
      errors.push(`Invalid side: ${normalizedData.side}. Must be: long or short`);
    }

    if (normalizedData.size_type && !['percent', 'usd'].includes(normalizedData.size_type)) {
      errors.push(`Invalid size_type: ${normalizedData.size_type}. Must be: percent or usd`);
    }

    // Validate size is a positive number (if provided)
    if (normalizedData.size !== undefined) {
      const size = parseFloat(normalizedData.size);
      if (isNaN(size) || size <= 0) {
        errors.push(`Invalid size: ${normalizedData.size}. Must be a positive number`);
      }
    }

    // Validate TP levels (only if they exist in the data)
    ['tp1', 'tp_1', 'tp2', 'tp_2', 'tp3', 'tp_3', 'tp4', 'tp_4', 'tp5', 'tp_5'].forEach(field => {
      if (normalizedData.hasOwnProperty(field) && normalizedData[field] !== undefined && normalizedData[field] !== null) {
        const price = parseFloat(normalizedData[field]);
        if (isNaN(price) || price <= 0) {
          errors.push(`Invalid ${field}: ${normalizedData[field]}. Must be a positive number`);
        }
      }
    });

    // Validate SL (if provided)
    ['sl', 'stop_loss'].forEach(field => {
      if (normalizedData[field] !== undefined) {
        const price = parseFloat(normalizedData[field]);
        if (isNaN(price) || price <= 0) {
          errors.push(`Invalid ${field}: ${normalizedData[field]}. Must be a positive number`);
        }
      }
    });

    // Sanitize symbol - allow exchange prefix format (e.g., BYBIT:BTCUSDT.P)
    // Allowed: letters, numbers, colon, dot, dash, underscore
    if (normalizedData.symbol && !/^[A-Z0-9:._-]+$/i.test(normalizedData.symbol)) {
      errors.push(`Invalid symbol format: ${normalizedData.symbol}`);
    }

    // Sanitize tag if provided (alphanumeric, dash, underscore, hash, dot, and space allowed)
    if (normalizedData.tag && !/^[A-Z0-9_#\-. ]+$/i.test(normalizedData.tag)) {
      errors.push(`Invalid tag format: ${normalizedData.tag}`);
    }

    // Validate tp_number for take-profit trigger actions (1-5)
    if (normalizedData.action === 'tp' && normalizedData.tp_number !== undefined) {
      const tpNum = parseInt(normalizedData.tp_number);
      if (isNaN(tpNum) || tpNum < 1 || tpNum > 5) {
        errors.push(`Invalid tp_number: ${normalizedData.tp_number}. Must be between 1 and 5`);
      }
    }

    // Validate leverage (if provided)
    if (normalizedData.leverage !== undefined) {
      const lev = parseFloat(normalizedData.leverage);
      if (isNaN(lev) || lev < 1 || lev > 125) {
        errors.push(`Invalid leverage: ${normalizedData.leverage}. Must be between 1 and 125`);
      }
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
        data: null
      };
    }

    // Sanitize and return cleaned data
    const sanitized = {
      action: normalizedData.action.toLowerCase(),
      side: normalizedData.side.toLowerCase(),
      symbol: normalizedData.symbol.toUpperCase(),
      tag: normalizedData.tag ? this.sanitizeTag(normalizedData.tag) : null
    };

    // Add optional fields only if present
    if (normalizedData.size_type !== undefined) {
      sanitized.size_type = normalizedData.size_type.toLowerCase();
    }
    if (normalizedData.size !== undefined) {
      sanitized.size = parseFloat(normalizedData.size);
    }
    if (normalizedData.tp_number !== undefined) {
      sanitized.tp_number = parseInt(normalizedData.tp_number);
    }
    if (normalizedData.leverage !== undefined) {
      sanitized.leverage = parseFloat(normalizedData.leverage);
    }

    // Add TP levels (support both tp1 and tp_1 formats)
    if (normalizedData.tp1 || normalizedData.tp_1) sanitized.tp1 = parseFloat(normalizedData.tp1 || normalizedData.tp_1);
    if (normalizedData.tp2 || normalizedData.tp_2) sanitized.tp2 = parseFloat(normalizedData.tp2 || normalizedData.tp_2);
    if (normalizedData.tp3 || normalizedData.tp_3) sanitized.tp3 = parseFloat(normalizedData.tp3 || normalizedData.tp_3);
    if (normalizedData.tp4 || normalizedData.tp_4) sanitized.tp4 = parseFloat(normalizedData.tp4 || normalizedData.tp_4);
    if (normalizedData.tp5 || normalizedData.tp_5) sanitized.tp5 = parseFloat(normalizedData.tp5 || normalizedData.tp_5);

    // Add SL (support both sl and stop_loss formats)
    if (normalizedData.sl || normalizedData.stop_loss) {
      sanitized.sl = parseFloat(normalizedData.sl || normalizedData.stop_loss);
    }
    
    // Preserve metadata from new format
    if (normalizedData._original_format) {
      sanitized._original_format = normalizedData._original_format;
    }
    if (normalizedData.entry_type) {
      sanitized.entry_type = normalizedData.entry_type;
    }
    if (normalizedData.exchange) {
      sanitized.exchange = normalizedData.exchange;
    }
    if (normalizedData.trailing_configuration) {
      sanitized.trailing_configuration = normalizedData.trailing_configuration;
    }

    return {
      isValid: true,
      errors: [],
      data: sanitized
    };
  }

  /**
   * Validates webhook secret token
   * @param {string} providedToken - Token from request
   * @param {string} expectedToken - Expected token from env
   * @returns {boolean}
   */
  validateToken(providedToken, expectedToken) {
    // Constant-time comparison to prevent timing attacks
    if (!providedToken || !expectedToken) return false;
    
    return providedToken.length === expectedToken.length &&
           [...providedToken].reduce((a, c, i) => a & (c === expectedToken[i] ? 1 : 0), 1) === 1;
  }

  /**
   * Sanitizes tag by removing # and converting to uppercase
   * @param {string} tag - Raw tag
   * @returns {string} Sanitized tag with # prefix
   */
  sanitizeTag(tag) {
    return '#' + tag.replace('#', '').toUpperCase();
  }

  /**
   * Sanitizes user input to prevent injection attacks
   * @param {string} input - User input
   * @returns {string} Sanitized input
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[<>\"']/g, '') // Remove potential HTML/JS chars
      .slice(0, 255); // Limit length
  }
}

module.exports = new Validator();
