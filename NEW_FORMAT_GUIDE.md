# New TradingView JSON Format Support

## ✅ Implementation Complete

Your TradingBot now supports **BOTH** the new TradingView JSON format AND the legacy format for backward compatibility!

---

## 📋 New Format Template

### LONG Signal Template

```json
{
  "pair": "{{PAIR}}",
  "signal_type": "Regular (Long)",
  "exchange": "Binance Futures",
  "leverage": "Isolated ({{LEVERAGE}}X)",
  "position_size": "{{RISK_PERCENT}}%",
  "entry_type": "Buy at current price",

  "take_profit_targets": {
    "1": {{TP1}},
    "2": {{TP2}},
    "3": {{TP3}},
    "4": {{TP4}},
    "5": {{TP5}}
  },

  "stop_targets": {
    "1": {{SL}}
  },

  "trailing_configuration": {
    "entry": "Percentage ({{ENTRY_TRAIL}}%)",
    "take_profit": "Percentage ({{TP_TRAIL}}%)",
    "stop": "Moving Target",
    "trigger": "Target (1)"
  },

  "trade_signal": {
    "symbol": "{{PAIR}}",
    "side": "LONG",
    "size": "{{RISK_PERCENT}}%",
    "tag": "#SFP_SL"
  }
}
```

### SHORT Signal Template

```json
{
  "pair": "{{PAIR}}",
  "signal_type": "Regular (Short)",
  "exchange": "Binance Futures",
  "leverage": "Isolated ({{LEVERAGE}}X)",
  "position_size": "{{RISK_PERCENT}}%",
  "entry_type": "Sell at current price",

  "take_profit_targets": {
    "1": {{TP1}},
    "2": {{TP2}},
    "3": {{TP3}},
    "4": {{TP4}},
    "5": {{TP5}}
  },

  "stop_targets": {
    "1": {{SL}}
  },

  "trailing_configuration": {
    "entry": "Percentage ({{ENTRY_TRAIL}}%)",
    "take_profit": "Percentage ({{TP_TRAIL}}%)",
    "stop": "Moving Target",
    "trigger": "Target (1)"
  },

  "trade_signal": {
    "symbol": "{{PAIR}}",
    "side": "SHORT",
    "size": "{{RISK_PERCENT}}%",
    "tag": "#SFP_SL"
  }
}
```

---

## 🔄 How It Works

### 1. **Automatic Format Detection**

The validator automatically detects which format you're using:

- **New Format**: Has `trade_signal` object → automatically normalized
- **Legacy Format**: Has `action` field → processed as before

### 2. **Data Normalization**

The new format is converted to a flat structure:

```javascript
// NEW FORMAT INPUT
{
  "pair": "BTCUSDT",
  "trade_signal": {
    "symbol": "BTCUSDT",
    "side": "LONG",
    "size": "1%"
  },
  "take_profit_targets": {
    "1": 93400,
    "2": 93520
  }
}

// NORMALIZED TO
{
  "symbol": "BTCUSDT",
  "side": "long",
  "size": 1,
  "size_type": "percent",
  "action": "entry",
  "tp1": 93400,
  "tp2": 93520
}
```

### 3. **Enhanced Cornix Output**

The bot now generates **detailed Cornix signals** matching your exact format:

```
⚡⚡ #BTCUSDT ⚡⚡
Exchanges: Binance Futures
Signal Type: Regular (Long)
Leverage: Isolated (10X)

Entry Zone:
Buy at current price

Take-Profit Targets:
1) 93400
2) 93520
3) 93680
4) 93850

Stop Targets:
1) 82990

Trailing Configuration:
Entry: Percentage (0.5%)
Take-Profit: Percentage (0.5%)
Stop: Moving Target -
Trigger: Target (1)

🚀 TRADE SIGNAL
─────────────────────
Symbol: BTCUSDT
Side: LONG
Size: 1%
Tag: #SFP_SL
```

---

## 🎯 TradingView Alert Setup

### Step 1: Copy Your Template

For **LONG** signals, use the long template above.
For **SHORT** signals, use the short template above.

### Step 2: Replace Placeholders

In your TradingView Pine Script indicator, make sure these variables are available:

