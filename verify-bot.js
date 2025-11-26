// Quick script to verify Telegram bot token
const https = require('https');

const BOT_TOKEN = '7504720694:AAFb8USheEMlClyJpjzwfl6ecbvBb-pk_X0';
const CHAT_ID = '-4972867982';

console.log('Testing bot token:', BOT_TOKEN.substring(0, 20) + '...');

// Test 1: Get bot info
https.get(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const result = JSON.parse(data);
    if (result.ok) {
      console.log('✅ Bot token is VALID');
      console.log('Bot name:', result.result.username);
      
      // Test 2: Send a test message
      const message = JSON.stringify({
        chat_id: CHAT_ID,
        text: '🔧 Testing bot connection from verify script'
      });
      
      const options = {
        hostname: 'api.telegram.org',
        path: `/bot${BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': message.length
        }
      };
      
      const req = https.request(options, (res2) => {
        let data2 = '';
        res2.on('data', chunk => data2 += chunk);
        res2.on('end', () => {
          const result2 = JSON.parse(data2);
          if (result2.ok) {
            console.log('✅ Test message sent successfully to chat:', CHAT_ID);
            console.log('✅ TELEGRAM BOT IS WORKING PERFECTLY!');
          } else {
            console.log('❌ Failed to send message:', result2.description);
            console.log('Make sure bot is admin in the channel/group');
          }
        });
      });
      
      req.on('error', (e) => {
        console.error('❌ Error sending message:', e.message);
      });
      
      req.write(message);
      req.end();
    } else {
      console.log('❌ Bot token is INVALID:', result.description);
    }
  });
}).on('error', (e) => {
  console.error('❌ Error checking bot:', e.message);
});
