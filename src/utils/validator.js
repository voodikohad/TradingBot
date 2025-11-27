/**
 * Input Validation and Sanitization
 * Ensures TradingView webhook data is safe and properly formatted
 */

class Validator {
  /**
   * Validates TradingView webhook JSON structure
   * @param {Object} data - Raw webhook data
   * @returns {Object} { isValid: boolean, errors: Array, data: Object }
   */
  validateWebhookData(data) {
    const errors = [];

    // Check required fields
    if (!data.action) errors.push('Missing required field: action');
    if (!data.side) errors.push('Missing required field: side');
    if (!data.symbol) errors.push('Missing required field: symbol');
    
    // For entry actions, require size and at least TP1 + SL
    if (data.action === 'entry') {
      if (data.size_type === undefined) errors.push('Missing required field: size_type (required for entry)');
      if (data.size === undefined) errors.push('Missing required field: size (required for entry)');
      // Cornix requires at least TP and SL in entry signals
      if (!data.tp1 && !data.tp_1) errors.push('Missing required field: tp1 (at least TP1 is required for entry)');
      if (!data.sl && !data.stop_loss) errors.push('Missing required field: sl (stop loss is required for entry)');
    }

    // Validate field values
    if (data.action && !['entry', 'sl', 'tp', 'exit'].includes(data.action)) {
      errors.push(`Invalid action: ${data.action}. Must be: entry, sl, tp, or exit`);
    }

    if (data.side && !['long', 'short'].includes(data.side)) {
      errors.push(`Invalid side: ${data.side}. Must be: long or short`);
    }

    if (data.size_type && !['percent', 'usd'].includes(data.size_type)) {
      errors.push(`Invalid size_type: ${data.size_type}. Must be: percent or usd`);
    }

    // Validate size is a positive number (if provided)
    if (data.size !== undefined) {
      const size = parseFloat(data.size);
      if (isNaN(size) || size <= 0) {
        errors.push(`Invalid size: ${data.size}. Must be a positive number`);
      }
    }

    // Validate TP levels (if provided)
    ['tp1', 'tp_1', 'tp2', 'tp_2', 'tp3', 'tp_3', 'tp4', 'tp_4', 'tp5', 'tp_5'].forEach(field => {
      if (data[field] !== undefined) {
        const price = parseFloat(data[field]);
        if (isNaN(price) || price <= 0) {
          errors.push(`Invalid ${field}: ${data[field]}. Must be a positive number`);
        }
      }
    });

    // Validate SL (if provided)
    ['sl', 'stop_loss'].forEach(field => {
      if (data[field] !== undefined) {
        const price = parseFloat(data[field]);
        if (isNaN(price) || price <= 0) {
          errors.push(`Invalid ${field}: ${data[field]}. Must be a positive number`);
        }
      }
    });

    // Sanitize symbol - allow exchange prefix format (e.g., BYBIT:BTCUSDT.P)
    // Allowed: letters, numbers, colon, dot, dash, underscore
    if (data.symbol && !/^[A-Z0-9:._-]+$/i.test(data.symbol)) {
      errors.push(`Invalid symbol format: ${data.symbol}`);
    }

    // Sanitize tag if provided (alphanumeric, dash, underscore, hash only)
    if (data.tag && !/^[A-Z0-9_#-]+$/i.test(data.tag)) {
      errors.push(`Invalid tag format: ${data.tag}`);
    }

    // Validate tp_number for take-profit trigger actions (1-5)
    if (data.action === 'tp' && data.tp_number !== undefined) {
      const tpNum = parseInt(data.tp_number);
      if (isNaN(tpNum) || tpNum < 1 || tpNum > 5) {
        errors.push(`Invalid tp_number: ${data.tp_number}. Must be between 1 and 5`);
      }
    }

    // Validate leverage (if provided)
    if (data.leverage !== undefined) {
      const lev = parseFloat(data.leverage);
      if (isNaN(lev) || lev < 1 || lev > 125) {
        errors.push(`Invalid leverage: ${data.leverage}. Must be between 1 and 125`);
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
      action: data.action.toLowerCase(),
      side: data.side.toLowerCase(),
      symbol: data.symbol.toUpperCase(),
      tag: data.tag ? this.sanitizeTag(data.tag) : null
    };

    // Add optional fields only if present
    if (data.size_type !== undefined) {
      sanitized.size_type = data.size_type.toLowerCase();
    }
    if (data.size !== undefined) {
      sanitized.size = parseFloat(data.size);
    }
    if (data.tp_number !== undefined) {
      sanitized.tp_number = parseInt(data.tp_number);
    }
    if (data.leverage !== undefined) {
      sanitized.leverage = parseFloat(data.leverage);
    }

    // Add TP levels (support both tp1 and tp_1 formats)
    if (data.tp1 || data.tp_1) sanitized.tp1 = parseFloat(data.tp1 || data.tp_1);
    if (data.tp2 || data.tp_2) sanitized.tp2 = parseFloat(data.tp2 || data.tp_2);
    if (data.tp3 || data.tp_3) sanitized.tp3 = parseFloat(data.tp3 || data.tp_3);
    if (data.tp4 || data.tp_4) sanitized.tp4 = parseFloat(data.tp4 || data.tp_4);
    if (data.tp5 || data.tp_5) sanitized.tp5 = parseFloat(data.tp5 || data.tp_5);

    // Add SL (support both sl and stop_loss formats)
    if (data.sl || data.stop_loss) {
      sanitized.sl = parseFloat(data.sl || data.stop_loss);
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
