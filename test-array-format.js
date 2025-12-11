/**
 * Test script to verify array-based format validation
 */

const validator = require('./src/utils/validator');

const testData = {
  "symbol": "ETHUSDT",
  "pair": "ETH/USDT",
  "exchange": "Binance Futures",
  "signal_type": "Regular",
  "position": "Long",
  "leverage": {
    "type": "Isolated",
    "value": "10X"
  },
  "entry": {
    "type": "market",
    "description": "Buy at current price"
  },
  "take_profit_targets": [
    { "target": 1, "price": 3400 },
    { "target": 2, "price": 3520 },
    { "target": 3, "price": 3680 },
    { "target": 4, "price": 3850 }
  ],
  "stop_targets": [
    { "target": 1, "price": 2000, "percentage": "100%" }
  ],
  "trailing_configuration": {
    "entry": {
      "type": "percentage",
      "value": 0.5
    },
    "take_profit": {
      "type": "percentage",
      "value": 0.5
    },
    "stop": {
      "type": "moving_target",
      "trigger": {
        "type": "target",
        "value": 1
      }
    }
  },
  "trade": {
    "side": "LONG",
    "size": "1%",
    "tag": "SFP_SL"
  }
};

console.log('🧪 Testing Array-Based Format\n');

const result = validator.validateWebhookData(testData);
console.log('Valid:', result.isValid);
console.log('Errors:', result.errors.length > 0 ? result.errors : 'None ✅');

if (result.isValid) {
  console.log('\n✅ Validated Data:');
  console.log(JSON.stringify(result.data, null, 2));
} else {
  console.log('\n❌ Validation failed');
  process.exit(1);
}