- `{{PAIR}}` → Symbol (e.g., "BTCUSDT")
- `{{LEVERAGE}}` → Leverage (e.g., 10)
- `{{RISK_PERCENT}}` → Position size % (e.g., 1)
- `{{TP1}}` to `{{TP5}}` → Take profit levels
- `{{SL}}` → Stop loss level
- `{{ENTRY_TRAIL}}` → Entry trailing % (optional, default 0.5)
- `{{TP_TRAIL}}` → TP trailing % (optional, default 0.5)

### Step 3: Configure Alert

1. **Condition**: Your indicator condition (e.g., Long Entry signal)
2. **Alert Name**: Descriptive name (e.g., "BTC Long Entry")
3. **Message**: Paste the JSON template (with placeholders replaced)
4. **Webhook URL**: Your webhook endpoint
   ```
   https://strange-dyanne-tradingbot12-29686213.koyeb.app/webhook?token=YOUR_SECRET_TOKEN
   ```

---

## ✅ Testing

### Run the Test File

```bash
node tests/test-new-tradingview-format.js
```

This tests:
1. ✅ LONG signal (new format)
2. ✅ SHORT signal (new format)
3. ✅ Legacy format (backward compatibility)
4. ✅ Error handling

### Manual Test with cURL

**LONG Signal Test:**

```bash
curl -X POST https://strange-dyanne-tradingbot12-29686213.koyeb.app/webhook?token=YOUR_SECRET_TOKEN \
  -H "Content-Type: application/json" \
  -d '{
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
      "4": 93850
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
  }'
```

---

## 📊 Field Mapping

| New Format Field | Old Format Field | Description |
|------------------|------------------|-------------|
| `pair` | `symbol` | Trading pair (e.g., BTCUSDT) |
| `signal_type` | `action` (derived) | "Regular (Long)" → action: "entry" |
| `trade_signal.side` | `side` | LONG or SHORT |
| `trade_signal.size` | `size` | Position size |
| `position_size` | `size` (alternative) | Position size % |
| `leverage` | `leverage` | Extracted from "Isolated (10X)" |
| `take_profit_targets.1` | `tp1` | First TP level |
| `take_profit_targets.2` | `tp2` | Second TP level |
| `stop_targets.1` | `sl` | Stop loss level |
| `trade_signal.tag` | `tag` | Signal tag (e.g., #SFP_SL) |
| `exchange` | (metadata) | Exchange name |
| `entry_type` | (metadata) | Entry instruction |
| `trailing_configuration` | (metadata) | Trailing config |

---

## 🚀 What Changed

### 1. **Updated Files**

- ✅ `src/utils/validator.js`
  - Added `normalizeNewFormat()` method
  - Added `extractAction()` helper
  - Added `extractLeverage()` helper
  - Updated `validateWebhookData()` to handle both formats

- ✅ `src/services/cornixFormatter.js`
  - Enhanced `formatEntryCommand()` with detailed output
  - Added support for `exchange` and `entry_type` fields
  - Beautiful formatting matching your template

- ✅ `tests/test-new-tradingview-format.js`
  - Comprehensive test suite
  - Tests both formats
  - Error handling validation

### 2. **Backward Compatibility**

Your old webhooks still work! The system detects the format automatically:

```javascript
// OLD FORMAT (still works!)
{
  "action": "entry",
  "side": "long",
  "symbol": "BTCUSDT",
  "size_type": "percent",
  "size": 1,
  "tp1": 93400,
  "sl": 82990
}

// NEW FORMAT (now supported!)
{
  "trade_signal": { "symbol": "BTCUSDT", "side": "LONG" },
  "take_profit_targets": { "1": 93400 },
  "stop_targets": { "1": 82990 }
}
```

---

## 🎉 Ready to Use!

1. ✅ Update your TradingView alerts with the new JSON format
2. ✅ Test with `node tests/test-new-tradingview-format.js`
3. ✅ Deploy and monitor in production
4. ✅ Enjoy automated trading with beautiful Cornix signals!

---

## 📞 Support

If you encounter any issues:

1. Check the server logs: `https://app.koyeb.com/`
2. Test locally: `node tests/test-new-tradingview-format.js`
3. Verify webhook format matches templates above
4. Check Telegram channel receives signals

**Your TradingBot is now upgraded and ready! 🚀**
