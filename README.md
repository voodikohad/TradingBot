# TradingView → Telegram → Cornix Auto-Trade Integration Bot

## 📌 Overview

This is a **production-ready Node.js backend service** that:

1. **Receives TradingView webhook alerts** (JSON format)
2. **Validates and parses** alerts securely
3. **Converts alerts** into Cornix-compatible commands
4. **Sends commands via Telegram** so Cornix automatically opens trades
5. **Logs all transactions** for auditing and debugging

## 🎯 Key Features

✅ **Secure Webhook Endpoint** - Token-based validation  
✅ **Modular Architecture** - Easy to extend with SL/TP handlers  
✅ **Input Validation** - Sanitize and validate all inputs  
✅ **Telegram Integration** - Direct bot messaging to Cornix group  
✅ **Comprehensive Logging** - Track all trades and errors  
✅ **Production-Ready** - Best practices, error handling, graceful shutdown  
✅ **VPS Deployment Ready** - PM2 setup guides included  

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm** (comes with Node.js)
- **Telegram Bot Token** (from BotFather)
- **Cornix Telegram Group/Channel ID**
- **TradingView Premium Account** (for webhooks)

### 1. Clone or Download the Project

```bash
cd TradingBot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
PORT=3000
WEBHOOK_SECRET=your_super_secure_random_token_here
TELEGRAM_BOT_TOKEN=123456789:ABCDefGHIJKlmnoPQRstuvwxyz1234567
TELEGRAM_CHAT_ID=-1001234567890
NODE_ENV=production
LOG_LEVEL=info
```

### 4. Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

You should see:
```
🚀 SERVER STARTED
  port: 3000
  environment: production
  webhook: http://localhost:3000/webhook
  health: http://localhost:3000/health
```

---

## 📋 Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `WEBHOOK_SECRET` | Security token for webhook validation | Any secure random string |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot API token from BotFather | `123456789:ABCDefGHIJKlmnoPQRstuvwxyz...` |
| `TELEGRAM_CHAT_ID` | Cornix group/channel ID | `-1001234567890` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `LOG_LEVEL` | Logging verbosity (debug, info, warn, error) | `info` |

---

## 🔌 API Endpoints

### 1. Health Check
```
GET /health
```

Verifies server and Telegram bot connectivity.

**Response:**
```json
{
  "status": "healthy",
  "telegram": "connected",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### 2. Main Webhook
```
POST /webhook
Headers:
  X-Webhook-Secret: your_webhook_token
  Content-Type: application/json

Body:
{
  "action": "entry",
  "side": "long",
  "symbol": "BTCUSDT",
  "size_type": "percent",
  "size": 1.0,
  "tag": "SFP_SL"
}
```

**Response:**
```json
{
  "success": true,
  "action": "entry",
  "symbol": "BTCUSDT",
  "cornixCommand": "/entry BTCUSDT long 1% #SFP_SL",
  "message": "Trade signal executed successfully",
  "processingTime": "245ms",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### 3. Test Telegram Connection
```
POST /test-telegram
Headers:
  X-Webhook-Secret: your_webhook_token
```

Sends a test message to verify Telegram connectivity.

---

## 📊 Webhook JSON Format

### Entry Signal Example

**Percent-based sizing:**
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

**USD-based sizing:**
```json
{
  "action": "entry",
  "side": "short",
  "symbol": "ETHUSDT",
  "size_type": "usd",
  "size": 100,
  "tag": "SCALP"
}
```

### Field Definitions

| Field | Type | Values | Required | Description |
|-------|------|--------|----------|-------------|
| `action` | string | `entry`, `sl`, `tp`, `exit` | ✅ Yes | Trade action type |
| `side` | string | `long`, `short` | ✅ Yes | Trade direction |
| `symbol` | string | Any valid pair (e.g., `BTCUSDT`) | ✅ Yes | Trading pair |
| `size_type` | string | `percent`, `usd` | ✅ Yes | Position sizing type |
| `size` | number | Any positive number | ✅ Yes | Position size value |
| `tag` | string | Any alphanumeric string | ❌ No | Custom trade tag/label |

---

## 🎟️ Cornix Command Format

The bot converts TradingView alerts into Cornix commands:

### Entry Command
```
/entry SYMBOL SIDE SIZE_WITH_UNIT [TAG]
```

Examples:
```
/entry BTCUSDT long 1% #SFP_SL
/entry ETHUSDT short 100USD #SCALP
/entry BNBUSDT long 5%
```

### Rules

- **Percent sizing:** Add `%` after the number → `1.0%`
- **USD sizing:** Add `USD` after the number → `100USD`
- **Tags:** Convert to `#TAG_NAME` format
- **Symbol:** Always uppercase
- **Side:** Always lowercase

---

## 📱 TradingView Alert Template

Use this exact template in TradingView alerts to send JSON to your webhook:

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

### How to Create a TradingView Alert

1. Open your strategy in TradingView
2. Click **Alert** (bell icon)
3. Create new alert with your strategy
4. In **Notifications** section:
   - Enable **Webhook URL**
   - Set URL to: `https://your-vps-ip:3000/webhook?token=YOUR_WEBHOOK_SECRET`
   - In **Message** field, paste the JSON template above
5. Enable and save

**Example webhook URL:**
```
https://example.com:3000/webhook?token=abc123def456
```

Or with header validation:
```
https://example.com:3000/webhook
```
(and include header: `X-Webhook-Secret: abc123def456`)

---

## 🧪 Testing

### Test 1: Using Node.js Script

```bash
npm test
```

This runs `tests/testWebhook.js` which sends sample webhooks.

### Test 2: Using cURL (Linux/Mac)

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your_webhook_secret" \
  -d '{
    "action": "entry",
    "side": "long",
    "symbol": "BTCUSDT",
    "size_type": "percent",
    "size": 1.0,
    "tag": "SFP_SL"
  }'
