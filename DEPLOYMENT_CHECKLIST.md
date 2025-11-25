# 🚀 Deployment Checklist

Complete this checklist before deploying to production VPS.

## Pre-Deployment Setup

- [ ] Node.js v18+ installed locally
- [ ] npm dependencies installed: `npm install`
- [ ] `.env.example` reviewed
- [ ] `.env` file created with test values
- [ ] All files have been created (verify with: `npm start`)

## Local Testing

- [ ] Server starts without errors: `npm start`
- [ ] Health check works: `curl http://localhost:3000/health`
- [ ] Test webhook runs: `npm test`
- [ ] All tests pass (npm test output shows success)
- [ ] Logs are being created in `/logs` directory
- [ ] No sensitive data in logs

## Telegram Setup

- [ ] BotFather bot created
- [ ] Bot token obtained and saved
- [ ] Cornix bot created (if needed)
- [ ] Telegram group/channel created
- [ ] Both bots added to group as admin
- [ ] Chat ID obtained correctly
- [ ] Test message can be sent: `curl -X POST http://localhost:3000/test-telegram -H "X-Webhook-Secret: $WEBHOOK_SECRET"`
- [ ] Message received in Telegram group

## Security Verification

- [ ] WEBHOOK_SECRET is strong and secure
- [ ] WEBHOOK_SECRET is at least 32 characters
- [ ] .env file is NOT committed to git
- [ ] .gitignore includes .env
- [ ] No hardcoded secrets in code
- [ ] All input validation tested
- [ ] Token validation tested with wrong token
- [ ] Invalid JSON rejected properly

## TradingView Alert Template

- [ ] TradingView alert template saved
- [ ] Alert webhook URL updated
- [ ] Alert token included correctly
- [ ] Alert message format verified
- [ ] Test alert sent from TradingView

## VPS Preparation

- [ ] VPS access verified (SSH working)
- [ ] VPS OS is Ubuntu/Debian Linux
- [ ] VPS has at least 512MB RAM
- [ ] VPS has internet access
- [ ] Port 3000 (or custom PORT) is available
- [ ] Firewall allows inbound on webhook port
- [ ] Outbound to api.telegram.org allowed

## VPS Deployment

- [ ] SSH into VPS
- [ ] System updated: `sudo apt update && sudo apt upgrade -y`
- [ ] Node.js installed: `node --version` shows v18+
- [ ] npm installed: `npm --version` works
- [ ] PM2 installed globally: `pm2 --version` works
- [ ] PM2 startup configured: `pm2 startup` and `pm2 save` run
- [ ] Project cloned/downloaded to VPS
- [ ] cd to project directory
- [ ] `npm install` completed successfully
- [ ] `.env` file created with production values
- [ ] `.env` file is NOT world-readable: `chmod 600 .env`
- [ ] Server started with PM2: `pm2 start index.js --name "trading-bot"`
- [ ] PM2 save: `pm2 save`

## Post-Deployment Testing

- [ ] Health check works: `curl https://vps-ip:3000/health`
- [ ] Firewall allows access from TradingView IP ranges
- [ ] PM2 status shows "online": `pm2 status`
- [ ] Logs are being written: `pm2 logs trading-bot`
- [ ] Test webhook sent from local machine
- [ ] Telegram message received in group
- [ ] Cornix bot received the command
- [ ] No errors in logs

## Monitoring Setup

- [ ] PM2 startup enabled: `pm2 startup` configured
- [ ] PM2 autorestart on crash enabled
- [ ] PM2 save executed: `pm2 save`
- [ ] Log rotation configured (PM2 handles this)
- [ ] Check logs regularly: `pm2 logs trading-bot`
- [ ] Monitor available: `pm2 monitor` or web dashboard

## SSL/HTTPS Setup (Recommended)

- [ ] Domain name ready
- [ ] DNS pointing to VPS IP
- [ ] Certbot installed: `apt install certbot`
- [ ] SSL certificate obtained: `certbot certonly --standalone -d yourdomain.com`
- [ ] Certificate auto-renewal configured
- [ ] Reverse proxy (Nginx) configured to use HTTPS
- [ ] Webhook URL updated to HTTPS

## Documentation

- [ ] README.md reviewed
- [ ] Deployment commands documented
- [ ] VPS IP/Domain documented (securely)
- [ ] Recovery procedures documented
- [ ] Team access setup documented

## Backup & Recovery

- [ ] `.env` file backed up securely
- [ ] Project backed up to git repository
- [ ] Logs backed up regularly
- [ ] Recovery procedure tested

## First TradingView Alert

- [ ] TradingView alert template applied to strategy
- [ ] Alert webhook URL points to VPS
- [ ] Alert message contains JSON template
- [ ] First test alert sent
- [ ] Telegram message received
- [ ] Cornix bot executed the command
- [ ] Trade visible in Cornix/Exchange
- [ ] Server logs show successful processing
- [ ] No error messages

## Production Checklist

- [ ] PM2 monitoring active
- [ ] Logs being collected
- [ ] All systems operational
- [ ] Performance acceptable (check: `top` on VPS)
- [ ] Memory usage reasonable
- [ ] CPU usage reasonable
- [ ] Network bandwidth reasonable
- [ ] No errors in logs over last hour
- [ ] Telegram connectivity stable
- [ ] Cornix receiving commands

## Ongoing Maintenance

- [ ] Check logs daily
- [ ] Monitor PM2 status: `pm2 status`
- [ ] Verify recent trades processed
- [ ] Check for any error patterns
- [ ] Keep Node.js updated
- [ ] Keep dependencies updated: `npm update`
- [ ] SSL certificate renewal before expiry
- [ ] Review security logs

## Rollback Plan

If something goes wrong:

```bash
# Stop the bot
pm2 stop trading-bot

# Check logs for errors
pm2 logs trading-bot

# Fix .env or code
nano .env

# Restart
pm2 restart trading-bot

# If critical:
pm2 delete trading-bot
git pull  # Get latest
npm install
pm2 start index.js --name "trading-bot"
pm2 save
```

## Emergency Contacts

Document these (securely):
- [ ] VPS Provider Support
- [ ] Telegram @BotFather (get new bot if needed)
- [ ] Cornix Support
- [ ] System Administrator

---

## ✅ Deployment Sign-Off

- **Deployed By:** ___________________
- **Date:** ___________________
- **VPS IP/Domain:** ___________________
- **Node.js Version:** ___________________
- **All Checks Passed:** ☐ YES ☐ NO
- **Issues Found:** ___________________
- **Notes:** ___________________

---

**Last Updated:** January 2024
