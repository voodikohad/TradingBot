/**
 * Test Suite for Luxalgo Indicator JSON Formats
 * Tests all webhook payloads from TradingView indicator
 */

const validator = require('../src/utils/validator');
const cornixFormatter = require('../src/services/cornixFormatter');

console.log('🧪 Testing Luxalgo Indicator JSON Formats\n');
console.log('='.repeat(60));

// Test payloads
const testPayloads = [
  {
    name: 'ENTRY - LONG',
    payload: {
      action: 'entry',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      size_type: 'percent',
      size: 1.0,
      tag: 'SFP_SL'
    },
    expectedCommand: '/entry BTCUSDT long 1% #SFP_SL'
  },
  {
    name: 'ENTRY - SHORT',
    payload: {
      action: 'entry',
      side: 'short',
      symbol: 'BYBIT:BTCUSDT.P',
      size_type: 'percent',
      size: 1.0,
      tag: 'SFP_SL'
    },
    expectedCommand: '/entry BTCUSDT short 1% #SFP_SL'
  },
  {
    name: 'STOP-LOSS - LONG',
    payload: {
      action: 'sl',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      tag: 'SFP_SL'
    },
    expectedCommand: '/sl BTCUSDT #SFP_SL'
  },
  {
    name: 'STOP-LOSS - SHORT',
    payload: {
      action: 'sl',
      side: 'short',
      symbol: 'BYBIT:BTCUSDT.P',
      tag: 'SFP_SL'
    },
    expectedCommand: '/sl BTCUSDT #SFP_SL'
  },
  {
    name: 'TAKE-PROFIT 1 - LONG',
    payload: {
      action: 'tp',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      tp_number: 1,
      tag: 'SFP_SL'
    },
    expectedCommand: '/tp BTCUSDT 1 #SFP_SL'
  },
  {
    name: 'TAKE-PROFIT 2 - LONG',
    payload: {
      action: 'tp',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      tp_number: 2,
      tag: 'SFP_SL'
    },
    expectedCommand: '/tp BTCUSDT 2 #SFP_SL'
  },
  {
    name: 'TAKE-PROFIT 3 - LONG',
    payload: {
      action: 'tp',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      tp_number: 3,
      tag: 'SFP_SL'
    },
    expectedCommand: '/tp BTCUSDT 3 #SFP_SL'
  },
  {
    name: 'TAKE-PROFIT 4 - LONG',
    payload: {
      action: 'tp',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      tp_number: 4,
      tag: 'SFP_SL'
    },
    expectedCommand: '/tp BTCUSDT 4 #SFP_SL'
  },
  {
    name: 'TAKE-PROFIT 5 - LONG',
    payload: {
      action: 'tp',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      tp_number: 5,
      tag: 'SFP_SL'
    },
    expectedCommand: '/tp BTCUSDT 5 #SFP_SL'
  },
  {
    name: 'ENTRY - ETH (no tag)',
    payload: {
      action: 'entry',
      side: 'long',
      symbol: 'BYBIT:ETHUSDT.P',
      size_type: 'percent',
      size: 2.5
    },
    expectedCommand: '/entry ETHUSDT long 2.5%'
  },
  {
    name: 'ENTRY - Simple symbol (no exchange prefix)',
    payload: {
      action: 'entry',
      side: 'long',
      symbol: 'BTCUSDT',
      size_type: 'usd',
      size: 100,
      tag: 'MANUAL'
    },
    expectedCommand: '/entry BTCUSDT long 100USD #MANUAL'
  }
];

// Run tests
let passed = 0;
let failed = 0;

testPayloads.forEach((test, index) => {
  console.log(`\n📝 Test ${index + 1}: ${test.name}`);
  console.log('-'.repeat(60));
  console.log('Input JSON:', JSON.stringify(test.payload, null, 2));

  // Step 1: Validate
  const validation = validator.validateWebhookData(test.payload);
  
  if (!validation.isValid) {
    console.log('❌ FAILED - Validation errors:');
    validation.errors.forEach(err => console.log(`   - ${err}`));
    failed++;
    return;
  }
  
  console.log('✅ Validation: PASSED');
  
  // Step 2: Format command
  let command;
  try {
    switch (test.payload.action) {
      case 'entry':
        command = cornixFormatter.formatEntryCommand(validation.data);
        break;
      case 'sl':
        command = cornixFormatter.formatSlCommand(validation.data);
        break;
      case 'tp':
        command = cornixFormatter.formatTpCommand(validation.data);
        break;
    }
    
    console.log('Generated Command:', command);
    console.log('Expected Command: ', test.expectedCommand);
    
    // Check if matches expected
    if (command === test.expectedCommand) {
      console.log('✅ PASSED - Command matches expected output');
      passed++;
    } else {
      console.log('❌ FAILED - Command does not match expected');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED - Error formatting:', error.message);
    failed++;
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(60));
console.log(`Total Tests: ${testPayloads.length}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Success Rate: ${((passed / testPayloads.length) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

process.exit(failed > 0 ? 1 : 0);
