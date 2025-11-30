/**
 * Test Script: SFP SL Exit Alert Format
 * Tests the agreed SL exit alert format for closing positions
 * 
 * Agreed formats:
 * Long exit:  {"action":"sl","side":"long","symbol":"{{ticker}}","tag":"SFP_SL"}
 * Short exit: {"action":"sl","side":"short","symbol":"{{ticker}}","tag":"SFP_SL"}
 */

const validator = require('../src/utils/validator');
const cornixFormatter = require('../src/services/cornixFormatter');

console.log('═══════════════════════════════════════════════════════════');
console.log('  SFP SL EXIT ALERT FORMAT TEST');
console.log('  Testing the agreed alert format for closing positions');
console.log('═══════════════════════════════════════════════════════════\n');

// Test cases based on agreed format
const testCases = [
  {
    name: 'Long Exit - SFP SL Triggered',
    input: {
      action: 'sl',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      tag: 'SFP_SL'
    },
    expectedCommand: '/close BTCUSDT #SFP_SL'
  },
  {
    name: 'Short Exit - SFP SL Triggered',
    input: {
      action: 'sl',
      side: 'short',
      symbol: 'BYBIT:ETHUSDT.P',
      tag: 'SFP_SL'
    },
    expectedCommand: '/close ETHUSDT #SFP_SL'
  },
  {
    name: 'Long Exit - SUIUSDT',
    input: {
      action: 'sl',
      side: 'long',
      symbol: 'BYBIT:SUIUSDT.P',
      tag: 'SFP_SL'
    },
    expectedCommand: '/close SUIUSDT #SFP_SL'
  },
  {
    name: 'Short Exit - No Tag',
    input: {
      action: 'sl',
      side: 'short',
      symbol: 'BINANCE:BTCUSDT',
      tag: null
    },
    expectedCommand: '/close BTCUSDT'
  },
  {
    name: 'Long Exit - Simple Symbol',
    input: {
      action: 'sl',
      side: 'long',
      symbol: 'SOLUSDT',
      tag: 'SFP_SL'
    },
    expectedCommand: '/close SOLUSDT #SFP_SL'
  }
];

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  console.log(`\n📋 Test ${index + 1}: ${test.name}`);
  console.log('   Input:', JSON.stringify(test.input));
  
  // Step 1: Validate the input
  const validation = validator.validateWebhookData(test.input);
  
  if (!validation.isValid) {
    console.log('   ❌ VALIDATION FAILED:', validation.errors);
    failed++;
    return;
  }
  
  console.log('   ✅ Validation passed');
  
  // Step 2: Format the Cornix command
  try {
    const command = cornixFormatter.formatSlCommand(validation.data);
    
    if (command === test.expectedCommand) {
      console.log('   ✅ Command correct:', command);
      passed++;
    } else {
      console.log('   ❌ Command mismatch!');
      console.log('      Expected:', test.expectedCommand);
      console.log('      Got:', command);
      failed++;
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error.message);
    failed++;
  }
});

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
console.log(`  Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
console.log('═══════════════════════════════════════════════════════════');

// Additional test: Full entry signal with placeholder TP/SL
console.log('\n\n═══════════════════════════════════════════════════════════');
console.log('  ENTRY SIGNAL FORMAT TEST');
console.log('  Testing entry with placeholder TP/SL for Cornix');
console.log('═══════════════════════════════════════════════════════════\n');

const entryTests = [
  {
    name: 'Long Entry with Placeholder TP/SL',
    input: {
      action: 'entry',
      side: 'long',
      symbol: 'BYBIT:BTCUSDT.P',
      size_type: 'percent',
      size: 1.0,
      tp1: 100000,  // Placeholder TP (very far away)
      sl: 1,        // Placeholder SL (very far away)
      tag: 'SFP_SL'
    }
  },
  {
    name: 'Short Entry with Placeholder TP/SL',
    input: {
      action: 'entry',
      side: 'short',
      symbol: 'BYBIT:ETHUSDT.P',
      size_type: 'percent',
      size: 1.0,
      tp1: 1,       // Placeholder TP (very far away for short)
      sl: 100000,   // Placeholder SL (very far away for short)
      tag: 'SFP_SL'
    }
  }
];

entryTests.forEach((test, index) => {
  console.log(`\n📋 Entry Test ${index + 1}: ${test.name}`);
  console.log('   Input:', JSON.stringify(test.input, null, 2));
  
  const validation = validator.validateWebhookData(test.input);
  
  if (!validation.isValid) {
    console.log('   ❌ VALIDATION FAILED:', validation.errors);
    return;
  }
  
  console.log('   ✅ Validation passed');
  
  try {
    const command = cornixFormatter.formatEntryCommand(validation.data);
    console.log('   ✅ Cornix command generated:');
    console.log('   ─────────────────────────────');
    command.split('\n').forEach(line => console.log('   ' + line));
    console.log('   ─────────────────────────────');
  } catch (error) {
    console.log('   ❌ ERROR:', error.message);
  }
});

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  SUMMARY');
console.log('═══════════════════════════════════════════════════════════');
console.log(`
  ✅ SL Exit Alert Format (when SFP SL line is broken):
     Long:  {"action":"sl","side":"long","symbol":"{{ticker}}","tag":"SFP_SL"}
     Short: {"action":"sl","side":"short","symbol":"{{ticker}}","tag":"SFP_SL"}
  
  ✅ Generated Cornix Command:
     /close SYMBOL #SFP_SL
  
  ⚠️  Note: The /close command tells Cornix to close the open position
     when your indicator's SFP SL line is broken.
  
  🔧 Pine Script Alert Example:
     alert('{"action":"sl","side":"long","symbol":"' + syminfo.ticker + '","tag":"SFP_SL"}', alert.freq_once_per_bar_close)
`);

process.exit(failed > 0 ? 1 : 0);
