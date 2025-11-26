# Webhook Flow Confirmation

## ✅ CONFIRMED: Your JSON Format is Perfect

Your TradingView indicator sends **exactly** the correct format. No changes needed.

---

## 📥 What TradingView Sends (Your Indicator)

### LONG Entry:
```json
{
  "action": "entry",
  "side": "long",
  "symbol": "{{ticker}}",
  "size_type": "percent",
  "size": 1.0,
  "tag": "SFP_SL"
}
```

### SHORT Entry:
```json
{
  "action": "entry",
  "side": "short",
  "symbol": "{{ticker}}",
  "size_type": "percent",
  "size": 1.0,
  "tag": "SFP_SL"
}
```

**✅ This is EXACTLY what our webhook expects. Perfect!**

---

## 🔄 What Happens Inside Our Backend

### Step 1: TradingView → Webhook
Your indicator sends the simple JSON above to:
```
POST https://your-railway-app.railway.app/webhook
```

With header:
```
X-Webhook-Secret: your_webhook_secret_token
```

### Step 2: Backend Processing
Our server:
1. ✅ Validates the webhook secret
2. ✅ Validates the JSON structure (action, side, symbol, size_type, size, tag)
3. ✅ Converts it to Cornix text format
4. ✅ Sends to Telegram channel

### Step 3: Cornix Command Created
**For your LONG entry JSON above, we create:**
```
/entry BTCUSDT long 1% SFP_SL
```

**For your SHORT entry JSON above, we create:**
```
/entry BTCUSDT short 1% SFP_SL
```

This text is what Cornix sees in the Telegram channel.

---

## 📤 What TradingView Receives Back (Response)

After processing, our webhook responds to TradingView with:
```json
{
  "success": true,
  "cornixCommand": "/entry BTCUSDT long 1% SFP_SL",
  "message": "Trade signal processed successfully",
  "timestamp": "2025-11-26T15:00:00.000Z"
}
```

**⚠️ Important:** The fields `success`, `cornixCommand`, `message`, `timestamp` are **ONLY in our response**. They are NOT required from TradingView. Your indicator doesn't need to include them.

---

## 🎯 Final Confirmation

### ✅ YES - Your incoming JSON format is correct
The backend **accepts exactly** this format from TradingView:
- `action`: "entry" | "sl" | "tp"
- `side`: "long" | "short"
- `symbol`: "BTCUSDT" (or {{ticker}})
- `size_type`: "percent" | "usd"
- `size`: number (e.g., 1.0)
- `tag`: "SFP_SL" (optional)

### ✅ YES - Cornix only sees the text command
Cornix **never** sees the JSON. It only sees:
```
/entry BTCUSDT long 1% SFP_SL
```
in the Telegram channel.

### ✅ YES - No changes needed to your indicator
Your `longEntryMsg` and `shortEntryMsg` are **perfect as-is**. 
Don't change anything in your TradingView script.

---

## 📋 TradingView Alert Setup

Create **ONE** alert per chart:

**Alert Condition:** "Any alert() function call"  
**Message:** Leave empty (indicator sends JSON automatically)  
**Webhook URL:** `https://your-railway-app.railway.app/webhook?token=your_webhook_secret`

Alternative (more secure - token in header):  
**Webhook URL:** `https://your-railway-app.railway.app/webhook`  
**Headers:** `X-Webhook-Secret: your_webhook_secret`

---

## 🧪 Test Your Webhook

Use this Postman request to test:

**Method:** POST  
**URL:** `https://your-railway-app.railway.app/webhook`  
**Headers:**
```
Content-Type: application/json
X-Webhook-Secret: your_webhook_secret
```

**Body (LONG):**
```json
{
  "action": "entry",
  "side": "long",
  "symbol": "BTCUSDT",
  "size_type": "percent",
  "size": 1.0,
  "tag": "SFP_SL"
}
```

**Body (SHORT):**
```json
{
  "action": "entry",
  "side": "short",
  "symbol": "BTCUSDT",
  "size_type": "percent",
  "size": 1.0,
  "tag": "SFP_SL"
}
```

**Expected Response:**
```json
{
  "success": true,
  "cornixCommand": "/entry BTCUSDT long 1% SFP_SL",
  "message": "Trade signal processed successfully",
  "timestamp": "2025-11-26T15:00:00.000Z"
}
```

**Expected in Telegram:**
You'll see a message with the Cornix command that looks like:
```
🚀 TRADE SIGNAL EXECUTED
═══════════════════════════
Symbol: BTCUSDT
Action: ENTRY
Side: LONG
Size: 1%
Tag: SFP_SL
═══════════════════════════
Cornix Command:
/entry BTCUSDT long 1% SFP_SL

Timestamp: 11/26/2025, 3:00:00 PM
```

---

## ✅ Summary

| Question | Answer |
|----------|--------|
| Does backend accept your simple JSON? | ✅ YES - Exactly as-is |
| Are `success`, `cornixCommand` fields required from TradingView? | ❌ NO - Only in response |
| Does Cornix see the JSON? | ❌ NO - Only sees text command |
| Do you need to change your indicator? | ❌ NO - Perfect as-is |
| What format does Cornix receive? | `/entry BTCUSDT long 1% SFP_SL` |

**Everything is correctly implemented. Your indicator's JSON is perfect! 🎉**
