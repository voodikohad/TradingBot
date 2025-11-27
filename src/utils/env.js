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
      missing.forEach(key => {
        console.error(`   - ${key} (value: ${process.env[key] || 'UNDEFINED'})`);
      });
      console.error('\n📋 Available environment variables:');
      console.error(Object.keys(process.env).filter(k => k.includes('TELEGRAM') || k.includes('WEBHOOK')).join(', '));
      console.error('\n📋 Please set these in Koyeb Dashboard → Settings → Environment');
      console.error('   OR copy .env.example to .env for local development');
      process.exit(1);
    }
    
    // Additional validation: ensure values aren't just empty strings
    const empty = required.filter(key => process.env[key] === '');
    if (empty.length > 0) {
      console.error('❌ Environment variables are set but EMPTY:');
      empty.forEach(key => console.error(`   - ${key}`));
      console.error('\n📋 Set proper values in Koyeb Dashboard → Settings → Environment');
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
