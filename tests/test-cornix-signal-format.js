/**
 * Test Suite for Cornix Signal Format
 * Tests the correct text-based signal format required by Cornix
 */

const validator = require('../src/utils/validator');
const cornixFormatter = require('../src/services/cornixFormatter');

console.log('🧪 Testing Cornix Signal Format (Text-Based)\n');
console.log('='.repeat(60));

// Test payloads with TP/SL levels
const testPayloads = [
  {
    name: 'ENTRY - LONG with TP1-3 and SL',
    payload: {
      action: 'entry',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      size_type: 'percent',
      size: 1.0,
      leverage: 20,
      tp1: 93000,
      tp2: 94000,
      tp3: 95000,
      sl: 87000,
      tag: '#signal'
    },
    expectedFormat: `#signal
Pair: BTCUSDT
Action: Long
Leverage: 20x
Entry: Market
TP1: 93000
TP2: 94000
TP3: 95000
Stop Loss: 87000`
  },
  {
    name: 'ENTRY - SHORT with TP1-5 and SL',
    payload: {
      action: 'entry',
      side: 'short',
      symbol: 'BYBIT:ETHUSDT.P',
      size_type: 'percent',
      size: 2.0,
      leverage: 10,
      tp1: 3100,
      tp2: 3050,
      tp3: 3000,
      tp4: 2950,
      tp5: 2900,
      sl: 3250,
      tag: '#scalp'
    },
    expectedFormat: `#scalp
Pair: ETHUSDT
Action: Short
Leverage: 10x
Entry: Market
TP1: 3100
TP2: 3050
TP3: 3000
TP4: 2950
TP5: 2900
Stop Loss: 3250`
  },
  {
    name: 'ENTRY - LONG (minimum: only TP1 and SL)',
    payload: {
      action: 'entry',
      side: 'long',
      symbol: 'BTCUSDT',
      size_type: 'usd',
      size: 100,
      tp1: 92000,
      sl: 88000
    },
    expectedFormat: `Pair: BTCUSDT
Action: Long
Entry: Market
TP1: 92000
Stop Loss: 88000`
  },
  {
    name: 'ENTRY - Alternative field names (tp_1, stop_loss)',
    payload: {
      action: 'entry',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      size_type: 'percent',
      size: 1.0,
      leverage: 15,
      tp_1: 93000,
      tp_2: 94000,
      stop_loss: 87000,
      tag: '#test'
    },
    expectedFormat: `#test
Pair: BTCUSDT
Action: Long
Leverage: 15x
Entry: Market
TP1: 93000
TP2: 94000
Stop Loss: 87000`
  }
];

// Error test cases
const errorTests = [
  {
    name: 'ERROR - Missing TP1',
    payload: {
      action: 'entry',
      side: 'long',
      symbol: 'BTCUSDT',
      size_type: 'percent',
      size: 1.0,
      sl: 88000
    },
    shouldFail: true,
    expectedError: 'tp1'
  },
  {
    name: 'ERROR - Missing SL',
    payload: {
      action: 'entry',
      side: 'long',
      symbol: 'BTCUSDT',
      size_type: 'percent',
      size: 1.0,
      tp1: 92000
    },
    shouldFail: true,
    expectedError: 'sl'
  }
];

// Run valid tests
let passed = 0;
let failed = 0;

console.log('\n✅ VALID TESTS\n');

testPayloads.forEach((test, index) => {
  console.log(`📝 Test ${index + 1}: ${test.name}`);
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
  try {
    const command = cornixFormatter.formatEntryCommand(validation.data);
    
    console.log('\n📤 Generated Cornix Signal:');
    console.log('```');
    console.log(command);
    console.log('```');
    
    console.log('\n📋 Expected Format:');
    console.log('```');
    console.log(test.expectedFormat);
    console.log('```');
    
    // Basic check
    if (command.includes('Pair:') && command.includes('Entry:') && command.includes('TP1:') && command.includes('Stop Loss:')) {
      console.log('\n✅ PASSED - Signal contains required fields\n');
      passed++;
    } else {
      console.log('\n❌ FAILED - Signal missing required fields\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED - Error formatting:', error.message);
    failed++;
  }
});

// Run error tests
console.log('\n❌ ERROR TESTS (Should Fail Validation)\n');

errorTests.forEach((test, index) => {
  console.log(`📝 Error Test ${index + 1}: ${test.name}`);
  console.log('-'.repeat(60));
  console.log('Input JSON:', JSON.stringify(test.payload, null, 2));

  const validation = validator.validateWebhookData(test.payload);
  
  if (!validation.isValid) {
    console.log('✅ CORRECTLY FAILED - Validation errors:');
    validation.errors.forEach(err => console.log(`   - ${err}`));
    passed++;
  } else {
    console.log('❌ TEST FAILED - Should have rejected this payload');
    failed++;
  }
  console.log('');
});

// Summary
console.log('='.repeat(60));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(60));
console.log(`Total Tests: ${testPayloads.length + errorTests.length}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Success Rate: ${((passed / (testPayloads.length + errorTests.length)) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

process.exit(failed > 0 ? 1 : 0);
