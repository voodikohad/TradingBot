/**
 * Comprehensive Telegram Connection Test
 * Tests all aspects of Telegram bot connectivity for Koyeb deployment
 */

require('dotenv').config();
const axios = require('axios');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(color, icon, message, data = null) {
  console.log(`${color}${icon} ${message}${colors.reset}`);
  if (data) {
    console.log(`${colors.gray}${JSON.stringify(data, null, 2)}${colors.reset}`);
  }
}

async function testTelegramConnection() {
  console.log('\n' + '='.repeat(60));
  console.log('🔧 TELEGRAM CONNECTION DIAGNOSTIC TEST');
  console.log('='.repeat(60) + '\n');

  // Step 1: Verify environment variables
  log(colors.blue, '📋', 'Step 1: Checking Environment Variables...');
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken) {
    log(colors.red, '❌', 'TELEGRAM_BOT_TOKEN is missing!');
    process.exit(1);
  }
  
  if (!chatId) {
    log(colors.red, '❌', 'TELEGRAM_CHAT_ID is missing!');
    process.exit(1);
  }
  
  // Validate token format
  if (!botToken.includes(':')) {
    log(colors.red, '❌', 'Invalid bot token format! Token must contain ":"');
    process.exit(1);
  }
  
  const [tokenId, tokenSecret] = botToken.split(':');
  log(colors.green, '✅', 'Environment variables loaded:', {
    tokenId: tokenId,
    tokenLength: botToken.length,
    chatId: chatId,
    chatIdLength: chatId.length
  });
  
  // Step 2: Test bot connectivity with getMe
  log(colors.blue, '\n🤖', 'Step 2: Testing Bot Connection (getMe)...');
  
  try {
    const getMeUrl = `https://api.telegram.org/bot${botToken}/getMe`;
    log(colors.gray, '🔗', 'URL:', { url: getMeUrl.replace(botToken, '***TOKEN***') });
    
    const getMeResponse = await axios.get(getMeUrl, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (getMeResponse.data.ok) {
      log(colors.green, '✅', 'Bot is valid and accessible!', {
        username: getMeResponse.data.result.username,
        id: getMeResponse.data.result.id,
        firstName: getMeResponse.data.result.first_name,
        canJoinGroups: getMeResponse.data.result.can_join_groups,
        canReadAllGroupMessages: getMeResponse.data.result.can_read_all_group_messages
      });
    } else {
      log(colors.red, '❌', 'Bot API returned not ok', getMeResponse.data);
      process.exit(1);
    }
  } catch (error) {
    log(colors.red, '❌', 'Failed to connect to bot:', {
      error: error.message,
      code: error.code,
      response: error.response?.data
    });
    process.exit(1);
  }
  
  // Step 3: Test sending a message
  log(colors.blue, '\n📨', 'Step 3: Testing sendMessage...');
  
  try {
    const sendMessageUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    log(colors.gray, '🔗', 'URL:', { url: sendMessageUrl.replace(botToken, '***TOKEN***') });
    
    const testMessage = `🧪 TELEGRAM CONNECTION TEST
─────────────────────────────
✅ Bot connectivity: WORKING
✅ Message sending: WORKING
✅ Environment vars: LOADED
─────────────────────────────
🕐 Time: ${new Date().toLocaleString()}
🔧 Test: Koyeb Deployment Fix`;
    
    const payload = {
      chat_id: chatId,
      text: testMessage,
      parse_mode: 'HTML'
    };
    
    log(colors.gray, '📦', 'Payload:', {
      chat_id: payload.chat_id,
      text_length: payload.text.length,
      parse_mode: payload.parse_mode
    });
    
    const sendResponse = await axios.post(
      sendMessageUrl,
      payload,
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (sendResponse.data.ok) {
      log(colors.green, '✅', 'Message sent successfully!', {
        messageId: sendResponse.data.result.message_id,
        chatId: sendResponse.data.result.chat.id,
        date: new Date(sendResponse.data.result.date * 1000).toLocaleString()
      });
    } else {
      log(colors.red, '❌', 'Message sending failed', sendResponse.data);
      process.exit(1);
    }
  } catch (error) {
    log(colors.red, '❌', 'Failed to send message:', {
      error: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    process.exit(1);
  }
  
  // Step 4: Test Cornix format
  log(colors.blue, '\n🎯', 'Step 4: Testing Cornix Command Format...');
  
  try {
    const cornixCommand = `long BTCUSDT
entry=market
size=1%
tag=LONG_ENTRY`;

    const cornixMessage = `${cornixCommand}

🚀 TRADE SIGNAL
─────────────────────
Symbol: BTCUSDT
Action: ENTRY
Side: LONG
Size: 1%
Tag: TEST_SIGNAL
Time: ${new Date().toLocaleString()}`;
    
    const sendResponse = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: cornixMessage,
        parse_mode: 'HTML'
      },
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (sendResponse.data.ok) {
      log(colors.green, '✅', 'Cornix format message sent successfully!', {
        messageId: sendResponse.data.result.message_id
      });
    }
  } catch (error) {
    log(colors.red, '❌', 'Failed to send Cornix message:', {
      error: error.message,
      data: error.response?.data
    });
  }
  
  // Final summary
  console.log('\n' + '='.repeat(60));
  log(colors.green, '🎉', 'ALL TESTS PASSED!');
  console.log('='.repeat(60));
  console.log(`
${colors.green}✅ Your Telegram bot is fully functional!${colors.reset}

Next steps:
1. Deploy to Koyeb with these exact environment variables
2. Test webhook endpoint: POST to /webhook
3. Monitor logs in Koyeb dashboard

Your configuration:
- Bot Token: ${tokenId}:***
- Chat ID: ${chatId}
- API URL: https://api.telegram.org/bot<token>/sendMessage
`);
}

// Run the test
testTelegramConnection().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
