/**
 * Test script to verify validation fixes for:
 * 1. tp5 NaN error when tp5 is not in the data
 * 2. Tag format error for tags with spaces and dots
 */

const validator = require('./src/utils/validator');

// Test case 1: HYPEUSDT webhook with only 4 TP targets and "NR.3 SHORT" tag
const testData1 = {
  pair: "HYPEUSDT.P",
  signal_type: "Regular (Short)",
  exchange: "Binance Futures",
  leverage: "Isolated (20X)",
  position_size: "1%",
  entry_type: "Sell at current price",
  take_profit_targets: {
    1: 27.453392,
    2: 27.370784,
    3: 27.288176,
    4: 27.205568
  },
  stop_targets: {
    1: 28.00533
  },
  close_on_stop: "100%",
  trailing_configuration: {
    entry: "Percentage (0%)",
    take_profit: "Percentage (0%)",
    stop: "Moving Target",
    trigger: "Target (1)"
  },
  trade_signal: {
    symbol: "HYPEUSDT.P",
    side: "SHORT",
    size: "1%",
    tag: "NR.3 SHORT"
  }
};

// Test case 2: XPLUSDT webhook with only 4 TP targets and "NR.3 SHORT" tag
const testData2 = {
  pair: "XPLUSDT.P",
  signal_type: "Regular (Short)",
  exchange: "Binance Futures",
  leverage: "Isolated (20X)",
  position_size: "1%",
  entry_type: "Sell at current price",
  take_profit_targets: {
    1: 0.160517,
    2: 0.160034,
    3: 0.159551,
    4: 0.159068
  },
  stop_targets: {
    1: 0.16281
  },
  close_on_stop: "100%",
  trailing_configuration: {
    entry: "Percentage (0%)",
    take_profit: "Percentage (0%)",
    stop: "Moving Target",
    trigger: "Target (1)"
  },
  trade_signal: {
    symbol: "XPLUSDT.P",
    side: "SHORT",
    size: "1%",
    tag: "NR.3 SHORT"
  }
};

console.log('🧪 Testing Validation Fixes\n');

// Test 1
console.log('Test 1: HYPEUSDT.P with 4 TPs and "NR.3 SHORT" tag');
const result1 = validator.validateWebhookData(testData1);
console.log('Valid:', result1.isValid);
console.log('Errors:', result1.errors.length > 0 ? result1.errors : 'None ✅');
if (result1.isValid) {
  console.log('Validated Data:', {
    symbol: result1.data.symbol,
    side: result1.data.side,
    action: result1.data.action,
    tag: result1.data.tag,
    tp1: result1.data.tp1,
    tp2: result1.data.tp2,
    tp3: result1.data.tp3,
    tp4: result1.data.tp4,
    tp5: result1.data.tp5,
    sl: result1.data.sl
  });
}
console.log('\n---\n');

// Test 2
console.log('Test 2: XPLUSDT.P with 4 TPs and "NR.3 SHORT" tag');
const result2 = validator.validateWebhookData(testData2);
console.log('Valid:', result2.isValid);
console.log('Errors:', result2.errors.length > 0 ? result2.errors : 'None ✅');
if (result2.isValid) {
  console.log('Validated Data:', {
    symbol: result2.data.symbol,
    side: result2.data.side,
    action: result2.data.action,
    tag: result2.data.tag,
    tp1: result2.data.tp1,
    tp2: result2.data.tp2,
    tp3: result2.data.tp3,
    tp4: result2.data.tp4,
    tp5: result2.data.tp5,
    sl: result2.data.sl
  });
}
console.log('\n---\n');

// Summary
if (result1.isValid && result2.isValid) {
  console.log('✅ ALL TESTS PASSED! Both issues are fixed:');
  console.log('   1. ✅ No more tp5 NaN error when tp5 is not provided');
  console.log('   2. ✅ Tags with spaces and dots are now accepted');
} else {
  console.log('❌ TESTS FAILED - Issues still exist');
  process.exit(1);
}
