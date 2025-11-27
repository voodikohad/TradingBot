# Postman Testing Guide

## 🚀 Quick Setup

### 1. Import Collection into Postman

1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `POSTMAN_TEST_COLLECTION.json`
5. Click **Import**

### 2. Configure Variables

After importing, update the collection variables:

1. Click on the collection name "TradingBot - Luxalgo Webhook Tests"
2. Go to **Variables** tab
3. Update these values:

| Variable | Current Value | What to Put |
|----------|--------------|-------------|
| `webhook_url` | `https://your-app.koyeb.app/webhook` | Your actual Koyeb webhook URL |
| `webhook_secret` | `your-webhook-secret-here` | Your `WEBHOOK_SECRET` from Koyeb env vars |

4. Click **Save**

---

## 📋 Test Collection Overview

The collection includes **14 test requests**:

### ✅ Valid Tests (Should Return 200 OK)

1. **ENTRY - LONG (Percent)** - Test long entry with 1% size
2. **ENTRY - SHORT (Percent)** - Test short entry with 1% size  
3. **ENTRY - LONG (USD)** - Test long entry with $100 size
4. **ENTRY - ETH (No Tag)** - Test without tag field
5. **STOP-LOSS - LONG** - Test SL trigger for long position
6. **STOP-LOSS - SHORT** - Test SL trigger for short position
7. **TAKE-PROFIT 1** - Test TP level 1
8. **TAKE-PROFIT 2** - Test TP level 2
9. **TAKE-PROFIT 3** - Test TP level 3
10. **TAKE-PROFIT 4** - Test TP level 4
11. **TAKE-PROFIT 5** - Test TP level 5
12. **Simple Symbol** - Test without exchange prefix

### ❌ Invalid Tests (Should Return Errors)

13. **Invalid - Missing Action** - Should return 400 Bad Request
14. **Invalid - Wrong Secret** - Should return 401 Unauthorized

---

## 🧪 How to Run Tests

### Option 1: Run Individual Test

1. Click on any request in the collection
2. Click **Send** button
3. Check the response:
   - **Status**: Should be `200 OK` for valid tests
   - **Body**: Should contain `success: true` and `cornixCommand`

### Option 2: Run All Tests (Collection Runner)

1. Click on collection name
2. Click **Run** button (top right)
3. Select all requests (or choose specific ones)
4. Click **Run TradingBot - Luxalgo Webhook Tests**
5. View results summary

---

## ✅ Expected Responses

### Successful Entry Response
```json
{
  "success": true,
  "action": "entry",
  "symbol": "BYBIT:BTCUSDT.P",
  "cornixCommand": "/entry BTCUSDT long 1% #SFP_SL",
  "message": "Trade signal executed successfully",
  "processingTime": "123ms",
  "timestamp": "2025-11-27T12:00:00.000Z"
}
```

### Successful SL Response
```json
{
  "success": true,
  "action": "sl",
  "symbol": "BYBIT:BTCUSDT.P",
  "cornixCommand": "/sl BTCUSDT #SFP_SL",
  "message": "Trade signal executed successfully",
  "processingTime": "89ms",
  "timestamp": "2025-11-27T12:00:00.000Z"
}
```

### Successful TP Response
```json
{
  "success": true,
  "action": "tp",
  "symbol": "BYBIT:BTCUSDT.P",
  "cornixCommand": "/tp BTCUSDT 1 #SFP_SL",
  "message": "Trade signal executed successfully",
  "processingTime": "95ms",
  "timestamp": "2025-11-27T12:00:00.000Z"
}
```

### Validation Error Response (400)
```json
{
  "error": "Invalid webhook data",
  "details": [
    "Missing required field: action"
  ],
  "received": { ... }
}
```

### Authentication Error Response (401)
```json
{
  "error": "Unauthorized: Invalid or missing webhook secret token"
}
```

---

## 📊 What to Check

For each successful test, verify:

1. ✅ **Status Code**: `200 OK`
2. ✅ **Response Time**: Under 1000ms
3. ✅ **Success Field**: `true`
4. ✅ **Cornix Command**: Properly formatted
5. ✅ **Symbol Parsing**: `BYBIT:BTCUSDT.P` → `BTCUSDT`

### Example Validations

| Test | Expected Cornix Command |
|------|------------------------|
| Entry Long | `/entry BTCUSDT long 1% #SFP_SL` |
| Entry Short | `/entry BTCUSDT short 1% #SFP_SL` |
| Stop-Loss | `/sl BTCUSDT #SFP_SL` |
| Take-Profit 1 | `/tp BTCUSDT 1 #SFP_SL` |
| Take-Profit 5 | `/tp BTCUSDT 5 #SFP_SL` |

---

## 🔍 Check Telegram Channel

After running tests, verify in your Telegram channel:

1. Open your Telegram channel
2. You should see messages like:

```
🚀 AUTO-TRADE SIGNAL
═══════════════════════════
Symbol: BYBIT:BTCUSDT.P
Action: ENTRY
Side: LONG
Size: 1%
Tag: #SFP_SL
═══════════════════════════
Command:
/entry BTCUSDT long 1% #SFP_SL

Time: 2025-11-27T12:00:00.000Z
```

3. Cornix should parse these commands automatically

---

## 🐛 Troubleshooting

### "Unauthorized" Error
- ❌ Problem: Wrong webhook secret
- ✅ Solution: Check `X-Webhook-Secret` header matches your env var

### "Connection Refused" Error  
- ❌ Problem: Wrong webhook URL
- ✅ Solution: Verify Koyeb app URL is correct and running

### "Validation Failed" Error
- ❌ Problem: Missing required fields
- ✅ Solution: Check JSON payload has all required fields for that action

### No Message in Telegram
- ❌ Problem: Telegram bot configuration
- ✅ Solution: Check `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in Koyeb env

---

## 💡 Testing Tips

1. **Start with Entry Test** - Easiest to verify in Telegram
2. **Check Koyeb Logs** - Monitor real-time processing
3. **Use Collection Runner** - Run all tests at once
4. **Test Invalid Requests** - Ensure errors are handled properly
5. **Check Response Times** - Should be under 500ms

---

## 📝 Custom Test Requests

You can duplicate any request and modify:

- **Symbol**: `BYBIT:ETHUSDT.P`, `BINANCE:BTCUSDT`, etc.
- **Size**: `0.5`, `2.0`, `250` (USD)
- **Tag**: `SCALP`, `SWING`, `MANUAL_TRADE`
- **TP Number**: `1`, `2`, `3`, `4`, `5`

---

## ✨ Ready to Test!

1. Import collection
2. Set variables (webhook_url, webhook_secret)
3. Run tests
4. Check Telegram channel
5. Verify Cornix receives commands

**Questions?** Check Koyeb logs or the main `LUXALGO_JSON_FORMAT.md` documentation.
