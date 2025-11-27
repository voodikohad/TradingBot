# ================================================================
# KOYEB DEPLOYMENT SCRIPT
# Quick deployment of Telegram fixes to Koyeb
# ================================================================

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "🚀 KOYEB DEPLOYMENT - TELEGRAM FIX" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# Step 1: Test locally first
Write-Host "📋 Step 1: Running Local Tests..." -ForegroundColor Yellow
node test-telegram-fix.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Local tests failed! Fix issues before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Local tests passed!`n" -ForegroundColor Green

# Step 2: Git status
Write-Host "📋 Step 2: Checking Git Status..." -ForegroundColor Yellow
git status

Write-Host "`n"
$continue = Read-Host "Continue with deployment? (y/n)"

if ($continue -ne 'y') {
    Write-Host "❌ Deployment cancelled." -ForegroundColor Red
    exit 0
}

# Step 3: Commit changes
Write-Host "`n📋 Step 3: Committing Changes..." -ForegroundColor Yellow
git add .
git commit -m "Fix Telegram API connectivity for Koyeb - Permanent solution"

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Nothing to commit or commit failed" -ForegroundColor Yellow
}

# Step 4: Push to GitHub
Write-Host "`n📋 Step 4: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Git push failed! Check your credentials." -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Code pushed to GitHub!`n" -ForegroundColor Green

# Step 5: Display environment variables for Koyeb
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "📋 KOYEB ENVIRONMENT VARIABLES" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

Write-Host "Copy these to Koyeb Dashboard → Environment:" -ForegroundColor Yellow
Write-Host ""
Write-Host "PORT=3000"
Write-Host "NODE_ENV=production"
Write-Host "WEBHOOK_SECRET=mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb"
Write-Host "TELEGRAM_BOT_TOKEN=8552083574:AAHHw1CwEMlWMlZ-6_mDps9NN_IrS0Df1ZY"
Write-Host "TELEGRAM_CHAT_ID=-1003262035445"
Write-Host "LOG_LEVEL=info"
Write-Host ""

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "============================================================`n" -ForegroundColor Cyan

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to Koyeb Dashboard" -ForegroundColor White
Write-Host "2. Verify environment variables are set correctly" -ForegroundColor White
Write-Host "3. Trigger redeploy or wait for auto-deploy" -ForegroundColor White
Write-Host "4. Check logs for: 'Telegram bot connection successful'" -ForegroundColor White
Write-Host "5. Test webhook: https://your-app.koyeb.app/test-send-message" -ForegroundColor White
Write-Host ""

Write-Host "📊 Monitor deployment at: https://app.koyeb.com" -ForegroundColor Cyan
Write-Host ""
