# Deploy to Railway.app - 5 Minute Guide

## Why Railway?

✅ **Explicitly supports Telegram bots**  
✅ **$5 free credit per month** (enough for this app)  
✅ **No firewall blocking Telegram API**  
✅ **Automatic deployments from GitHub**  
✅ **Easy environment variable management**

---

## Step-by-Step Deployment

### 1. Sign Up for Railway

1. Go to: **https://railway.app**
2. Click **"Start a New Project"**
3. Sign in with GitHub
4. Authorize Railway to access your GitHub

### 2. Deploy from GitHub

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select: **`TradingBot`** repository
4. Railway will automatically detect it's a Node.js app

### 3. Add Environment Variables

1. Click on your project
2. Go to **"Variables"** tab
3. Click **"Add Variable"** and add each of these:

```env
PORT=3000
WEBHOOK_SECRET=mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb
TELEGRAM_BOT_TOKEN=8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY
TELEGRAM_CHAT_ID=-1003262035445
NODE_ENV=production
LOG_LEVEL=info
```

**IMPORTANT:** Do NOT include quotes around values in Railway!

### 4. Get Your Webhook URL

1. Go to **"Settings"** tab
2. Click **"Generate Domain"** under "Domains"
3. You'll get a URL like: `tradingbot-production.up.railway.app`

Your webhook URL is: `https://tradingbot-production.up.railway.app/webhook`

### 5. Deploy!

1. Railway automatically deploys when you push to GitHub
2. Or click **"Deploy"** manually
3. Wait 1-2 minutes for deployment
4. Check **"Logs"** tab to verify Telegram connection

**Expected log:**
```
✅ TELEGRAM BOT CONNECTED
Bot Name: YourBotUsername
Bot ID: 8552083574
```

---

## 🧪 Test Your Deployment

### Test 1: Health Check

Visit in browser:
```
https://tradingbot-production.up.railway.app/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "telegram": "connected",
  "botInfo": {
    "username": "YourBotUsername",
    "id": 8552083574
  }
}
```

### Test 2: Send Test Message

Visit in browser:
```
https://tradingbot-production.up.railway.app/test-send-message
```

**Expected:** Message appears in your Telegram channel! 🎉

### Test 3: Webhook Test

Use curl or Postman:
```bash
curl -X POST https://tradingbot-production.up.railway.app/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb" \
  -d '{"action":"entry","side":"long","symbol":"BTCUSDT","size_type":"percent","size":1.0,"tag":"LONG_ENTRY"}'
```

**Expected:** 
- Message appears in Telegram
- Cornix bot responds
- Trade opens on Bybit (if Cornix configured)

---

## 📝 Update TradingView Alert

Once deployed on Railway:

1. Go to TradingView → Your alert
2. Click **"Edit"**
3. In **Webhook URL**, change to:
   ```
   https://tradingbot-production.up.railway.app/webhook?token=mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb
   ```
4. Keep the JSON message the same
5. Click **"Save"**

---

## 🎯 Update Frontend (Vercel)

Your frontend on Vercel needs the new backend URL:

1. Go to Vercel dashboard
2. Select your frontend project
3. Go to **"Settings"** → **"Environment Variables"**
4. Update `VITE_API_URL` to:
   ```
   https://tradingbot-production.up.railway.app
   ```
5. Click **"Save"**
6. Trigger a new deployment (or it will auto-deploy)

---

## 💰 Pricing

**Railway Free Tier:**
- $5 credit/month
- Your app uses ~$3/month
- Plenty of free credit!

**If you exceed:**
- Railway charges $0.000463 per GB-hour
- Very affordable (~$5-10/month for constant usage)

---

## 🔧 Troubleshooting

### If deployment fails:

1. **Check logs:**
   - Railway dashboard → "Logs" tab
   - Look for errors

2. **Verify environment variables:**
   - Make sure no quotes around values
   - Make sure all 6 variables are set

3. **Check package.json:**
   - Railway uses `npm start` by default
   - Your `package.json` should have:
     ```json
     "scripts": {
       "start": "node index.js"
     }
     ```

### If Telegram still doesn't work:

1. **Check bot token format:**
   ```
   8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY
   ```
   Must have `:` separator

2. **Verify chat ID:**
   ```
   -1003262035445
   ```
   Must be negative for channels

3. **Test manually:**
   ```
   https://api.telegram.org/bot8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY/getMe
   ```
   Should return bot info

---

## ✅ Success Checklist

- [ ] Deployed to Railway
- [ ] All 6 environment variables added
- [ ] Domain generated
- [ ] `/health` shows `telegram: connected`
- [ ] `/test-send-message` sends message to channel
- [ ] TradingView webhook URL updated
- [ ] Frontend on Vercel updated with new API URL
- [ ] Test webhook from TradingView works
- [ ] Cornix bot responds to commands

---

## 🚀 Expected Final Result

1. **TradingView sends alert** → ✅
2. **Railway backend receives webhook** → ✅
3. **Backend sends message to Telegram** → ✅
4. **Cornix bot receives command** → ✅
5. **Cornix opens trade on Bybit** → ✅

---

**Time to complete:** 5 minutes  
**Cost:** Free (with $5 monthly credit)  
**Difficulty:** Easy

**Ready to deploy? Go to https://railway.app now!**
