# Quick Deployment Commands

## Backend - Railway

### Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to project (if already created on web)
railway link

# Deploy
railway up

# Add environment variables
railway variables set PORT=3000
railway variables set WEBHOOK_SECRET=your_secret
railway variables set TELEGRAM_BOT_TOKEN=your_token
railway variables set TELEGRAM_CHAT_ID=your_chat_id
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://your-frontend.vercel.app
```

---

## Frontend - Vercel

### Deploy to Vercel
```bash
# Navigate to UI folder
cd ui

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Set environment variable
vercel env add VITE_API_URL production
# Enter: https://your-backend.up.railway.app
```

---

## Environment Variables Reference

### Backend (.env)
```env
PORT=3000
WEBHOOK_SECRET=mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb
TELEGRAM_BOT_TOKEN=7504720694:AAFb8USheEMlClyJpjzwfl6ecbvBb-pk_X0
TELEGRAM_CHAT_ID=-4972867982
NODE_ENV=production
LOG_LEVEL=info
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (ui/.env.production)
```env
VITE_API_URL=https://your-backend.up.railway.app
```

---

## URLs to Update After Deployment

1. **After Railway deployment:**
   - Get backend URL: `https://your-app.up.railway.app`
   - Update in `ui/.env.production` → `VITE_API_URL`

2. **After Vercel deployment:**
   - Get frontend URL: `https://your-frontend.vercel.app`
   - Update in Railway environment variables → `FRONTEND_URL`

3. **In TradingView:**
   - Update webhook URL: `https://your-app.up.railway.app/webhook`
