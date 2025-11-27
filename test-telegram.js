/**
 * Telegram API Test Script
 * Tests bot connectivity and message sending
 */

require('dotenv').config();
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

console.log('🧪 Telegram API Test\n');
console.log('═══════════════════════════════════════');
console.log('Configuration:');
console.log('Bot Token:', BOT_TOKEN ? `${BOT_TOKEN.substring(0, 10)}...` : '❌ MISSING');
console.log('Chat ID:', CHAT_ID || '❌ MISSING');
console.log('═══════════════════════════════════════\n');

async function testGetMe() {
  console.log('📡 Test 1: Checking bot with getMe...');
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/getMe`;
  
  try {
    const response = await axios.get(url, { timeout: 10000 });
    
    if (response.data.ok) {
      console.log('✅ Bot is valid and reachable!');
      console.log('   Bot Name:', response.data.result.username);
      console.log('   Bot ID:', response.data.result.id);
      console.log('   First Name:', response.data.result.first_name);
      return true;
    } else {
      console.log('❌ Bot check failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Bot check error:', error.response?.data || error.message);
    if (error.code === 'ENOTFOUND') {
      console.log('   → DNS resolution failed. Network issue or Telegram blocked.');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   → Request timed out. Network issue or firewall blocking Telegram.');
    } else if (error.response?.status === 404) {
      console.log('   → Bot token is invalid or malformed.');
    } else if (error.response?.status === 401) {
      console.log('   → Bot token is unauthorized.');
    }
    return false;
  }
}

async function testSendMessage() {
  console.log('\n📡 Test 2: Sending test message to channel...');
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const payload = {
    chat_id: CHAT_ID,
    text: `🧪 Test message from TradingBot backend\n\nTimestamp: ${new Date().toLocaleString()}\n\nIf you see this, the Telegram API is working! ✅`,
    parse_mode: 'Markdown'
  };
  
  console.log('   URL:', url.replace(BOT_TOKEN, BOT_TOKEN.substring(0, 10) + '...'));
  console.log('   Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await axios.post(url, payload, { timeout: 10000 });
    
    if (response.data.ok) {
      console.log('✅ Message sent successfully!');
      console.log('   Message ID:', response.data.result.message_id);
      console.log('   Chat:', response.data.result.chat.title || response.data.result.chat.id);
      return true;
    } else {
      console.log('❌ Message send failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Message send error:', error.response?.data || error.message);
    if (error.response?.status === 400) {
      console.log('   → Bad Request. Check chat_id format.');
      console.log('   → For channels, it must be -100XXXXXXXXXX format.');
    } else if (error.response?.status === 403) {
      console.log('   → Forbidden. Bot is not a member of the channel or was blocked.');
    } else if (error.response?.status === 404) {
      console.log('   → Not Found. Chat not found or bot not in channel.');
    }
    return false;
  }
}

async function testCornixCommand() {
  console.log('\n📡 Test 3: Sending Cornix command...');
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const cornixMessage = `🚀 TRADE SIGNAL EXECUTED
═══════════════════════════
Symbol: BTCUSDT
Action: ENTRY
Side: LONG
Size: 1%
Tag: LONG_ENTRY
═══════════════════════════
Cornix Command:
/entry BTCUSDT long 1% LONG_ENTRY

Timestamp: ${new Date().toLocaleString()}`;
  
  const payload = {
    chat_id: CHAT_ID,
    text: cornixMessage,
    parse_mode: 'Markdown'
  };
  
  try {
    const response = await axios.post(url, payload, { timeout: 10000 });
    
    if (response.data.ok) {
      console.log('✅ Cornix command sent successfully!');
      console.log('   Message ID:', response.data.result.message_id);
      console.log('\n⏳ Now check your Telegram channel:');
      console.log('   1. Message should appear');
      console.log('   2. Cornix bot should respond if configured correctly');
      return true;
    } else {
      console.log('❌ Cornix command send failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Cornix command error:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('Starting tests...\n');
  
  // Test 1: Bot validity
  const botValid = await testGetMe();
  if (!botValid) {
    console.log('\n❌ Bot validation failed. Fix the bot token first.\n');
    return;
  }
  
  // Test 2: Send simple message
  const messageSuccess = await testSendMessage();
  if (!messageSuccess) {
    console.log('\n❌ Message send failed. Check chat_id and bot permissions.\n');
    return;
  }
  
  // Test 3: Send Cornix command
  await testCornixCommand();
  
  console.log('\n═══════════════════════════════════════');
  console.log('✅ All tests completed!');
  console.log('═══════════════════════════════════════\n');
}

// Run tests
runTests().catch(error => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});
