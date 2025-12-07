/**
 * Test PIPPINUSDT.P Symbol Conversion
 * This script tests if the symbol conversion logic works correctly for PIPPINUSDT.P
 */

const cornixFormatter = require('./src/services/cornixFormatter');
const validator = require('./src/utils/validator');

console.log('=== TESTING PIPPINUSDT.P SYMBOL CONVERSION ===\n');

// Test 1: Direct symbol parsing
console.log('1. Testing parseSymbol function:');
const testSymbols = [
  'PIPPINUSDT.P',
  'SOLUSDT.P', 
  'BYBIT:PIPPINUSDT.P',
  'BINANCE:SOLUSDT.P',
  'pippinusdt.p'
];

testSymbols.forEach(symbol => {
  const result = cornixFormatter.parseSymbol(symbol);
  console.log(`   ${symbol} → ${result}`);
});

console.log('\n2. Testing full webhook validation and formatting:');

// Test 2: PIPPINUSDT.P entry signal
const pippinEntryData = {
  action: 'entry',
  side: 'long',
  symbol: 'PIPPINUSDT.P',
  size_type: 'percent',
  size: 1.0,
  tp1: 1.2345,
  sl: 0.8765,
  tag: 'TEST_PIPPIN'
};

console.log('\n--- PIPPINUSDT.P Entry Signal ---');
console.log('Input data:', pippinEntryData);

const pippinValidation = validator.validateWebhookData(pippinEntryData);
console.log('Validation result:', pippinValidation);

if (pippinValidation.isValid) {
  const pippinCommand = cornixFormatter.formatEntryCommand(pippinValidation.data);
  console.log('Generated Cornix command:');
  console.log(pippinCommand);
} else {
  console.log('❌ Validation failed:', pippinValidation.errors);
}

// Test 3: SOLUSDT.P for comparison
const solEntryData = {
  action: 'entry',
  side: 'long',
  symbol: 'SOLUSDT.P',
  size_type: 'percent',
  size: 1.0,
  tp1: 250.0,
  sl: 180.0,
  tag: 'TEST_SOL'
};

console.log('\n--- SOLUSDT.P Entry Signal (for comparison) ---');
console.log('Input data:', solEntryData);

const solValidation = validator.validateWebhookData(solEntryData);
console.log('Validation result:', solValidation);

if (solValidation.isValid) {
  const solCommand = cornixFormatter.formatEntryCommand(solValidation.data);
  console.log('Generated Cornix command:');
  console.log(solCommand);
} else {
  console.log('❌ Validation failed:', solValidation.errors);
}

// Test 4: SL signal for PIPPINUSDT.P
const pippinSlData = {
  action: 'sl',
  side: 'long',
  symbol: 'PIPPINUSDT.P',
  tag: 'SFP_SL'
};

console.log('\n--- PIPPINUSDT.P SL Signal ---');
console.log('Input data:', pippinSlData);

const pippinSlValidation = validator.validateWebhookData(pippinSlData);
console.log('Validation result:', pippinSlValidation);

if (pippinSlValidation.isValid) {
  const pippinSlCommand = cornixFormatter.formatSlCommand(pippinSlValidation.data);
  console.log('Generated Cornix SL command:');
  console.log(pippinSlCommand);
} else {
  console.log('❌ Validation failed:', pippinSlValidation.errors);
}

console.log('\n=== TEST COMPLETE ===');
console.log('\nConclusion:');
console.log('If all tests pass, the symbol conversion logic works correctly.');
console.log('If PIPPINUSDT.P is not opening trades, the issue is likely:');
console.log('1. The webhook is not reaching the server (check logs)');
console.log('2. The server is not running or accessible');
console.log('3. Cornix bot settings (pair whitelist, exchange connection)');
console.log('4. Telegram message delivery issues');