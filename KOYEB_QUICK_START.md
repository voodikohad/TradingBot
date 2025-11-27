# 🚀 KOYEB DEPLOYMENT - QUICK START GUIDE

## ⚡ Fast Track to Working Telegram Bot

**Time to complete: 5 minutes**

---

## 📋 Pre-Deployment Checklist

Before you start, make sure you have:
- [ ] Koyeb account with active app
- [ ] GitHub repository connected to Koyeb
- [ ] Access to Koyeb environment variables

---

## 🎯 Step-by-Step Deployment

### Step 1: Set Koyeb Environment Variables (2 minutes)

1. Go to: https://app.koyeb.com
2. Click on your app: `strange-dyanne-tradingbot12-29686213`
3. Click **Settings** → **Environment Variables**
4. Click **Edit**
5. **Delete all existing variables**
6. **Add these NEW variables** (copy-paste exactly):

```
PORT
3000

NODE_ENV
production

WEBHOOK_SECRET
mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb

TELEGRAM_BOT_TOKEN
8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY

TELEGRAM_CHAT_ID
-1003262035445

LOG_LEVEL
info
```

7. Click **Save**

**IMPORTANT:** 
- ❌ No quotes around values
- ❌ No extra spaces
- ✅ Exact copy-paste from above

---

### Step 2: Deploy Code to GitHub (1 minute)

**Windows PowerShell:**
```powershell
cd d:\TradingBot
.\deploy-to-koyeb.ps1
```

**Or manually:**
```bash
git add .
git commit -m "Fix Telegram connectivity for Koyeb"
git push origin main
```

---

### Step 3: Wait for Koyeb Auto-Deploy (1-2 minutes)

1. Go to Koyeb Dashboard
2. Watch the deployment progress
3. Wait for **"Healthy"** status

---

### Step 4: Verify Deployment (1 minute)

**Test with your browser:**

1. **Health Check:**
   ```
   https://strange-dyanne-tradingbot12-29686213.koyeb.app/health
   ```
   Should show: `"telegram": "connected"`

2. **Send Test Message:**
   ```
   https://strange-dyanne-tradingbot12-29686213.koyeb.app/test-send-message
   ```
   Should send message to your Telegram channel!

**Or use the verification script:**
```bash
node verify-koyeb-deployment.js https://strange-dyanne-tradingbot12-29686213.koyeb.app
```

---

### Step 5: Test TradingView Webhook (1 minute)

1. Open Postman, Insomnia, or use curl:

```bash
curl -X POST https://strange-dyanne-tradingbot12-29686213.koyeb.app/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb" \
  -d "{\"action\":\"entry\",\"side\":\"long\",\"symbol\":\"BTCUSDT\",\"size_type\":\"percent\",\"size\":1.0,\"tag\":\"FINAL_TEST\"}"
```

2. **Check your Telegram channel** - you should see:
   - ✅ Cornix command message
   - ✅ Trade details (BTCUSDT, LONG, 1%)
   - ✅ Cornix bot executes the trade

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] Koyeb shows "Healthy" status
- [ ] `/health` returns `"telegram": "connected"`
- [ ] `/test-send-message` sends to Telegram
- [ ] Webhook test sends trade signal
- [ ] Cornix executes test trade
- [ ] No errors in Koyeb logs

---

## 🔍 Check Koyeb Logs

Go to: Koyeb Dashboard → Your App → **Logs**

**Look for these SUCCESS messages:**
```
✅ Telegram Service initialized
✅ Telegram bot connection successful
   Bot: voodikohad_bot
✉️ Telegram message sent successfully
```

**If you see these ERROR messages:**
```
❌ 404 Not Found - API endpoint wrong
❌ 401 Unauthorized - Token wrong
❌ ENOTFOUND - DNS issue
❌ Missing environment variables
```

→ Double-check Step 1 (Environment Variables)

---

## 🆘 Troubleshooting

### Issue: "Telegram not connected"

**Solution:**
1. Check Koyeb environment variables (no quotes, no spaces)
2. Verify bot token includes the `:` character
3. Verify chat ID includes the `-` sign
4. Redeploy after fixing

### Issue: "404 Not Found"

**Solution:**
1. API URL is wrong
2. Check `telegramService.js` line 32-35
3. Should be: `https://api.telegram.org/bot<token>/sendMessage`

### Issue: "Webhook returns 401"

**Solution:**
1. Webhook secret is wrong
2. Check header: `X-Webhook-Secret`
3. Value must match `WEBHOOK_SECRET` in Koyeb

### Issue: "Message sent but Cornix doesn't execute"

**Solution:**
1. Verify Cornix bot is in the Telegram channel
2. Verify Cornix bot has admin rights
3. Test manual Cornix command in Telegram
4. Check Cornix command format matches docs

---

## 📞 Quick Test Commands

**Test bot manually (browser or terminal):**
```
https://api.telegram.org/bot8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY/getMe
```

**Should return:**
```json
{
  "ok": true,
  "result": {
    "id": 8552083574,
    "username": "voodikohad_bot"
  }
}
```

---

## 🎉 Done!

If all steps passed:
- ✅ Your bot is live on Koyeb
- ✅ Telegram is working
- ✅ Webhooks are processing
- ✅ Cornix is executing trades

**Now configure TradingView alerts:**

1. Go to TradingView chart
2. Create alert
3. Set webhook URL:
   ```
   https://strange-dyanne-tradingbot12-29686213.koyeb.app/webhook
   ```
4. Set webhook message (JSON):
   ```json
   {
     "action": "{{strategy.order.action}}",
     "side": "{{strategy.market_position}}",
     "symbol": "{{ticker}}",
     "size_type": "percent",
     "size": 1.0,
     "tag": "{{strategy.order.comment}}"
   }
   ```
5. Click **Create**

**Your automated trading system is now live! 🚀**

---

## 📚 Additional Resources

- **Full Documentation:** `KOYEB_TELEGRAM_FIX_PERMANENT.md`
- **Complete Summary:** `TELEGRAM_FIX_SUMMARY.md`
- **Test Script:** `test-telegram-fix.js`
- **Deployment Script:** `deploy-to-koyeb.ps1`
- **Verification Script:** `verify-koyeb-deployment.js`

---

**Need help?** Check the logs, run the test scripts, and follow the troubleshooting guide above.

**Everything is fixed and ready to go! 🎯**
