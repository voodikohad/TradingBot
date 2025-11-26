# Cornix Setup Guide - Complete Configuration

## 🎯 Problem: Message Arrives but No Trade Opens

Your webhook is working perfectly ✅  
The issue is Cornix bot configuration in your Telegram channel ❌

---

## 📋 Complete Cornix Setup Checklist

### Step 1: Add Cornix Bot to Your Channel

1. Open your Telegram channel: `-1003262035445`
2. Click channel name → **Administrators**
3. Click **Add Administrator**
4. Search for and add: **@CornixBot**
5. Give it these permissions:
   - ✅ Post messages
   - ✅ Edit messages
   - ✅ Delete messages
   - ✅ Pin messages (optional)

⚠️ **Important:** Cornix must be an **administrator**, not just a member!

---

### Step 2: Create a Signal Bot in Cornix

1. Open direct message with **@CornixBot** (not in the channel)
2. Send command: `/start`
3. Click **"Signal Bots"** button
4. Click **"Create New Signal Bot"**
5. Enter a name: `TradingView Signals` (or any name you want)
6. Click **"Add Channel"**
7. Select your channel: Your channel should appear in the list
8. Click **"Done"**

✅ Your Signal Bot is now created!

---

### Step 3: Configure Auto-Trading

1. In @CornixBot DM, go to **"Signal Bots"**
2. Select your signal bot: `TradingView Signals`
3. Click **"Settings"** → **"Auto-Trading"**
4. Click **"Add Exchange"**
5. Select **"Bybit"**
6. Click **"Add API Key"**

#### Enter Your Bybit API Credentials:
- **API Key:** Your Bybit API key
- **Secret Key:** Your Bybit secret key
- **Passphrase:** (if Bybit requires it)

⚠️ **For Demo/Testnet:**
- If using Bybit Testnet, you need Bybit Testnet API keys
- Get them from: https://testnet.bybit.com → API Management

7. Click **"Test Connection"**
8. If successful, click **"Save"**

---

### Step 4: Enable Auto-Trading

1. Still in **"Auto-Trading"** settings
2. Toggle **"Enable Auto-Trading"** → ON ✅
3. Configure these settings:

   **Basic Settings:**
   - **Exchange:** Bybit
   - **Account Type:** Demo/Testnet or Futures
   - **Position Mode:** One-way or Hedge (match your Bybit setting)
   - **Margin Mode:** Isolated or Cross (match your Bybit setting)

   **Risk Settings:**
   - **Max Position Size:** e.g., 100 USDT or 10% (your preference)
   - **Allow Multiple Entries:** ON or OFF (your preference)
   - **Stop Loss:** Enabled ✅
   - **Take Profit:** Enabled ✅

4. Click **"Save"**

---

### Step 5: Verify Signal Bot is Active

1. In @CornixBot DM, go to **"Signal Bots"**
2. Select your signal bot: `TradingView Signals`
3. Check status shows: ✅ **Active**
4. Check auto-trading shows: ✅ **Enabled**

---

### Step 6: Test the Setup

#### Method 1: Manual Test in Channel
1. Go to your Telegram channel
2. Type this message directly:
   ```
   /entry BTCUSDT long 1% LONG_ENTRY
   ```
3. Send it
4. **Expected:** Cornix should reply with trade confirmation

If this works → Cornix is configured ✅  
If this doesn't work → Check Steps 1-5 again

#### Method 2: Test via Webhook (Your Current Method)
1. Trigger your TradingView alert
2. Check message appears in channel ✅ (already working)
3. Check Cornix bot replies with trade confirmation

---

## 🔍 Troubleshooting

### Issue: Cornix Doesn't Respond to Commands

**Possible Causes:**

#### 1. Cornix Not an Administrator
- Solution: Make @CornixBot an administrator in the channel
- Verify: Channel info → Administrators → @CornixBot should be listed

#### 2. Signal Bot Not Connected to Channel
- Solution: 
  - DM @CornixBot → Signal Bots → Your bot
  - Settings → Channels
  - Verify your channel is listed
  - If not, add it again

#### 3. Auto-Trading Disabled
- Solution:
  - DM @CornixBot → Signal Bots → Your bot
  - Settings → Auto-Trading
  - Toggle ON
  - Verify Bybit API is connected

