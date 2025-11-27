/**
 * Environment Configuration Manager
 * Loads and validates all required environment variables
 */

require('dotenv').config();

class EnvConfig {
  constructor() {
    this.validate();
  }

  validate() {
    const required = [
      'PORT',
      'WEBHOOK_SECRET',
      'TELEGRAM_BOT_TOKEN',
      'TELEGRAM_CHAT_ID'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:');
      missing.forEach(key => console.error(`   - ${key}`));
      console.error('\n📋 Please copy .env.example to .env and fill in all values');
      process.exit(1);
    }
  }

  get PORT() {
    return process.env.PORT || 3000;
  }

  get WEBHOOK_SECRET() {
    return process.env.WEBHOOK_SECRET;
  }

  get TELEGRAM_BOT_TOKEN() {
    return process.env.TELEGRAM_BOT_TOKEN;
  }

  get TELEGRAM_CHAT_ID() {
    return process.env.TELEGRAM_CHAT_ID;
  }

  get NODE_ENV() {
    return process.env.NODE_ENV || 'development';
  }

  get TELEGRAM_API_BASE_URL() {
    return process.env.TELEGRAM_API_BASE_URL || 'https://api.telegram.org';
  }

  get TELEGRAM_API_PROXY() {
    return process.env.TELEGRAM_API_PROXY || null;
  }

  get LOG_LEVEL() {
    return process.env.LOG_LEVEL || 'info';
  }
}

module.exports = new EnvConfig();
