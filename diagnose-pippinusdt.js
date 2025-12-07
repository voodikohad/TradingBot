/**
 * PIPPINUSDT.P Diagnostic Tool
 * This script will help identify why PIPPINUSDT.P signals are not opening trades in Cornix
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const SERVER_URL = 'http://localhost:3000'; // Change this to your actual server URL
const KOYEB_URL = 'https://strange-dyanne-tradingbot12-29686213.koyeb.app'; // Your Koyeb URL

console.log('🔍 PIPPINUSDT.P DIAGNOSTIC TOOL');
console.log('==============================\n');

async function runDiagnostics() {
  console.log('1. TESTING SERVER CONNECTIVITY');
  console.log('------------------------------');

  // Test 1: Check if server is running locally
  try {
    const localHealth = await axios.get(`${SERVER_URL}/health`, { timeout: 5000 });
    console.log('✅ Local server is running');
    console.log('   Status:', localHealth.data.status);
    console.log('   Telegram:', localHealth.data.telegram);
  } catch (error) {
    console.log('❌ Local server is not accessible:', error.message);
  }

  // Test 2: Check if Koyeb server is running
  try {
    const koyebHealth = await axios.get(`${KOYEB_URL}/health`, { timeout: 10000 });
    console.log('✅ Koyeb server is running');
    console.log('   Status:', koyebHealth.data.status);
    console.log('   Telegram:', koyebHealth.data.telegram);
  } catch (error) {
    console.log('❌ Koyeb server is not accessible:', error.message);
  }

  console.log('\n2. TESTING PIPPINUSDT.P WEBHOOK SIMULATION');
  console.log('------------------------------------------');

  // Test 3: Simulate PIPPINUSDT.P entry webhook
  const pippinEntryPayload = {
    action: 'entry',
    side: 'long',
    symbol: 'PIPPINUSDT.P',
    size_type: 'percent',
    size: 1.0,
    tp1: 1.2345,
    sl: 0.8765,
    tag: 'DIAGNOSTIC_TEST'
  };

  try {
    const webhookResponse = await axios.post(`${SERVER_URL}/webhook`, pippinEntryPayload, {
      headers: {
        'X-Webhook-Secret': WEBHOOK_SECRET,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('✅ PIPPINUSDT.P entry webhook processed successfully');
    console.log('   Response:', webhookResponse.data);
    console.log('   Cornix Command Generated:', webhookResponse.data.cornixCommand);
  } catch (error) {
    console.log('❌ PIPPINUSDT.P entry webhook failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', error.response.data);
    }
  }

  // Test 4: Simulate PIPPINUSDT.P SL webhook
  const pippinSlPayload = {
    action: 'sl',
    side: 'long',
    symbol: 'PIPPINUSDT.P',
    tag: 'SFP_SL'
  };

  try {
    const slResponse = await axios.post(`${SERVER_URL}/webhook`, pippinSlPayload, {
      headers: {
        'X-Webhook-Secret': WEBHOOK_SECRET,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('✅ PIPPINUSDT.P SL webhook processed successfully');
    console.log('   Response:', slResponse.data);
    console.log('   Cornix Command Generated:', slResponse.data.cornixCommand);
  } catch (error) {
    console.log('❌ PIPPINUSDT.P SL webhook failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', error.response.data);
    }
  }

  console.log('\n3. COMPARING WITH WORKING SOLUSDT.P');
  console.log('-----------------------------------');

  // Test 5: Test working SOLUSDT.P for comparison
  const solEntryPayload = {
    action: 'entry',
    side: 'long',
    symbol: 'SOLUSDT.P',
    size_type: 'percent',
    size: 1.0,
    tp1: 250.0,
    sl: 180.0,
    tag: 'DIAGNOSTIC_SOL'
  };

  try {
    const solResponse = await axios.post(`${SERVER_URL}/webhook`, solEntryPayload, {
      headers: {
        'X-Webhook-Secret': WEBHOOK_SECRET,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('✅ SOLUSDT.P entry webhook processed successfully');
    console.log('   Response:', solResponse.data);
    console.log('   Cornix Command Generated:', solResponse.data.cornixCommand);
  } catch (error) {
    console.log('❌ SOLUSDT.P entry webhook failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', error.response.data);
    }
  }

  console.log('\n4. CHECKING RECENT LOGS');
  console.log('-----------------------');

  // Test 6: Check for recent log files
  const logsDir = path.join(__dirname, 'logs');
  
  if (fs.existsSync(logsDir)) {
    const logFiles = fs.readdirSync(logsDir).filter(f => f.endsWith('.log')).sort();
    console.log('📁 Available log files:');
    logFiles.forEach(file => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   ${file} (${stats.size} bytes, modified: ${stats.mtime.toISOString()})`);
    });

    // Check today's logs
    const today = new Date().toISOString().split('T')[0];
    const todayInfoLog = path.join(logsDir, `info_${today}.log`);
    const todayErrorLog = path.join(logsDir, `error_${today}.log`);

    if (fs.existsSync(todayInfoLog)) {
      console.log(`\n📄 Today's info log (last 10 lines):`);
      const logContent = fs.readFileSync(todayInfoLog, 'utf8');
      const lines = logContent.split('\n').filter(l => l.trim()).slice(-10);
      lines.forEach(line => console.log(`   ${line}`));
    } else {
      console.log(`❌ No info log found for today (${today})`);
    }

    if (fs.existsSync(todayErrorLog)) {
      console.log(`\n🚨 Today's error log (last 5 lines):`);
      const errorContent = fs.readFileSync(todayErrorLog, 'utf8');
      const errorLines = errorContent.split('\n').filter(l => l.trim()).slice(-5);
      errorLines.forEach(line => console.log(`   ${line}`));
    } else {
      console.log(`✅ No error log found for today (${today})`);
    }
  } else {
    console.log('❌ Logs directory not found');
  }

  console.log('\n5. DIAGNOSTIC SUMMARY');
  console.log('=====================');
  console.log('Based on the test results above, here are the possible causes:');
  console.log('');
  console.log('🔍 IF WEBHOOK TESTS PASS BUT CORNIX DOESN\'T OPEN TRADES:');
  console.log('   • Check Cornix bot settings in Telegram');
  console.log('   • Verify PIPPINUSDT is supported on your exchange (Bybit/Binance)');
  console.log('   • Check if PIPPINUSDT has minimum trade size requirements');
  console.log('   • Verify Cornix autotrade is enabled for this pair');
  console.log('   • Check if there\'s a pair whitelist/blacklist in Cornix settings');
  console.log('');
  console.log('🔍 IF WEBHOOK TESTS FAIL:');
  console.log('   • Server is not running or not accessible');
  console.log('   • TradingView is not sending webhooks (check TV alert log)');
  console.log('   • Wrong webhook URL or secret token');
  console.log('   • Network/firewall issues');
  console.log('');
  console.log('🔍 IF ONLY PIPPINUSDT FAILS BUT SOLUSDT WORKS:');
  console.log('   • PIPPINUSDT might not be listed on your exchange');
  console.log('   • Different minimum trade sizes between coins');
  console.log('   • Cornix has specific settings for this pair');
  console.log('');
  console.log('📊 NEXT STEPS:');
  console.log('1. Check TradingView alert log for webhook delivery confirmation');
  console.log('2. Check Telegram channel for message delivery');
  console.log('3. Test /help command in Cornix to verify bot is active');
  console.log('4. Check your exchange (Bybit/Binance) for PIPPINUSDT pair availability');
  console.log('5. Try manual Cornix command: "Pair: PIPPINUSDT\\nAction: Long\\nEntry: Market\\nTP1: 1.2\\nStop Loss: 0.8"');
}

// Run diagnostics
runDiagnostics().catch(console.error);