#### 4. Exchange API Not Connected
- Solution:
  - Check Bybit API keys are correct
  - Check API has trading permissions enabled
  - For testnet: Use testnet API keys, not mainnet
  - Test connection in Cornix settings

#### 5. Command Format Issues
Our webhook sends:
```
/entry BTCUSDT long 1% LONG_ENTRY
```

Cornix expects one of these formats:
```
/entry BTCUSDT long 1%
/entry BTCUSDT long 1% #LONG_ENTRY
/entry long BTCUSDT 1%
```

✅ Our format is correct!

#### 6. Bybit Demo/Testnet Specific
- Cornix may not support all testnet exchanges
- Verify Bybit Testnet is supported in Cornix
- Try with real Bybit account (with small amounts)

---

## 📊 Expected Flow When Everything Works

### 1. TradingView sends JSON:
```json
{"action":"entry","side":"long","symbol":"BTCUSDT","size_type":"percent","size":1.0,"tag":"LONG_ENTRY"}
```

### 2. Your Webhook posts to Telegram:
```
🚀 TRADE SIGNAL EXECUTED
═══════════════════════════
Symbol: BTCUSDT
Action: ENTRY
Side: LONG
Size: 1%
Tag: LONG_ENTRY
═══════════════════════════
Cornix Command:
/entry BTCUSDT long 1% LONG_ENTRY

Timestamp: 11/26/2025, 3:00:00 PM
```

### 3. Cornix Bot Responds (in same channel):
```
✅ Entry Order Executed
━━━━━━━━━━━━━━━━━━━━
Exchange: Bybit
Symbol: BTCUSDT
Side: LONG
Entry: 42,500 USDT
Size: 0.024 BTC (1% of balance)
Status: Order Filled
━━━━━━━━━━━━━━━━━━━━
```

### 4. Trade Opens on Bybit
Check your Bybit Futures → Positions → Should see BTCUSDT long position

---

## 🎯 Quick Checklist

Before testing again, verify ALL of these:

- [ ] @CornixBot is **administrator** in channel
- [ ] Signal Bot created in @CornixBot DM
- [ ] Signal Bot connected to your channel
- [ ] Auto-Trading **enabled** in Signal Bot settings
- [ ] Bybit exchange added with API keys
- [ ] API connection tested successfully
- [ ] Exchange account type matches (Demo/Testnet vs Mainnet)
- [ ] Position mode and margin mode match Bybit settings
- [ ] Manual test: `/entry BTCUSDT long 1% TEST` works in channel

---

## 💡 Alternative: Check Cornix Logs

1. DM @CornixBot
2. Go to **"Signal Bots"** → Your bot
3. Click **"Logs"** or **"History"**
4. Check if Cornix received the command
5. Look for error messages

Common errors:
- "API Error" → Check API keys
- "Insufficient Balance" → Check account balance
- "Invalid Symbol" → Use BTCUSDT not BTC/USDT
- "Order Rejected" → Check position mode/margin mode

---

## 📞 Getting Help

If still not working:

1. **Check Cornix Documentation:**
   - https://cornix.io/documentation

2. **Contact Cornix Support:**
   - In @CornixBot, click **"Support"**
   - Explain: "Commands appear in channel but trades don't open"
   - Share: Exchange (Bybit), Account type (Demo/Testnet)

3. **Verify with Simple Test:**
   - In channel, type: `/entry BTCUSDT long 1%`
   - If this doesn't work → Pure Cornix configuration issue
   - If this works → Check webhook message format

---

## ✅ Summary

**Your webhook is working perfectly! The message reaches Telegram.**

**The issue is one of these:**
1. Cornix bot not administrator in channel
2. Signal Bot not created/connected to channel  
3. Auto-trading not enabled
4. Bybit API not connected/configured
5. Using testnet but API is for mainnet (or vice versa)

**Follow Steps 1-6 above carefully, and it will work!**

---

## 🔧 Need Different Cornix Command Format?

If Cornix requires a different format, let me know and I'll adjust the webhook.

Current format we send:
```
/entry BTCUSDT long 1% LONG_ENTRY
```

Can change to:
```
/entry BTCUSDT long 1% #LONG_ENTRY
```
or any other format Cornix prefers.
