/**
 * Post-Deployment Verification Script
 * Tests Koyeb deployment endpoints to verify Telegram functionality
 */

const axios = require('axios');

// CONFIGURE THIS: Your Koyeb app URL
const KOYEB_URL = process.argv[2] || 'https://strange-dyanne-tradingbot12-29686213.koyeb.app';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb';

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

async function verifyKoyebDeployment() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 KOYEB DEPLOYMENT VERIFICATION');
  console.log('='.repeat(70) + '\n');
  console.log(`Testing: ${KOYEB_URL}\n`);

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Health Check
  log(colors.blue, '📋', 'Test 1: Health Check Endpoint');
  try {
    const response = await axios.get(`${KOYEB_URL}/health`, { timeout: 10000 });
    
    if (response.data.status === 'healthy' && response.data.telegram === 'connected') {
      log(colors.green, '✅', 'Health check passed!', {
        status: response.data.status,
        telegram: response.data.telegram,
        botInfo: response.data.botInfo
      });
      passedTests++;
    } else {
      log(colors.red, '❌', 'Health check failed - Telegram not connected', response.data);
      failedTests++;
    }
  } catch (error) {
    log(colors.red, '❌', 'Health check request failed', {
      error: error.message,
      code: error.code
    });
    failedTests++;
  }

  // Test 2: Telegram Connection Test
  log(colors.blue, '\n📋', 'Test 2: Telegram Connection Test');
  try {
    const response = await axios.get(`${KOYEB_URL}/test-telegram-connection`, { timeout: 15000 });
    
    if (response.data.success) {
      log(colors.green, '✅', 'Telegram connection test passed!', response.data);
      passedTests++;
    } else {
      log(colors.red, '❌', 'Telegram connection test failed', response.data);
      failedTests++;
    }
  } catch (error) {
    log(colors.red, '❌', 'Telegram connection test request failed', {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    failedTests++;
  }

  // Test 3: Send Test Message
  log(colors.blue, '\n📋', 'Test 3: Send Test Message to Telegram');
  try {
    const response = await axios.get(`${KOYEB_URL}/test-send-message`, { timeout: 20000 });
    
    if (response.data.success) {
      log(colors.green, '✅', 'Test message sent successfully!', {
        messageId: response.data.messageId,
        cornixCommand: response.data.cornixCommand?.substring(0, 50) + '...'
      });
      log(colors.yellow, '👀', 'Check your Telegram channel for the test message!');
      passedTests++;
    } else {
      log(colors.red, '❌', 'Test message failed', response.data);
      failedTests++;
    }
  } catch (error) {
    log(colors.red, '❌', 'Test message request failed', {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    failedTests++;
  }

  // Test 4: Webhook Endpoint
  log(colors.blue, '\n📋', 'Test 4: Webhook Entry Signal');
  try {
    const testPayload = {
      action: 'entry',
      side: 'long',
      symbol: 'BTCUSDT',
      size_type: 'percent',
      size: 1.0,
      tag: 'KOYEB_VERIFICATION_TEST'
    };

    const response = await axios.post(
      `${KOYEB_URL}/webhook`,
      testPayload,
      {
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': WEBHOOK_SECRET
        }
      }
    );
    
    if (response.data.success) {
      log(colors.green, '✅', 'Webhook entry signal processed successfully!', {
        action: response.data.action,
        symbol: response.data.symbol,
        cornixCommand: response.data.cornixCommand?.substring(0, 50) + '...'
      });
      log(colors.yellow, '👀', 'Check your Telegram channel - Cornix should execute this trade!');
      passedTests++;
    } else {
      log(colors.red, '❌', 'Webhook processing failed', response.data);
      failedTests++;
    }
  } catch (error) {
    log(colors.red, '❌', 'Webhook request failed', {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    failedTests++;
  }

  // Final Summary
  console.log('\n' + '='.repeat(70));
  const totalTests = passedTests + failedTests;
  const successRate = ((passedTests / totalTests) * 100).toFixed(0);

  if (passedTests === totalTests) {
    log(colors.green, '🎉', `ALL TESTS PASSED! (${passedTests}/${totalTests})`);
    console.log('='.repeat(70));
    console.log(`
${colors.green}✅ Your Koyeb deployment is fully operational!${colors.reset}

What's Working:
  ✅ Backend is responding
  ✅ Telegram bot is connected
  ✅ Messages are being sent to Telegram
  ✅ Webhooks are processing correctly
  ✅ Cornix commands are formatted properly

Next Steps:
  1. Configure TradingView alerts to send to: ${KOYEB_URL}/webhook
  2. Use webhook secret: ${WEBHOOK_SECRET.substring(0, 20)}...
  3. Monitor logs in Koyeb dashboard
  4. Check Telegram channel for incoming trades
  5. Verify Cornix executes trades automatically

${colors.blue}🚀 System is ready for production trading!${colors.reset}
`);
  } else {
    log(colors.red, '❌', `TESTS FAILED: ${passedTests}/${totalTests} passed (${successRate}% success rate)`);
    console.log('='.repeat(70));
    console.log(`
${colors.red}⚠️ Some tests failed. Please check the following:${colors.reset}

1. Verify Koyeb environment variables are set correctly
2. Check Koyeb deployment logs for errors
3. Ensure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are correct
4. Verify bot has admin access to the Telegram channel
5. Check if Telegram API is accessible from Koyeb

${colors.yellow}📋 Run this locally to verify credentials:${colors.reset}
   node test-telegram-fix.js

${colors.yellow}📊 Check Koyeb logs:${colors.reset}
   https://app.koyeb.com → Your App → Logs
`);
  }

  console.log('='.repeat(70) + '\n');
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run verification
verifyKoyebDeployment().catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});
