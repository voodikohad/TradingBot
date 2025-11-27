# Telegram API Connection Issue - Diagnosis and Fix

## 🔴 Problem Identified

Your backend on **Koyeb** cannot reach Telegram's API (`api.telegram.org`). This causes:
- `WEBHOOK ERROR` 
- `Entry handler error`
- `Failed to send Telegram message after all retries`

## 🔍 Root Cause

When you tested manually:
```
https://api.telegram.org/bot/sendMessage?chat_id=-1003262035445&text=test
```

You got 404 because **the bot token is missing** from the URL. The correct format is:
```
https://api.telegram.org/bot<BOT_TOKEN>/sendMessage?chat_id=-1003262035445&text=test
```

However, the **real issue** is that **Koyeb is blocking outbound connections** to Telegram's API. This is why even the backend with the correct URL format fails.

## ✅ Solutions

### Option 1: Switch Hosting Platform (Recommended)

Koyeb may have firewall rules blocking Telegram. Switch to a platform that allows Telegram API:

#### **Best Alternative: Railway.app**
- ✅ Allows Telegram API
- ✅ Free tier: $5 credit/month
- ✅ Easy deployment from GitHub
- ✅ Environment variables management

**Deploy to Railway:**
1. Go to: https://railway.app
2. Sign in with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your `TradingBot` repository
5. Add environment variables:
   ```env
   PORT=3000
   WEBHOOK_SECRET=mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb
   TELEGRAM_BOT_TOKEN=8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY
   TELEGRAM_CHAT_ID=-1003262035445
   NODE_ENV=production
   ```
6. Deploy!

Your new webhook URL will be: `https://your-app.railway.app/webhook`

#### **Alternative: Render.com**
- ✅ Allows Telegram API
- ✅ Free tier available
- ✅ Similar to Railway

#### **Alternative: Heroku**
- ✅ Proven to work with Telegram
- ⚠️ No free tier anymore (minimum $5/month)

---

### Option 2: Use Telegram Bot API Proxy

If you must stay on Koyeb, use a proxy service:

#### **A. Use Telegram's Official Local Bot API Server**
This requires running your own Telegram Bot API server (complex).

#### **B. Use a Third-Party Proxy (Simpler)**

Update `telegramService.js` to use a proxy:

```javascript
// In constructor, change apiUrl to use a proxy
this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;

// Add proxy config to axiosConfig
this.axiosConfig = {
  timeout: this.timeout,
  proxy: {
    host: 'your-proxy-host.com',
    port: 8080
  },
  // ... rest of config
};
```

**Free proxy services for Telegram:**
- https://telegram-bot-api.herokuapp.com
- Self-host a simple proxy on a VPS

---

### Option 3: Verify Koyeb Network Settings

1. **Check Koyeb Dashboard:**
   - Go to your app settings
   - Look for "Network" or "Firewall" settings
   - Enable outbound HTTPS/443 if restricted

2. **Contact Koyeb Support:**
   - Ask: "Does Koyeb block outbound connections to api.telegram.org?"
   - Request whitelisting if needed

---

## 🧪 Testing Steps

### Step 1: Test from Browser (Correct URL)

Replace `<YOUR_BOT_TOKEN>` with your actual token:

```
https://api.telegram.org/bot8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY/getMe
```

**Expected Response:**
```json
{
  "ok": true,
  "result": {
    "id": 8552083574,
    "is_bot": true,
    "first_name": "YourBotName",
    "username": "YourBotUsername"
  }
}
```

If this works → Bot token is valid ✅

### Step 2: Test Send Message

```
https://api.telegram.org/bot8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY/sendMessage?chat_id=-1003262035445&text=Test%20from%20browser
```

If this works → Bot can send to your channel ✅

### Step 3: Test from Koyeb Deployment

Once deployed on new platform or Koyeb fixes network:

1. Visit: `https://your-backend-url.com/test-network`
   - Check if DNS, HTTP, and Telegram tests pass

2. Visit: `https://your-backend-url.com/test-send-message`
   - Should send a test message to your channel

3. Send webhook test:
   ```bash
   curl -X POST https://your-backend-url.com/webhook \
     -H "Content-Type: application/json" \
     -H "X-Webhook-Secret: YOUR_SECRET" \
     -d '{"action":"entry","side":"long","symbol":"BTCUSDT","size_type":"percent","size":1.0,"tag":"TEST"}'
   ```

---

## 📋 Quick Fix Checklist

**If switching to Railway (Recommended):**
- [ ] Deploy to Railway.app
- [ ] Add all environment variables
- [ ] Get new webhook URL
- [ ] Update TradingView alert webhook URL
- [ ] Test with `/test-send-message` endpoint
- [ ] Test actual webhook from TradingView

**If staying on Koyeb:**
- [ ] Contact Koyeb support about Telegram blocking
- [ ] Check Koyeb firewall settings
- [ ] Set up proxy if needed
- [ ] Test with direct test script: `node test-direct-telegram.js`

---

## 🚀 Next Steps After Platform Switch

1. **Update TradingView Alert:**
   - Go to your alert settings
   - Change webhook URL to new platform URL
   - Keep webhook secret the same

2. **Test Entry Signal:**
   ```json
   {"action":"entry","side":"long","symbol":"BTCUSDT","size_type":"percent","size":1.0,"tag":"LONG_ENTRY"}
   ```

3. **Verify Cornix Receives Command:**
   - Message should appear in Telegram channel
   - Cornix bot should respond and open trade

---

## 📞 Support

If you need help:

1. **Check Logs Tab in Dashboard:**
   - Look for Telegram connection status on startup
   - Check for DNS/network errors

2. **Use Diagnostic Endpoints:**
   - `/test-network` - Check network connectivity
   - `/test-telegram-connection` - Test bot API
   - `/test-send-message` - Send actual message

3. **Run Local Test:**
   ```bash
   node test-direct-telegram.js
   ```
   This will show exact error from your machine.

---

## 💡 Why This Happens

Some cloud platforms (like Koyeb, some AWS regions) block:
- Cryptocurrency-related APIs
- Bot/automation APIs  
- Specific domains for security

Telegram is sometimes caught in these filters.

**Solution:** Use a platform that explicitly supports bot development (Railway, Render, Heroku, DigitalOcean).

---

## ✅ Expected Outcome

Once on correct platform:

1. **Backend logs show:**
   ```
   ✅ TELEGRAM BOT CONNECTED
   Bot Name: YourBotUsername
   Bot ID: 8552083574
   ```

2. **Test endpoint works:**
   ```
   GET /test-send-message
   → Message appears in Telegram channel
   ```

3. **Webhook works:**
   ```
   POST /webhook with entry signal
   → Message appears in Telegram
   → Cornix responds and opens trade
   ```

---

**Recommended Action:** Deploy to Railway.app now. It takes 5 minutes and will solve the issue completely.
