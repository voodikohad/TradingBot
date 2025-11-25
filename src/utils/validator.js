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
    if (data.size_type === undefined) errors.push('Missing required field: size_type');
    if (data.size === undefined) errors.push('Missing required field: size');

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

    // Validate size is a positive number
    if (data.size !== undefined) {
      const size = parseFloat(data.size);
      if (isNaN(size) || size <= 0) {
        errors.push(`Invalid size: ${data.size}. Must be a positive number`);
      }
    }

    // Sanitize symbol (alphanumeric, dash, underscore only)
    if (data.symbol && !/^[A-Z0-9_-]+$/i.test(data.symbol)) {
      errors.push(`Invalid symbol format: ${data.symbol}`);
    }

    // Sanitize tag if provided (alphanumeric, dash, underscore, hash only)
    if (data.tag && !/^[A-Z0-9_#-]+$/i.test(data.tag)) {
      errors.push(`Invalid tag format: ${data.tag}`);
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
      size_type: data.size_type.toLowerCase(),
      size: parseFloat(data.size),
      tag: data.tag ? this.sanitizeTag(data.tag) : null
    };

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
