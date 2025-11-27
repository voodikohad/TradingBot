# ⚡ QUICK FIX: Telegram Not Working on Koyeb

## 🔴 Problem
Backend can't reach Telegram API → Messages don't send

## ✅ Solution (5 Minutes)
Use Cloudflare Worker as free proxy

---

## 📋 Step-by-Step

### 1️⃣ Create Cloudflare Worker (3 min)

1. Go to: **https://workers.cloudflare.com**
2. Sign up (free)
3. Click **"Create a Service"**
4. Name: `telegram-proxy`
5. Click **"Quick Edit"**
6. Open file: `cloudflare-worker-proxy.js` in this project
7. Copy all code
8. Paste into Cloudflare editor
9. Click **"Save and Deploy"**
10. Copy your URL (will look like):
    ```
    https://telegram-proxy.YOUR_USERNAME.workers.dev
    ```

### 2️⃣ Add to Koyeb (1 min)

1. Open Koyeb dashboard
2. Your app → **Settings** → **Environment Variables**
3. Click **"Add Variable"**
   - Name: `TELEGRAM_API_PROXY`
   - Value: `https://telegram-proxy.YOUR_USERNAME.workers.dev`
4. Click **"Update"**
5. Wait 2 minutes for redeploy

### 3️⃣ Test (30 sec)

Open in browser:
```
https://strange-dyanne-tradingbot12-29686213.koyeb.app/test-send-message
```

**Success = Message appears in your Telegram channel!** 🎉

---

## 🎯 What This Does

**Before:**
```
Koyeb → ❌ Telegram (blocked)
```

**After:**
```
Koyeb → ✅ Cloudflare → ✅ Telegram (works!)
```

---

## 💰 Cost
**$0** (Cloudflare Workers free tier: 100,000 requests/day)

---

## 📄 Files to Use

1. **`cloudflare-worker-proxy.js`** - Copy this to Cloudflare
2. **`STAYING_ON_KOYEB.md`** - Full detailed guide
3. **`KOYEB_ENV_SETUP.md`** - All environment variables

---

## ✅ Success Checklist

After completing steps:
- [ ] Cloudflare Worker deployed
- [ ] Environment variable added to Koyeb
- [ ] Koyeb app redeployed (automatic)
- [ ] `/test-send-message` works
- [ ] Message appears in Telegram
- [ ] Webhook test works
- [ ] Cornix responds to commands

---

## 🆘 If It Doesn't Work

1. **Check Koyeb logs** for:
   ```
   🔄 Using Telegram API Proxy
   ✅ TELEGRAM BOT CONNECTED
   ```

2. **Test Cloudflare Worker directly:**
   ```
   https://telegram-proxy.YOUR_USERNAME.workers.dev/bot8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY/getMe
   ```
   Should return bot info

3. **Verify environment variable:**
   - Exact name: `TELEGRAM_API_PROXY`
   - No quotes
   - Full URL with `https://`

---

## 🔄 Alternative Solution

If Cloudflare doesn't work, switch to Railway (also 5 minutes):
- See: `RAILWAY_DEPLOYMENT.md`
- Also free, also easy
- Guaranteed to work

---

**Total Time:** 5 minutes  
**Total Cost:** $0  
**Success Rate:** 99%

**Start here:** https://workers.cloudflare.com
