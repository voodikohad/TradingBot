/**
 * Environment Variable Diagnostic Tool
 * Checks if environment variables are loaded correctly in Koyeb
 */

require('dotenv').config();

console.log('\n' + '='.repeat(70));
console.log('🔍 ENVIRONMENT VARIABLES DIAGNOSTIC');
console.log('='.repeat(70) + '\n');

console.log('Environment:', process.env.NODE_ENV || 'not set');
console.log('');

// Check each required variable
const vars = {
  'PORT': process.env.PORT,
  'WEBHOOK_SECRET': process.env.WEBHOOK_SECRET,
  'TELEGRAM_BOT_TOKEN': process.env.TELEGRAM_BOT_TOKEN,
  'TELEGRAM_CHAT_ID': process.env.TELEGRAM_CHAT_ID,
  'LOG_LEVEL': process.env.LOG_LEVEL
};

let allPresent = true;

for (const [key, value] of Object.entries(vars)) {
  const isPresent = !!value;
  const status = isPresent ? '✅' : '❌';
  
  if (!isPresent) {
    allPresent = false;
    console.log(`${status} ${key}: MISSING`);
  } else {
    // Show partial value for security
    let displayValue = value;
    if (key === 'TELEGRAM_BOT_TOKEN') {
      const parts = value.split(':');
      displayValue = parts[0] + ':' + (parts[1] ? '***' : 'INVALID_FORMAT');
    } else if (key === 'WEBHOOK_SECRET') {
      displayValue = value.substring(0, 20) + '...';
    }
    
    console.log(`${status} ${key}: ${displayValue} (length: ${value.length})`);
  }
}

console.log('');

// Validate bot token format
if (vars['TELEGRAM_BOT_TOKEN']) {
  const token = vars['TELEGRAM_BOT_TOKEN'];
  const hasColon = token.includes(':');
  const parts = token.split(':');
  const validFormat = hasColon && parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
  
  console.log('Bot Token Format:');
  console.log(`  Has colon: ${hasColon ? '✅' : '❌'}`);
  console.log(`  Bot ID: ${parts[0] || 'MISSING'}`);
  console.log(`  Secret length: ${parts[1]?.length || 0}`);
  console.log(`  Valid format: ${validFormat ? '✅' : '❌'}`);
  console.log('');
}

// Test loading env module
console.log('Testing env module import...');
try {
  const env = require('./src/utils/env');
  console.log('✅ env module loaded successfully');
  console.log(`  PORT: ${env.PORT}`);
  console.log(`  TELEGRAM_BOT_TOKEN: ${env.TELEGRAM_BOT_TOKEN ? env.TELEGRAM_BOT_TOKEN.split(':')[0] + ':***' : 'MISSING'}`);
  console.log(`  TELEGRAM_CHAT_ID: ${env.TELEGRAM_CHAT_ID}`);
} catch (error) {
  console.log('❌ env module failed to load:', error.message);
}

console.log('');
console.log('='.repeat(70));

if (allPresent) {
  console.log('✅ ALL ENVIRONMENT VARIABLES ARE PRESENT');
} else {
  console.log('❌ SOME ENVIRONMENT VARIABLES ARE MISSING');
  console.log('');
  console.log('In Koyeb, set these in:');
  console.log('Dashboard → Your App → Settings → Environment');
}

console.log('='.repeat(70) + '\n');