```

### Test 3: Using PowerShell (Windows)

```powershell
$body = @{
    action = "entry"
    side = "long"
    symbol = "BTCUSDT"
    size_type = "percent"
    size = 1.0
    tag = "SFP_SL"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/webhook" `
  -Method POST `
  -Headers @{"X-Webhook-Secret"="your_webhook_secret"} `
  -Body $body `
  -ContentType "application/json"
```

### Test 4: Batch Testing Script

**Linux/Mac:**
```bash
bash tests/test_webhook.sh
```

**Windows:**
```cmd
tests\test_webhook.bat
```

---

## 🔐 How to Get Telegram Bot Token & Chat ID

### Get Bot Token

1. Open Telegram and search for **@BotFather**
2. Send `/start`
3. Send `/newbot`
4. Follow the prompts to name your bot
5. BotFather will give you a token like: `123456789:ABCDefGHIJKlmnoPQRstuvwxyz1234567`
6. Copy and paste into `.env`

### Get Chat ID

**For a Telegram Group:**

1. Add the bot to your group
2. Send a message in the group
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":-123456789...}` (negative number)
5. Use that number as `TELEGRAM_CHAT_ID`

**For a Private Channel:**

1. Make the bot an admin in the channel
2. Send a test message
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find the chat ID (will be negative)

---

## 🔗 Cornix Connection

### Prerequisites

1. **Cornix Bot** should be in your Telegram group/channel
2. **Your trading API keys** configured in Cornix
3. **Group/Channel ID** added to `.env`

### How It Works

1. Your bot sends `/entry SYMBOL SIDE SIZE TAG` to the group
2. Cornix bot automatically receives the command
3. Cornix opens the trade using your configured API keys
4. Trade executes without manual intervention

### Troubleshooting

If trades aren't executing:
- ✅ Verify Cornix bot is in the group
- ✅ Verify Cornix has your API keys configured
- ✅ Run `/test-telegram` endpoint to confirm messaging works
- ✅ Check logs for error messages
- ✅ Verify the chat ID is correct (negative number for groups)

---

## 🏗️ Project Structure

```
TradingBot/
├── index.js                 # Main Express server
├── package.json             # Dependencies
├── .env.example             # Environment template
├── README.md                # This file
│
├── src/
│   ├── handlers/
│   │   ├── entryHandler.js  # Entry signal logic
│   │   ├── slHandler.js     # Stop-loss handler (v2+)
│   │   └── tpHandler.js     # Take-profit handler (v2+)
│   │
│   ├── services/
│   │   ├── cornixFormatter.js   # Converts JSON to Cornix commands
│   │   └── telegramService.js   # Telegram Bot API wrapper
│   │
│   └── utils/
│       ├── env.js           # Environment config manager
│       ├── validator.js     # Input validation & sanitization
│       └── logger.js        # Logging service
│
├── tests/
│   ├── testWebhook.js           # Node.js test script
│   ├── test_webhook.sh          # Bash test script
│   ├── test_webhook.bat         # Windows test script
│   ├── sample_entry_webhook.json     # Example JSON
│   ├── sample_entry_usd_webhook.json # Example JSON
│   └── sample_cornix_output.txt      # Expected output
│
└── logs/
    ├── debug_YYYY-MM-DD.log     # Debug logs
    ├── info_YYYY-MM-DD.log      # Info logs
    ├── warn_YYYY-MM-DD.log      # Warning logs
    └── error_YYYY-MM-DD.log     # Error logs
```

---

## 📝 Logging

All events are logged to `/logs` directory:

**Log Levels:** `debug` → `info` → `warn` → `error`

**Example Log Output:**
```
[2024-01-15T10:30:45.123Z] [INFO] ✅ Webhook validated successfully | {"symbol":"BTCUSDT","action":"entry"}
[2024-01-15T10:30:46.456Z] [INFO] ✉️ Telegram message sent successfully | {"messageId":123,"chatId":-123456789}
[2024-01-15T10:30:46.789Z] [INFO] ✅ TRADE EXECUTED | {"action":"entry","symbol":"BTCUSDT"...}
```

**View Logs:**
```bash
# Recent logs
tail -f logs/info_*.log

# All error logs
cat logs/error_*.log
```

---

## 🐧 Linux VPS Deployment Guide

### Step 1: Connect to VPS

```bash
ssh root@your.vps.ip.address
```

### Step 2: Update System

```bash
apt update && apt upgrade -y
```

### Step 3: Install Node.js

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 4: Install PM2 (Process Manager)

```bash
npm install -g pm2

# Enable startup
pm2 startup
pm2 save
```

### Step 5: Clone Project

```bash
cd /opt
git clone https://github.com/yourusername/TradingBot.git
cd TradingBot
npm install
```

### Step 6: Configure Environment

```bash
cp .env.example .env
nano .env  # Edit with your credentials
```

### Step 7: Start with PM2

```bash
pm2 start index.js --name "trading-bot"
pm2 save
pm2 startup
```

**Useful PM2 Commands:**
```bash
pm2 status              # Check status
pm2 logs trading-bot    # View logs
pm2 restart trading-bot # Restart
pm2 stop trading-bot    # Stop
pm2 delete trading-bot  # Remove
```

### Step 8: Configure Firewall

```bash
# Enable UFW (Ubuntu Firewall)
ufw enable

# Allow SSH, HTTP, HTTPS, and your webhook port
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp  # Your webhook port

# Verify rules
ufw status
```

### Step 9: Setup SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
apt install -y certbot

# Get free SSL certificate
certbot certonly --standalone -d yourdomain.com

# Auto-renew
certbot renew --dry-run
```

### Step 10: Setup Reverse Proxy with Nginx (Optional)

```bash
apt install -y nginx

# Create config
nano /etc/nginx/sites-available/trading-bot
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:
```bash
ln -s /etc/nginx/sites-available/trading-bot /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🔄 Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Restart with PM2
pm2 restart trading-bot
```

---

## 🛠️ Troubleshooting

### Bot Not Receiving Messages

1. **Check Token:**
   ```bash
   curl https://api.telegram.org/botYOUR_TOKEN/getMe
   ```

2. **Verify Chat ID:**
   ```bash
   curl https://api.telegram.org/botYOUR_TOKEN/getUpdates
   ```

3. **Check Logs:**
   ```bash
   tail -f logs/error_*.log
   ```

### Webhook Not Firing

- Verify webhook URL is accessible: `curl https://yourdomain.com:3000/health`
- Check firewall rules: `ufw status`
- Verify TradingView alert webhook URL is correct
- Test with cURL: See **Testing** section

### High Latency

- Check server CPU/Memory: `top`
- Check network: `ping -c 5 8.8.8.8`
- Check Telegram API response times in logs

---

## 🚀 Future Enhancements (v2+)

- ✅ **Stop-Loss Handler** - Automated SL placement
- ✅ **Take-Profit Handler** - Automated TP placement
- ✅ **Position Exit Handler** - Close trades
- ✅ **Risk Management** - Position sizing based on account
- ✅ **Trade History** - Database persistence
- ✅ **Dashboard** - Web UI for monitoring
- ✅ **Multiple Exchanges** - Binance, Bybit, etc.

---

## 📄 License

MIT License - Feel free to use and modify

---

## ❓ Support

For issues or questions:
1. Check logs in `/logs` directory
2. Run health check: `curl http://localhost:3000/health`
3. Test webhook: `npm test`
4. Review README sections above

---

**Happy Trading! 🚀📈**

*Last Updated: January 2024*
