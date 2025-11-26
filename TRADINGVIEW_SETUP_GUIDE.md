# 📡 TradingView Webhook Setup Guide

## For Your Clients

This guide shows how to connect TradingView alerts to your trading bot.

---

## 🔗 Webhook URL

Your webhook endpoint:
```
https://strange-dyanne-tradingbot12-29686213.koyeb.app/webhook?token=mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb
```

**Note:** The `?token=...` at the end is required for authentication.

---

## 📝 Step-by-Step Setup

### 1. Open TradingView

- Go to [TradingView.com](https://www.tradingview.com)
- Open any chart (e.g., BTCUSDT, ETHUSDT, etc.)

### 2. Create an Alert

- Click the **Alert** button (clock icon) or press `Alt + A`
- Configure your alert conditions (indicator, price level, strategy, etc.)

### 3. Configure Notifications

In the alert settings:

1. **Name your alert** (e.g., "BTC Long Entry")
2. Scroll to **Notifications** section
3. ✅ Check **"Webhook URL"**
4. Paste your webhook URL:
   ```
   https://strange-dyanne-tradingbot12-29686213.koyeb.app/webhook?token=mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb
   ```

### 4. Set Message Format

In the **"Message"** field, paste one of these JSON templates:

---

## 📋 Message Templates

### 🟢 ENTRY Signal (Long Position)

```json
{
  "action": "entry",
  "side": "long",
  "symbol": "{{ticker}}",
  "size_type": "percent",
  "size": 1.0,
  "tag": "LONG_ENTRY"
}
```

### 🔴 ENTRY Signal (Short Position)

```json
{
  "action": "entry",
  "side": "short",
  "symbol": "{{ticker}}",
  "size_type": "percent",
  "size": 1.0,
  "tag": "SHORT_ENTRY"
}
```

### 🛑 STOP LOSS

```json
{
  "action": "sl",
  "side": "long",
  "symbol": "{{ticker}}",
  "size_type": "percent",
  "size": 100,
  "tag": "STOP_LOSS"
}
```

### 🎯 TAKE PROFIT

```json
{
  "action": "tp",
  "side": "long",
  "symbol": "{{ticker}}",
  "size_type": "percent",
  "size": 50,
  "tag": "TP1"
}
```

### 🚪 EXIT (Close Position)

```json
{
  "action": "exit",
  "side": "long",
  "symbol": "{{ticker}}",
  "size_type": "percent",
  "size": 100,
  "tag": "EXIT_ALL"
}
```

---

## 🔧 Field Explanations

### Required Fields:

| Field | Values | Description |
|-------|--------|-------------|
| `action` | `entry`, `sl`, `tp`, `exit` | Type of trade signal |
| `side` | `long`, `short` | Position direction |
| `symbol` | `{{ticker}}` or `BTCUSDT` | Trading pair (use `{{ticker}}` for dynamic) |
| `size_type` | `percent`, `usd` | How to calculate position size |
| `size` | Number (0.1 to 100) | Position size amount |

### Optional Fields:

| Field | Description |
|-------|-------------|
| `tag` | Custom label for tracking (e.g., "SFP_SL", "MY_STRATEGY") |

---

## 💡 TradingView Variables

You can use these variables in your message (TradingView will replace them):

| Variable | Description | Example |
|----------|-------------|---------|
| `{{ticker}}` | Symbol being traded | `BTCUSDT` |
| `{{close}}` | Current close price | `50000` |
| `{{volume}}` | Current volume | `1234.56` |
| `{{time}}` | Alert timestamp | `2025-11-26T03:30:00Z` |
| `{{interval}}` | Chart timeframe | `15`, `1H`, `1D` |

**Example with price:**
```json
{
  "action": "entry",
  "side": "long",
  "symbol": "{{ticker}}",
  "size_type": "percent",
  "size": 1.0,
  "tag": "Entry at {{close}}"
}
```

---

## 🎯 Real-World Examples

### Example 1: RSI Oversold Entry

**Alert Condition:** RSI < 30

**Webhook Message:**
```json
{
  "action": "entry",
  "side": "long",
  "symbol": "{{ticker}}",
  "size_type": "percent",
  "size": 2.0,
  "tag": "RSI_OVERSOLD"
}
```

### Example 2: Moving Average Cross

**Alert Condition:** MA(9) crosses above MA(21)

**Webhook Message:**
```json
{
  "action": "entry",
  "side": "long",
  "symbol": "{{ticker}}",
  "size_type": "percent",
  "size": 1.5,
  "tag": "MA_CROSS_LONG"
}
```

### Example 3: Stop Loss Trigger

**Alert Condition:** Price drops 2% below entry

**Webhook Message:**
```json
{
  "action": "sl",
  "side": "long",
  "symbol": "{{ticker}}",
  "size_type": "percent",
  "size": 100,
  "tag": "2%_SL"
}
```

---

## ✅ Testing Your Setup

### Quick Test

1. Create a simple price alert (e.g., "BTC > 40000")
2. Use this test message:
```json
{
  "action": "entry",
  "side": "long",
  "symbol": "BTCUSDT",
  "size_type": "percent",
  "size": 1.0,
  "tag": "TEST_SIGNAL"
}
```
3. Set the price condition to trigger immediately
4. Check your Telegram channel for the Cornix message
5. Check the dashboard: https://trading-bot-mocha-eight.vercel.app

### What Should Happen:

1. ✅ Alert triggers in TradingView
2. ✅ Webhook sends data to your backend
3. ✅ Backend processes and creates Cornix command
4. ✅ Telegram message sent to your channel
5. ✅ Signal appears in dashboard

---

## 🚨 Troubleshooting

### Alert Not Triggering?

- ✅ Check alert conditions are met
- ✅ Verify alert is active (not expired)
- ✅ Check "Once Per Bar Close" vs "Once Per Bar"

### No Telegram Message?

1. Check backend logs in Koyeb
2. Verify webhook URL includes `?token=...`
3. Check JSON format is valid (use JSONLint.com)
4. Verify Telegram bot and chat ID are correct

### Dashboard Not Updating?

1. Refresh the page
2. Check browser console for errors
3. Verify frontend URL: https://trading-bot-mocha-eight.vercel.app
4. Check backend is running: https://strange-dyanne-tradingbot12-29686213.koyeb.app/health

---

## 📊 Position Sizing Examples

### Percent-based (Recommended)

```json
{
  "size_type": "percent",
  "size": 1.0
}
```
- Trades 1% of your account balance
- Safer for risk management
- Automatically adjusts to account size

### USD-based

```json
{
  "size_type": "usd",
  "size": 100
}
```
- Trades fixed $100 worth
- Good for consistent position sizes
- Doesn't scale with account

---

## 🔐 Security Best Practices

1. **Never share your webhook token** - It's like your password
2. **Use HTTPS only** - Already configured in your URL
3. **Test with small sizes first** - Use `"size": 0.1` for testing
4. **Monitor your alerts** - Check dashboard regularly
5. **Keep strategy names private** - Use generic tags like "ENTRY" instead of revealing your strategy

---

## 📞 Support

If clients have issues:

1. **Check webhook URL** has the full token parameter
2. **Validate JSON format** at [JSONLint.com](https://jsonlint.com)
3. **Test with manual POST** (as shown in your guide)
4. **Check backend health**: https://strange-dyanne-tradingbot12-29686213.koyeb.app/health

---

## 📱 What Clients Will See

### In Telegram:
```
🟢 BTCUSDT LONG 1.00%

b BTCUSDT Entry
Long
R:R= 1:2
Leverage: Isolated 10x
Entry Zone: 50000 - 50100

Take-Profit Targets:
1) 51000
2) 52000
3) 53000

⛔️ StopLoss: 49000
```

### In Dashboard:
- Real-time signal list
- Statistics (total signals, success rate)
- Recent trades
- System logs

---

**Your webhook is ready to receive signals 24/7!** 🚀
