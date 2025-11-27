# Luxalgo Indicator JSON Format Reference

## ✅ Confirmed Working Formats

All formats tested and working at 100% success rate.

---

## 📋 JSON Formats for TradingView Alerts

### 1️⃣ **ENTRY Signals**

Use this for opening new positions (LONG or SHORT):

```json
{
  "action": "entry",
  "side": "long",
  "symbol": "BYBIT:BTCUSDT.P",
  "size_type": "percent",
  "size": 1.0,
  "tag": "SFP_SL"
}
```

**Fields:**
- `action`: Must be `"entry"`
- `side`: `"long"` or `"short"`
- `symbol`: From `syminfo.ticker` (e.g., `"BYBIT:BTCUSDT.P"`)
- `size_type`: `"percent"` or `"usd"`
- `size`: Numeric value (e.g., `1.0` for 1%, `100` for $100)
- `tag`: *(optional)* Your custom tag (e.g., `"SFP_SL"`)

**Cornix Output:**
```
/entry BTCUSDT long 1% #SFP_SL
```

---

### 2️⃣ **STOP-LOSS Signals**

Use this to trigger stop-loss on existing positions:

```json
{
  "action": "sl",
  "side": "long",
  "symbol": "BYBIT:BTCUSDT.P",
  "tag": "SFP_SL"
}
```

**Fields:**
- `action`: Must be `"sl"`
- `side`: `"long"` or `"short"` (must match the position side)
- `symbol`: From `syminfo.ticker`
- `tag`: *(optional)* Your custom tag

**Cornix Output:**
```
/sl BTCUSDT #SFP_SL
```

---

### 3️⃣ **TAKE-PROFIT Signals (TP1-TP5)**

Use this for take-profit levels 1 through 5:

```json
{
  "action": "tp",
  "side": "long",
  "symbol": "BYBIT:BTCUSDT.P",
  "tp_number": 1,
  "tag": "SFP_SL"
}
```

**Fields:**
- `action`: Must be `"tp"`
- `side`: `"long"` or `"short"` (must match the position side)
- `symbol`: From `syminfo.ticker`
- `tp_number`: `1`, `2`, `3`, `4`, or `5` (which TP level to trigger)
- `tag`: *(optional)* Your custom tag

**Cornix Output:**
```
/tp BTCUSDT 1 #SFP_SL
/tp BTCUSDT 2 #SFP_SL
/tp BTCUSDT 3 #SFP_SL
... etc
```

---

## 📝 Pine Script Examples

### Entry Alert (LONG)
```pinescript
alert(
  '{"action":"entry","side":"long","symbol":"' + syminfo.ticker + 
  '","size_type":"percent","size":1.0,"tag":"SFP_SL"}',
  alert.freq_once_per_bar_close
)
```

### Entry Alert (SHORT)
```pinescript
alert(
  '{"action":"entry","side":"short","symbol":"' + syminfo.ticker + 
  '","size_type":"percent","size":1.0,"tag":"SFP_SL"}',
  alert.freq_once_per_bar_close
)
```

### Stop-Loss Alert (LONG)
```pinescript
alert(
  '{"action":"sl","side":"long","symbol":"' + syminfo.ticker + 
  '","tag":"SFP_SL"}',
  alert.freq_once_per_bar_close
)
```

### Take-Profit Alerts (TP1-TP5)
```pinescript
// TP1
alert(
  '{"action":"tp","side":"long","symbol":"' + syminfo.ticker + 
  '","tp_number":1,"tag":"SFP_SL"}',
  alert.freq_once_per_bar_close
)

// TP2
alert(
  '{"action":"tp","side":"long","symbol":"' + syminfo.ticker + 
  '","tp_number":2,"tag":"SFP_SL"}',
  alert.freq_once_per_bar_close
)

// ... and so on for TP3, TP4, TP5
```

---

## 🔍 Symbol Parsing Logic

The backend automatically cleans exchange-prefixed symbols:

| TradingView Symbol | Parsed for Cornix |
|-------------------|-------------------|
| `BYBIT:BTCUSDT.P` | `BTCUSDT` |
| `BINANCE:ETHUSDT` | `ETHUSDT` |
| `BTCUSDT` | `BTCUSDT` |
| `COINBASE:BTCUSD` | `BTCUSD` |

**Cleaning rules:**
1. Remove exchange prefix (everything before `:`)
2. Remove perpetual suffix (`.P`)
3. Convert to uppercase

---

## ✅ Validation Rules

### Required Fields by Action

| Action | Required Fields |
|--------|----------------|
| `entry` | `action`, `side`, `symbol`, `size_type`, `size` |
| `sl` | `action`, `side`, `symbol` |
| `tp` | `action`, `side`, `symbol` |

### Valid Values

- **action**: `entry`, `sl`, `tp`, `exit`
- **side**: `long`, `short`
- **size_type**: `percent`, `usd`
- **size**: Positive number (e.g., `1.0`, `100`)
- **tp_number**: `1`, `2`, `3`, `4`, or `5`
- **tag**: Alphanumeric, dash, underscore, hash only (e.g., `SFP_SL`, `MANUAL_TRADE`)

### Symbol Format

Accepts:
- Letters (A-Z, a-z)
- Numbers (0-9)
- Colon (`:`) for exchange prefix
- Dot (`.`) for perpetual suffix
- Dash (`-`)
- Underscore (`_`)

Examples: `BYBIT:BTCUSDT.P`, `BINANCE:ETHUSDT`, `BTC-USD`

---

## 🧪 Testing

Run the test suite to verify all formats:

```bash
node tests/test-luxalgo-formats.js
```

Expected output: `Success Rate: 100.0%`

---

## 📡 Webhook Configuration

### TradingView Alert Setup

1. **Create Alert** in TradingView
2. **Webhook URL**: `https://your-koyeb-app.koyeb.app/webhook`
3. **Alert Message**: Use the JSON formats above
4. **Webhook Headers**: Add custom header
   - Name: `X-Webhook-Secret`
   - Value: Your webhook secret from Koyeb env vars

### Environment Variables Required

```
WEBHOOK_SECRET=your-secret-token
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-channel-id
PORT=3000
LOG_LEVEL=info
```

---

## 🚀 End-to-End Flow

1. **TradingView Indicator** generates signal → Sends JSON webhook
2. **Your Backend** receives → Validates → Parses symbol → Formats Cornix command
3. **Telegram Bot** sends command to your channel
4. **Cornix Bot** reads message → Executes trade on Bybit

---

## 📊 Example Complete Flow

**TradingView sends:**
```json
{"action":"entry","side":"long","symbol":"BYBIT:BTCUSDT.P","size_type":"percent","size":1.0,"tag":"SFP_SL"}
```

**Backend processes:**
- Validates ✅
- Parses symbol: `BYBIT:BTCUSDT.P` → `BTCUSDT`
- Formats: `/entry BTCUSDT long 1% #SFP_SL`

**Telegram receives:**
```
/entry BTCUSDT long 1% #SFP_SL
```

**Cornix executes:**
- Opens LONG position
- On BTCUSDT
- With 1% of portfolio
- Tagged with #SFP_SL

---

## ✨ Ready to Deploy

All JSON formats are tested and production-ready. You can now:

1. ✅ Update your Pine Script indicator with these exact formats
2. ✅ Create TradingView alerts using the webhook
3. ✅ Test with a small position size first
4. ✅ Monitor logs in Koyeb dashboard

**Questions?** Check the test file: `tests/test-luxalgo-formats.js`
