/**
 * Node.js Webhook Test Script
 * Run with: node tests/testWebhook.js
 */

const axios = require('axios');
require('dotenv').config();

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/webhook';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'test_token';

const logger = (title, data) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 ${title}`);
  console.log('='.repeat(60));
  console.log(JSON.stringify(data, null, 2));
};

async function runTests() {
  console.log('🧪 Starting Webhook Tests...\n');

  try {
    // Test 1: Valid Entry - Long with Percent
    logger('Test 1: Valid Entry - Long with 1% Size', {
      url: WEBHOOK_URL,
      method: 'POST'
    });

    const test1Response = await axios.post(
      WEBHOOK_URL,
      {
        action: 'entry',
        side: 'long',
        symbol: 'BTCUSDT',
        size_type: 'percent',
        size: 1.0,
        tag: 'SFP_SL'
      },
      {
        headers: {
          'X-Webhook-Secret': WEBHOOK_SECRET,
          'Content-Type': 'application/json'
        }
      }
    );

    logger('Test 1 Response', test1Response.data);

    // Test 2: Valid Entry - Short with USD
    logger('Test 2: Valid Entry - Short with 100 USD', {
      url: WEBHOOK_URL,
      method: 'POST'
    });

    const test2Response = await axios.post(
      WEBHOOK_URL,
      {
        action: 'entry',
        side: 'short',
        symbol: 'ETHUSDT',
        size_type: 'usd',
        size: 100,
        tag: 'SCALP'
      },
      {
        headers: {
          'X-Webhook-Secret': WEBHOOK_SECRET,
          'Content-Type': 'application/json'
        }
      }
    );

    logger('Test 2 Response', test2Response.data);

    // Test 3: Invalid - Missing Required Field
    logger('Test 3: Invalid - Missing Required Field', {
      description: 'Missing size_type and size'
    });

    try {
      await axios.post(
        WEBHOOK_URL,
        {
          action: 'entry',
          side: 'long',
          symbol: 'BTCUSDT'
        },
        {
          headers: {
            'X-Webhook-Secret': WEBHOOK_SECRET,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      logger('Test 3 Error Response', {
        status: error.response?.status,
        data: error.response?.data
      });
    }

    // Test 4: Invalid - Wrong Secret
    logger('Test 4: Invalid - Wrong Secret Token', {
      description: 'Should get 401 Unauthorized'
    });

    try {
      await axios.post(
        WEBHOOK_URL,
        {
          action: 'entry',
          side: 'long',
          symbol: 'BTCUSDT',
          size_type: 'percent',
          size: 1.0
        },
        {
          headers: {
            'X-Webhook-Secret': 'wrong_token',
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      logger('Test 4 Error Response', {
        status: error.response?.status,
        data: error.response?.data
      });
    }

    // Test 5: Health Check
    logger('Test 5: Health Check', {
      url: 'http://localhost:3000/health',
      method: 'GET'
    });

    const healthResponse = await axios.get('http://localhost:3000/health');
    logger('Test 5 Response', healthResponse.data);

    console.log('\n\n✅ All tests completed successfully!');
    console.log('Check server logs for detailed information.\n');

  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

// Run tests
runTests();
