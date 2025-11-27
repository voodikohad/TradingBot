# 🔍 KOYEB DEBUG INSTRUCTIONS

## Quick Diagnosis Steps

### Step 1: Check Environment Variables on Koyeb

**Visit this URL in your browser:**
```
https://strange-dyanne-tradingbot12-29686213.koyeb.app/debug/env
```

**Expected Output:**
```json
{
  "environment": "production",
  "variables": {
    "TELEGRAM_BOT_TOKEN": {
      "present": true,
      "hasColon": true,
      "botId": "8552083574",
      "format": "valid"
    },
    "TELEGRAM_CHAT_ID": {
      "present": true,
      "value": "-1003262035445"
    }
  },
  "telegram": {
    "connected": true
  }
}
```

**If you see `"present": false` or `"connected": false`:**
→ Environment variables are NOT set correctly in Koyeb!

---

### Step 2: Fix Environment Variables in Koyeb

1. Go to: https://app.koyeb.com
2. Click on your app
3. Go to **Settings** → **Environment**
4. Click **Edit**
5. **Delete ALL existing variables**
6. **Add these NEW variables ONE BY ONE:**

```
Name: PORT
Value: 3000

Name: NODE_ENV  
Value: production

Name: WEBHOOK_SECRET
Value: mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb

Name: TELEGRAM_BOT_TOKEN
Value: 8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY

Name: TELEGRAM_CHAT_ID
Value: -1003262035445

Name: LOG_LEVEL
Value: info
```

7. Click **Save**
8. **Wait 1-2 minutes** for Koyeb to redeploy

---

### Step 3: Test Again

**After redeployment, check debug endpoint again:**
```
https://strange-dyanne-tradingbot12-29686213.koyeb.app/debug/env
```

Should show all variables as `"present": true`

---

### Step 4: Test Telegram Connection

**Visit:**
```
https://strange-dyanne-tradingbot12-29686213.koyeb.app/test-telegram-connection
```

**Expected:**
```json
{
  "success": true,
  "telegram": "connected"
}
```

---

### Step 5: Send Test Message

**Visit:**
```
https://strange-dyanne-tradingbot12-29686213.koyeb.app/test-send-message
```

**Expected:**
- ✅ Message appears in Telegram channel
- ✅ Response: `"success": true`

---

### Step 6: Test Webhook with Postman

**Use the CORRECT format in Postman:**

**Method:** POST

**URL:**
```
https://strange-dyanne-tradingbot12-29686213.koyeb.app/webhook
```

**Headers:**
```
Content-Type: application/json
X-Webhook-Secret: mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb
```

**Body (JSON):**
```json
{
  "action": "entry",
  "side": "long",
  "symbol": "BTCUSDT",
  "size_type": "percent",
  "size": 1.0,
  "tag": "POSTMAN_TEST"
}
```

**Expected Response:**
```json
{
  "success": true,
  "action": "entry",
  "symbol": "BTCUSDT",
  "cornixCommand": "long BTCUSDT\nentry=market\nsize=1%",
  "message": "Trade signal executed successfully"
}
```

**Expected in Telegram:**
- ✅ Cornix command message appears
- ✅ Cornix bot executes the trade

---

## 🚨 Common Issues

### Issue: Environment variables showing as "present": false

**Cause:** Koyeb environment variables not set or set incorrectly

**Fix:**
1. Go to Koyeb Dashboard → Settings → Environment
2. Delete all existing variables
3. Add new variables ONE BY ONE (copy-paste exactly)
4. NO quotes around values
5. NO extra spaces
6. Save and wait for redeploy

---

### Issue: "telegram": "disconnected"

**Cause:** Bot token is wrong or not loaded

**Fix:**
1. Check `/debug/env` - verify `TELEGRAM_BOT_TOKEN` format
2. Should have `"hasColon": true` and `"format": "valid"`
3. If not, fix in Koyeb environment variables
4. Token must be: `8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY`

---

### Issue: 404 Not Found from Telegram API

**Cause:** API URL format is wrong

**Check Koyeb logs for:**
```
url: "https://api.telegram.org/bot***/sendMessage"
```

Should be EXACTLY:
```
https://api.telegram.org/bot8552083574:AAHHw1C.../sendMessage
```

If missing `/bot` or wrong format, environment variables are corrupted.

---

### Issue: Postman returns 401 Unauthorized

**Cause:** Webhook secret header is missing or wrong

**Fix:**
- Don't use `?token=...` in URL
- Use header: `X-Webhook-Secret: mkhxw...`
- Exact value from environment variables

---

### Issue: Postman webhook works but Telegram doesn't send

**Cause:** Environment variables issue on Koyeb

**Fix:**
1. Check `/debug/env`
2. Verify all variables present
3. Check Koyeb logs for exact error
4. Look for `"responseBody"` in error logs

---

## 📊 What to Look for in Koyeb Logs

**Good logs (working):**
```
✅ Telegram Service initialized
✅ Telegram bot connection successful
   Bot: voodikohad_bot
✉️ Telegram message sent successfully
   Message ID: 123
```

**Bad logs (not working):**
```
❌ WEBHOOK ERROR
❌ Entry handler error
❌ Failed to send Telegram message after all retries
   status: 404
   data: {"ok":false,"error_code":404}
```

If you see 404:
- API URL is wrong
- Environment variables not loaded correctly

If you see "MISSING" in debug endpoint:
- Environment variables not set in Koyeb

---

## ✅ Final Verification

Once everything is working, you should see:

1. ✅ `/debug/env` shows all variables present
2. ✅ `/health` shows telegram connected
3. ✅ `/test-send-message` sends to Telegram
4. ✅ Postman webhook sends to Telegram
5. ✅ Cornix executes trades
6. ✅ No errors in Koyeb logs

**If all these pass → System is fully operational! 🚀**

---

## 🆘 Still Not Working?

**Send me these:**

1. **Screenshot of `/debug/env` response**
2. **Screenshot of Koyeb environment variables page**
3. **Copy of Koyeb logs** (last 50 lines)
4. **Postman screenshot** (showing headers and body)

This will help diagnose the exact issue!
