/**
 * Complete Diagnostic Test for Koyeb Deployment
 * Run this after deploying to identify any issues
 */

const axios = require('axios');

const KOYEB_URL = process.argv[2] || 'https://strange-dyanne-tradingbot12-29686213.koyeb.app';
const WEBHOOK_SECRET = 'mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb';

console.log('\n🔍 KOYEB COMPLETE DIAGNOSTIC TEST');
console.log('='.repeat(70));
console.log(`Testing: ${KOYEB_URL}\n`);

async function runDiagnostics() {
  let passed = 0;
  let failed = 0;

  // Test 1: Environment Variables
  console.log('📋 Test 1: Environment Variables');
  try {
    const response = await axios.get(`${KOYEB_URL}/debug/env`);
    const data = response.data;
    
    const tokenPresent = data.variables?.TELEGRAM_BOT_TOKEN?.present;
    const chatIdPresent = data.variables?.TELEGRAM_CHAT_ID?.present;
    const tokenValid = data.variables?.TELEGRAM_BOT_TOKEN?.format === 'valid';
    
    if (tokenPresent && chatIdPresent && tokenValid) {
      console.log('✅ PASS: All environment variables loaded correctly\n');
      passed++;
    } else {
      console.log('❌ FAIL: Environment variables missing or invalid');
      console.log('Token present:', tokenPresent);
      console.log('Chat ID present:', chatIdPresent);
      console.log('Token format:', data.variables?.TELEGRAM_BOT_TOKEN?.format);
      console.log('\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL:', error.message, '\n');
    failed++;
  }

  // Test 2: Telegram Bot Connection
  console.log('📋 Test 2: Telegram Bot Connection');
  try {
    const response = await axios.get(`${KOYEB_URL}/test-telegram-connection`);
    if (response.data.success) {
      console.log('✅ PASS: Telegram bot connected\n');
      passed++;
    } else {
      console.log('❌ FAIL: Telegram bot not connected');
      console.log(response.data);
      console.log('\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL:', error.response?.data || error.message, '\n');
    failed++;
  }

  // Test 3: Send Test Message
  console.log('📋 Test 3: Send Test Message to Telegram');
  try {
    const response = await axios.get(`${KOYEB_URL}/test-send-message`, {
      timeout: 20000
    });
    if (response.data.success) {
      console.log('✅ PASS: Test message sent to Telegram');
      console.log('Message ID:', response.data.messageId);
      console.log('\n');
      passed++;
    } else {
      console.log('❌ FAIL: Could not send test message');
      console.log(response.data);
      console.log('\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL:', error.response?.data || error.message, '\n');
    failed++;
  }

  // Test 4: Webhook with Header Authentication
  console.log('📋 Test 4: Webhook (Header Authentication)');
  try {
    const response = await axios.post(
      `${KOYEB_URL}/webhook`,
      {
        action: 'entry',
        side: 'long',
        symbol: 'BTCUSDT',
        size_type: 'percent',
        size: 1.0,
        tag: 'DIAGNOSTIC_TEST_HEADER'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': WEBHOOK_SECRET
        },
        timeout: 20000
      }
    );
    
    if (response.data.success) {
      console.log('✅ PASS: Webhook processed with header auth');
      console.log('Cornix command:', response.data.cornixCommand?.substring(0, 50) + '...');
      console.log('\n');
      passed++;
    } else {
      console.log('❌ FAIL: Webhook returned unsuccessful');
      console.log(response.data);
      console.log('\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL:', error.response?.data || error.message);
    if (error.response?.data) {
      console.log('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    console.log('\n');
    failed++;
  }

  // Test 5: Webhook with Query Parameter Authentication
  console.log('📋 Test 5: Webhook (Query Parameter Authentication)');
  try {
    const response = await axios.post(
      `${KOYEB_URL}/webhook?token=${WEBHOOK_SECRET}`,
      {
        action: 'entry',
        side: 'short',
        symbol: 'ETHUSDT',
        size_type: 'percent',
        size: 2.0,
        tag: 'DIAGNOSTIC_TEST_QUERY'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );
    
    if (response.data.success) {
      console.log('✅ PASS: Webhook processed with query param auth');
      console.log('Cornix command:', response.data.cornixCommand?.substring(0, 50) + '...');
      console.log('\n');
      passed++;
    } else {
      console.log('❌ FAIL: Webhook returned unsuccessful');
      console.log(response.data);
      console.log('\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL:', error.response?.data || error.message);
    if (error.response?.data) {
      console.log('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    console.log('\n');
    failed++;
  }

  // Final Summary
  console.log('='.repeat(70));
  console.log(`\n📊 RESULTS: ${passed}/${passed + failed} tests passed\n`);

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Your Koyeb deployment is fully operational!');
    console.log('\n✅ Next steps:');
    console.log('   1. Check your Telegram channel for test messages');
    console.log('   2. Verify Cornix executed the test trades');
    console.log('   3. Configure TradingView to send webhooks');
    console.log('   4. Monitor Koyeb logs for incoming trades\n');
  } else {
    console.log('❌ SOME TESTS FAILED. Please check the errors above.');
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check Koyeb environment variables are set correctly');
    console.log('   2. Review Koyeb logs for detailed errors');
    console.log('   3. Verify TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are correct');
    console.log('   4. Ensure Cornix bot is in the Telegram channel\n');
  }

  console.log('='.repeat(70) + '\n');
  process.exit(failed > 0 ? 1 : 0);
}

runDiagnostics().catch(error => {
  console.error('Diagnostic test crashed:', error);
  process.exit(1);
});
