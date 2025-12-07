/**
 * Test New TradingView JSON Format
 * Tests the updated validator and formatter with the new nested JSON structure
 */

const validator = require('../src/utils/validator');
const cornixFormatter = require('../src/services/cornixFormatter');

console.log('🧪 Testing New TradingView JSON Format\n');
console.log('═'.repeat(60));

// Test 1: LONG Signal (New Format)
console.log('\n📊 TEST 1: LONG Signal (New Format)');
console.log('─'.repeat(60));

const longSignal = {
  "pair": "BTCUSDT",
  "signal_type": "Regular (Long)",
  "exchange": "Binance Futures",
  "leverage": "Isolated (10X)",
  "position_size": "1%",
  "entry_type": "Buy at current price",

  "take_profit_targets": {
    "1": 93400,
    "2": 93520,
    "3": 93680,
    "4": 93850,
    "5": 94000
  },

  "stop_targets": {
    "1": 82990
  },

  "trailing_configuration": {
    "entry": "Percentage (0.5%)",
    "take_profit": "Percentage (0.5%)",
    "stop": "Moving Target",
    "trigger": "Target (1)"
  },

  "trade_signal": {
    "symbol": "BTCUSDT",
    "side": "LONG",
    "size": "1%",
    "tag": "#SFP_SL"
  }
};

console.log('Input JSON:');
console.log(JSON.stringify(longSignal, null, 2));

const longValidation = validator.validateWebhookData(longSignal);

if (longValidation.isValid) {
  console.log('\n✅ Validation PASSED');
  console.log('\nValidated Data:');
  console.log(JSON.stringify(longValidation.data, null, 2));
  
  console.log('\n📤 Cornix Command:');
  console.log('─'.repeat(60));
  const cornixCommand = cornixFormatter.formatEntryCommand(longValidation.data);
  console.log(cornixCommand);
  console.log('─'.repeat(60));
} else {
  console.log('\n❌ Validation FAILED');
  console.log('Errors:', longValidation.errors);
}

// Test 2: SHORT Signal (New Format)
console.log('\n\n📊 TEST 2: SHORT Signal (New Format)');
console.log('─'.repeat(60));

const shortSignal = {
  "pair": "ETHUSDT",
  "signal_type": "Regular (Short)",
  "exchange": "Binance Futures",
  "leverage": "Isolated (15X)",
  "position_size": "2%",
  "entry_type": "Sell at current price",

  "take_profit_targets": {
    "1": 2200,
    "2": 2180,
    "3": 2150,
    "4": 2120,
    "5": 2100
  },

  "stop_targets": {
    "1": 2350
  },

  "trailing_configuration": {
    "entry": "Percentage (0.5%)",
    "take_profit": "Percentage (0.5%)",
    "stop": "Moving Target",
    "trigger": "Target (1)"
  },

  "trade_signal": {
    "symbol": "ETHUSDT",
    "side": "SHORT",
    "size": "2%",
    "tag": "#SFP_SL"
  }
};

console.log('Input JSON:');
console.log(JSON.stringify(shortSignal, null, 2));

const shortValidation = validator.validateWebhookData(shortSignal);

if (shortValidation.isValid) {
  console.log('\n✅ Validation PASSED');
  console.log('\nValidated Data:');
  console.log(JSON.stringify(shortValidation.data, null, 2));
  
  console.log('\n📤 Cornix Command:');
  console.log('─'.repeat(60));
  const cornixCommand = cornixFormatter.formatEntryCommand(shortValidation.data);
  console.log(cornixCommand);
  console.log('─'.repeat(60));
} else {
  console.log('\n❌ Validation FAILED');
  console.log('Errors:', shortValidation.errors);
}

// Test 3: Legacy Format (Backward Compatibility)
console.log('\n\n📊 TEST 3: Legacy Format (Backward Compatibility)');
console.log('─'.repeat(60));

const legacySignal = {
  "action": "entry",
  "side": "long",
  "symbol": "BTCUSDT",
  "size_type": "percent",
  "size": 1.0,
  "leverage": 10,
  "tp1": 93400,
  "tp2": 93520,
  "tp3": 93680,
  "sl": 82990,
  "tag": "#LEGACY_TEST"
};

console.log('Input JSON:');
console.log(JSON.stringify(legacySignal, null, 2));

const legacyValidation = validator.validateWebhookData(legacySignal);

if (legacyValidation.isValid) {
  console.log('\n✅ Validation PASSED');
  console.log('\nValidated Data:');
  console.log(JSON.stringify(legacyValidation.data, null, 2));
  
  console.log('\n📤 Cornix Command:');
  console.log('─'.repeat(60));
  const cornixCommand = cornixFormatter.formatEntryCommand(legacyValidation.data);
  console.log(cornixCommand);
  console.log('─'.repeat(60));
} else {
  console.log('\n❌ Validation FAILED');
  console.log('Errors:', legacyValidation.errors);
}

// Test 4: Error Handling - Missing Required Fields
console.log('\n\n📊 TEST 4: Error Handling - Missing Required Fields');
console.log('─'.repeat(60));

const invalidSignal = {
  "pair": "BTCUSDT",
  "signal_type": "Regular (Long)",
  // Missing trade_signal object
};

console.log('Input JSON (Missing trade_signal):');
console.log(JSON.stringify(invalidSignal, null, 2));

const invalidValidation = validator.validateWebhookData(invalidSignal);

if (invalidValidation.isValid) {
  console.log('\n⚠️ Unexpectedly PASSED (should have failed)');
} else {
  console.log('\n✅ Correctly FAILED with errors:');
  invalidValidation.errors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });
}

console.log('\n' + '═'.repeat(60));
console.log('✅ All tests completed!');
console.log('═'.repeat(60));

