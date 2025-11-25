# ⚡ Quick Reference Guide

## 🚀 Start Here

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
copy .env.example .env

# 3. Edit .env with your credentials
#    - TELEGRAM_BOT_TOKEN: Get from @BotFather
#    - TELEGRAM_CHAT_ID: Get from your Cornix group
#    - WEBHOOK_SECRET: Create a strong random string

# 4. Start the server
npm start

# 5. Test the webhook
npm test
```

---

## 📋 Key Files

| File | Purpose |
|------|---------|
| `index.js` | Express server + webhook endpoint |
| `src/handlers/entryHandler.js` | Entry trade logic |
| `src/services/telegramService.js` | Telegram bot API |
| `src/services/cornixFormatter.js` | JSON → Cornix command |
| `src/utils/validator.js` | Input validation |
| `src/utils/logger.js` | Logging |
| `README.md` | Full documentation |
| `DEPLOYMENT_CHECKLIST.md` | VPS deployment guide |
| `.env.example` | Environment template |

---

## 🔌 API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Send trade signal
curl -X POST http://localhost:3000/webhook \
  -H "X-Webhook-Secret: your_token" \
  -H "Content-Type: application/json" \
  -d '{"action":"entry","side":"long","symbol":"BTCUSDT","size_type":"percent","size":1.0,"tag":"SFP_SL"}'

# Test Telegram
curl -X POST http://localhost:3000/test-telegram \
  -H "X-Webhook-Secret: your_token"
```

---

## 📊 Webhook JSON Format

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

**Required fields:** action, side, symbol, size_type, size  
**Optional fields:** tag

---

## 🎟️ Cornix Output

```
/entry BTCUSDT long 1% #SFP_SL
/entry ETHUSDT short 100USD #SCALP
```

---

## 🧪 Testing Commands

```bash
# Node.js test
npm test

# Single webhook (Linux/Mac)
bash tests/test_webhook.sh

# Single webhook (Windows)
tests\test_webhook.bat

# cURL test
curl -X POST http://localhost:3000/webhook \
  -H "X-Webhook-Secret: test_token" \
  -H "Content-Type: application/json" \
  -d @tests/sample_entry_webhook.json
```

---

## 📱 Telegram Bot Setup

```
1. Chat with @BotFather on Telegram
2. /newbot
3. Give your bot a name and username
4. Copy the token (123456789:ABCDefGHIJKlmnoPQRstuvwxyz...)
5. Paste into TELEGRAM_BOT_TOKEN in .env

To get Chat ID:
1. Add bot to your Cornix group
2. Visit: https://api.telegram.org/bot<TOKEN>/getUpdates
3. Find "chat":{"id":-123456789} (negative number)
4. Paste into TELEGRAM_CHAT_ID in .env
```

---

## 📝 TradingView Alert Setup

In TradingView alert:

**URL:**
```
https://your-vps-ip:3000/webhook?token=YOUR_WEBHOOK_SECRET
```

**Message (JSON):**
```json
{
  "action": "entry",
  "side": "{{strategy.order.direction}}",
  "symbol": "{{ticker}}",
  "size_type": "percent",
  "size": 1,
  "tag": "SFP_SL"
}
```

---

## 🐧 VPS Deployment (5 Minutes)

```bash
# SSH to VPS
ssh root@your.vps.ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Clone project
cd /opt
git clone https://github.com/yourusername/TradingBot.git
cd TradingBot
npm install

# Configure
cp .env.example .env
nano .env  # Edit credentials

# Start
pm2 start index.js --name "trading-bot"
pm2 save
pm2 startup

# Firewall
ufw enable
ufw allow 22 80 443 3000/tcp
```

---

## 📊 Monitor Server

```bash
# Status
pm2 status

# Logs (real-time)
pm2 logs trading-bot

# Stop
pm2 stop trading-bot

# Restart
pm2 restart trading-bot

# Remove
pm2 delete trading-bot
```

---

## 🔍 Troubleshooting

**Bot won't start?**
```bash
npm start  # Check error message
tail -f logs/error_*.log  # Check logs
```

**Webhook not firing?**
```bash
curl http://localhost:3000/health  # Server alive?
npm test  # Does test work?
check firewall  # Port open?
```

**Telegram not receiving?**
```bash
curl http://localhost:3000/test-telegram \
  -H "X-Webhook-Secret: your_token"  # Manual test
curl https://api.telegram.org/botTOKEN/getMe  # Bot valid?
```

**Invalid JSON errors?**
```bash
# Check webhook message format
# Ensure all required fields present
# Check TradingView alert message syntax
```

---

## 📂 Logs Location

```bash
# On local machine
logs/

# On VPS
cd /opt/TradingBot
pm2 logs trading-bot
tail -f logs/info_*.log
```

---

## 🔐 Security Checklist

- ✅ WEBHOOK_SECRET is strong (32+ characters, random)
- ✅ .env file NOT committed to git
- ✅ .env file permissions: `chmod 600 .env`
- ✅ SSH key configured for VPS access
- ✅ Firewall allows only needed ports
- ✅ HTTPS/SSL enabled (production)
- ✅ Regular backups of .env
- ✅ Logs checked for errors

---

## 🚀 Production Checklist

Before going live with real trades:

1. ✅ Local testing complete (npm test)
2. ✅ VPS deployed and tested
3. ✅ Telegram connection verified
4. ✅ TradingView alert template created
5. ✅ Test alert sent and processed
6. ✅ Trade successfully executed via Cornix
7. ✅ PM2 monitoring enabled
8. ✅ SSL certificate installed
9. ✅ Logs backing up
10. ✅ Team trained on troubleshooting

---

## 📞 Need Help?

1. **README.md** - Full documentation (5000+ lines)
2. **PROJECT_SUMMARY.md** - Project overview
3. **DEPLOYMENT_CHECKLIST.md** - Step-by-step VPS setup
4. **tests/testWebhook.js** - Working test examples
5. **Logs** - Check logs/error_*.log for issues

---

## 💾 Backup Commands

```bash
# Backup .env
cp .env .env.backup

# Backup entire project
zip -r TradingBot.zip TradingBot/

# Push to git (without .env)
git add .
git commit -m "Production ready"
git push origin main
```

---

**🎉 You're all set! Start with `npm install && npm start`**

*For more details, see README.md*
