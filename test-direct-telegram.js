/**
 * Direct Telegram API Test
 * Minimal test without any framework dependencies
 * Run this on Koyeb to test if the platform blocks Telegram
 */

const https = require('https');

// Hardcoded for testing - replace with your actual values
const BOT_TOKEN = '8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY';
const CHAT_ID = '-1003262035445';

console.log('🧪 Direct Telegram API Test (Minimal Dependencies)\n');
console.log('═══════════════════════════════════════');
console.log('Bot Token:', BOT_TOKEN.substring(0, 15) + '...');
console.log('Chat ID:', CHAT_ID);
console.log('═══════════════════════════════════════\n');

// Test 1: getMe
function testGetMe() {
  return new Promise((resolve, reject) => {
    console.log('📡 Test 1: GET /getMe...');
    
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/getMe`,
      method: 'GET',
      headers: {
        'User-Agent': 'TradingBot/1.0'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.ok) {
            console.log('✅ Bot is valid!');
            console.log('   Username:', parsed.result.username);
            console.log('   Bot ID:', parsed.result.id);
            resolve(true);
          } else {
            console.log('❌ Bot check failed:', parsed);
            resolve(false);
          }
        } catch (e) {
          console.log('❌ Parse error:', e.message);
          console.log('   Raw response:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Request error:', error.message);
      console.log('   Code:', error.code);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('❌ Request timeout (10s)');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Test 2: sendMessage
function testSendMessage() {
  return new Promise((resolve, reject) => {
    console.log('\n📡 Test 2: POST /sendMessage...');
    
    const payload = JSON.stringify({
      chat_id: CHAT_ID,
      text: `🧪 Direct API Test\n\nTimestamp: ${new Date().toISOString()}\n\nIf you see this, direct HTTPS works! ✅`
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'TradingBot/1.0'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('   Response status:', res.statusCode);
        try {
          const parsed = JSON.parse(data);
          if (parsed.ok) {
            console.log('✅ Message sent successfully!');
            console.log('   Message ID:', parsed.result.message_id);
            resolve(true);
          } else {
            console.log('❌ Message send failed:', parsed);
            resolve(false);
          }
        } catch (e) {
          console.log('❌ Parse error:', e.message);
          console.log('   Raw response:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Request error:', error.message);
      console.log('   Code:', error.code);
      if (error.code === 'ENOTFOUND') {
        console.log('   → DNS resolution failed');
      } else if (error.code === 'ETIMEDOUT') {
        console.log('   → Connection timeout - Telegram might be blocked');
      } else if (error.code === 'ECONNREFUSED') {
        console.log('   → Connection refused - Firewall blocking?');
      }
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('❌ Request timeout (10s)');
      req.destroy();
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
}

// Run tests
async function run() {
  const botOk = await testGetMe();
  
  if (!botOk) {
    console.log('\n❌ Bot validation failed. Cannot continue.\n');
    process.exit(1);
  }
  
  await testSendMessage();
  
  console.log('\n═══════════════════════════════════════');
  console.log('Tests completed!');
  console.log('═══════════════════════════════════════\n');
}

run().catch(console.error);
