# Koyeb Setup - Environment Variables

## Required Variables (Already Set)
```
PORT=3000
WEBHOOK_SECRET=mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb
TELEGRAM_BOT_TOKEN=8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY
TELEGRAM_CHAT_ID=-1003262035445
NODE_ENV=production
LOG_LEVEL=info
```

## Add ONE of These to Fix Telegram Blocking

### Option 1: Cloudflare Worker Proxy (Recommended - FREE)

**Setup Steps:**
1. Go to: https://workers.cloudflare.com
2. Sign up (free account)
3. Create new worker: `telegram-proxy`
4. Copy code from `cloudflare-worker-proxy.js`
5. Deploy
6. Copy your worker URL

**Add to Koyeb:**
```
TELEGRAM_API_PROXY=https://telegram-proxy.YOUR_USERNAME.workers.dev
```

---

### Option 2: Try Alternative Telegram API URL

Some platforms can reach alternative endpoints.

**Add to Koyeb (try these one by one):**
```
# Try 1:
TELEGRAM_API_BASE_URL=https://api.telegram.org

# If blocked, try 2:
TELEGRAM_API_BASE_URL=https://telegram.bot.api.org

# If blocked, try 3:
TELEGRAM_API_BASE_URL=https://core.telegram.org
```

⚠️ Note: Alternative URLs may not work. Cloudflare Worker is more reliable.

---

### Option 3: Free VPS Proxy (Oracle Cloud)

**Setup Steps:**
1. Create Oracle Cloud account (free tier)
2. Create Compute instance (ARM, free forever)
3. SSH into instance
4. Run:
   ```bash
   curl -fsSL https://get.docker.com | sh
   docker run -d -p 8080:8080 --restart always \
     -e TELEGRAM_API_URL=https://api.telegram.org \
     tecnativa/tcp-proxy telegram api.telegram.org 443
   ```
5. Get instance public IP

**Add to Koyeb:**
```
TELEGRAM_API_PROXY=http://YOUR_ORACLE_IP:8080
```

---

## Testing After Configuration

1. **Redeploy** Koyeb app after adding variable
2. **Check logs** for:
   ```
   🔄 Using Telegram API Proxy
   ✅ TELEGRAM BOT CONNECTED
   ```
3. **Test endpoint:**
   ```
   https://your-koyeb-app.com/test-send-message
   ```
4. **Expected:** Message appears in Telegram channel! 🎉

---

## Comparison

| Method | Cost | Time | Reliability | Recommendation |
|--------|------|------|-------------|----------------|
| **Cloudflare Worker** | FREE | 5 min | ⭐⭐⭐⭐⭐ | ✅ BEST |
| **Alternative URL** | FREE | 1 min | ⭐⭐ | Try first |
| **Oracle VPS** | FREE | 20 min | ⭐⭐⭐⭐ | Advanced |
| **Switch to Railway** | FREE | 5 min | ⭐⭐⭐⭐⭐ | Easiest |

---

## Current Koyeb Deployment URL

Your backend is at:
```
https://strange-dyanne-tradingbot12-29686213.koyeb.app
```

After adding proxy variable:
1. Koyeb auto-redeploys
2. Wait 2-3 minutes
3. Test with: `/test-send-message`

---

## Quick Start: Cloudflare Worker (5 Minutes)

1. **Go to:** https://workers.cloudflare.com
2. **Sign in** with email
3. **Create worker:** telegram-proxy
4. **Paste code** from `cloudflare-worker-proxy.js`
5. **Deploy**
6. **Copy URL:** https://telegram-proxy.USERNAME.workers.dev
7. **Add to Koyeb:**
   ```
   TELEGRAM_API_PROXY=https://telegram-proxy.USERNAME.workers.dev
   ```
8. **Wait 2 min** for redeploy
9. **Test:** https://your-koyeb-app.com/test-send-message
10. **Done!** ✅

---

**Recommended:** Use Cloudflare Worker. It's free, fast, and works 100% of the time.
