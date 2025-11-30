/**
 * Test Suite for Luxalgo Indicator JSON Formats
 * Tests all webhook payloads from TradingView indicator
 * 
 * UPDATED: Entry signals now require tp1 and sl (placeholder values)
 * UPDATED: SL signals now generate /close command (not /sl)
 */

const validator = require('../src/utils/validator');
const cornixFormatter = require('../src/services/cornixFormatter');

console.log('🧪 Testing Luxalgo Indicator JSON Formats\n');
console.log('='.repeat(60));

// Test payloads - UPDATED to include required TP/SL for entry
const testPayloads = [
  {
    name: 'ENTRY - LONG (with placeholder TP/SL)',
    payload: {
      action: 'entry',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      size_type: 'percent',
      size: 1.0,
      tp1: 100000,  // Placeholder TP (far away)
      sl: 1,        // Placeholder SL (far away)
      tag: 'SFP_SL'
    },
    expectedCommandContains: ['Pair: BTCUSDT', 'Action: Long', 'TP1: 100000', 'Stop Loss: 1']
  },
  {
    name: 'ENTRY - SHORT (with placeholder TP/SL)',
    payload: {
      action: 'entry',
      side: 'short',
      symbol: 'BYBIT:BTCUSDT.P',
      size_type: 'percent',
      size: 1.0,
      tp1: 1,       // Placeholder TP (far away for short)
      sl: 100000,   // Placeholder SL (far away for short)
      tag: 'SFP_SL'
    },
    expectedCommandContains: ['Pair: BTCUSDT', 'Action: Short', 'TP1: 1', 'Stop Loss: 100000']
  },
  {
    name: 'STOP-LOSS / CLOSE - LONG (SFP SL triggered)',
    payload: {
      action: 'sl',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      tag: 'SFP_SL'
    },
    expectedCommand: '/close BTCUSDT #SFP_SL'
  },
  {
    name: 'STOP-LOSS / CLOSE - SHORT (SFP SL triggered)',
    payload: {
      action: 'sl',
      side: 'short',
      symbol: 'BYBIT:BTCUSDT.P',
      tag: 'SFP_SL'
    },
    expectedCommand: '/close BTCUSDT #SFP_SL'
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
    name: 'ENTRY - ETH with placeholder TP/SL (no tag)',
    payload: {
      action: 'entry',
      side: 'long',
      symbol: 'BYBIT:ETHUSDT.P',
      size_type: 'percent',
      size: 2.5,
      tp1: 50000,
      sl: 1
    },
    expectedCommandContains: ['Pair: ETHUSDT', 'Action: Long', 'TP1: 50000', 'Stop Loss: 1']
  },
  {
    name: 'ENTRY - Simple symbol with placeholder TP/SL',
    payload: {
      action: 'entry',
      side: 'long',
      symbol: 'BTCUSDT',
      size_type: 'usd',
      size: 100,
      tp1: 100000,
      sl: 1,
      tag: 'MANUAL'
    },
    expectedCommandContains: ['Pair: BTCUSDT', 'Action: Long', 'TP1: 100000', 'Stop Loss: 1', '#MANUAL']
  },
  {
    name: 'CLOSE - SUIUSDT (no tag)',
    payload: {
      action: 'sl',
      side: 'long',
      symbol: 'BYBIT:SUIUSDT.P'
    },
    expectedCommand: '/close SUIUSDT'
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
    
    // Check if test expects exact match or contains
    if (test.expectedCommand) {
      console.log('Expected Command: ', test.expectedCommand);
      if (command === test.expectedCommand) {
        console.log('✅ PASSED - Command matches expected output');
        passed++;
      } else {
        console.log('❌ FAILED - Command does not match expected');
        failed++;
      }
    } else if (test.expectedCommandContains) {
      console.log('Expected to contain:', test.expectedCommandContains.join(', '));
      const allFound = test.expectedCommandContains.every(part => command.includes(part));
      if (allFound) {
        console.log('✅ PASSED - Command contains all expected parts');
        passed++;
      } else {
        const missing = test.expectedCommandContains.filter(part => !command.includes(part));
        console.log('❌ FAILED - Missing parts:', missing.join(', '));
        failed++;
      }
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
