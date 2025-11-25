# 🚀 Deployment Guide

Complete guide to deploy your TradingBot backend to Railway and frontend to Vercel.

---

## 📦 Backend Deployment to Railway

### Step 1: Prepare Your Project

Your backend is now ready with:
- ✅ `railway.json` - Railway configuration
- ✅ `Procfile` - Process configuration
- ✅ `.dockerignore` - Optimized build

### Step 2: Deploy to Railway

1. **Sign up/Login to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository (or "Deploy from local")
   
3. **Configure Environment Variables**
   Click on your service → Variables → Add these variables:
   ```
   PORT=3000
   WEBHOOK_SECRET=mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb
   TELEGRAM_BOT_TOKEN=7504720694:AAFb8USheEMlClyJpjzwfl6ecbvBb-pk_X0
   TELEGRAM_CHAT_ID=-4972867982
   NODE_ENV=production
   LOG_LEVEL=info
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
   
   ⚠️ **Important**: You'll update `FRONTEND_URL` after deploying the frontend

4. **Deploy**
   - Railway will automatically detect Node.js
   - Build and deployment will start automatically
   - Wait for deployment to complete

5. **Get Your Backend URL**
   - Click on your service → Settings → Domains
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://your-app.up.railway.app`)
   - **Save this URL** - you'll need it for frontend deployment

### Step 3: Verify Backend Deployment

Test your backend:
```bash
curl https://your-app.up.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2025-11-25T..."
}
```

---

## 🎨 Frontend Deployment to Vercel

### Step 1: Update Environment Variables

1. **Update `.env.production`**
   - Open `ui/.env.production`
   - Replace with your Railway backend URL:
   ```
   VITE_API_URL=https://your-app.up.railway.app
   ```

2. **Commit the change**
   ```bash
   git add ui/.env.production
   git commit -m "Update production API URL"
   ```

### Step 2: Deploy to Vercel

**Option A: Deploy via Vercel CLI (Recommended)**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to UI folder**
   ```bash
   cd ui
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? (Choose your account)
   - Link to existing project? **N**
   - What's your project's name? **tradingbot-ui**
   - In which directory is your code located? **.**
   - Want to override settings? **N**

**Option B: Deploy via Vercel Dashboard**

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your repository
   - **Root Directory**: Set to `ui`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Configure Environment Variables**
   - Add environment variable:
     - Key: `VITE_API_URL`
     - Value: `https://your-app.up.railway.app` (your Railway URL)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### Step 3: Get Your Frontend URL

After deployment completes:
- Copy your Vercel URL (e.g., `https://tradingbot-ui.vercel.app`)

### Step 4: Update Backend CORS

1. **Go back to Railway**
   - Open your backend service
   - Go to Variables
   - Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://tradingbot-ui.vercel.app
   ```

2. **Redeploy Backend** (Railway will auto-redeploy)

---

## ✅ Verification Checklist

### Backend (Railway)
- [ ] Backend is deployed and running
- [ ] Health endpoint responds: `https://your-app.up.railway.app/health`
- [ ] Webhook endpoint is accessible: `https://your-app.up.railway.app/webhook`
- [ ] Environment variables are set correctly
- [ ] Telegram bot credentials are working

### Frontend (Vercel)
- [ ] Frontend is deployed and accessible
- [ ] Login page loads correctly
- [ ] Dashboard displays properly
- [ ] API connection works (check browser console for errors)
- [ ] No CORS errors in browser console

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Deployment fails
- Check Railway logs: Service → Deployments → Click on deployment → View Logs
- Verify all environment variables are set
- Ensure `package.json` has correct start script

**Problem**: Webhook not receiving data
- Verify webhook URL in TradingView: `https://your-app.up.railway.app/webhook`
- Check webhook secret matches in both places
- View Railway logs for incoming requests

**Problem**: Telegram messages not sending
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Verify `TELEGRAM_CHAT_ID` is correct
- Check Railway logs for Telegram API errors

### Frontend Issues

**Problem**: Can't connect to backend
- Verify `VITE_API_URL` is set correctly in Vercel environment variables
- Check browser console for CORS errors
- Ensure backend `FRONTEND_URL` is set to your Vercel URL
- Verify backend is running on Railway

**Problem**: Build fails on Vercel
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure root directory is set to `ui`

**Problem**: 404 errors on page refresh
- `vercel.json` should handle this with rewrites (already configured)
- Redeploy if needed

---

## 📝 Post-Deployment Tasks

1. **Update TradingView Alert Webhook URL**
   - In TradingView, edit your alerts
   - Set Webhook URL to: `https://your-app.up.railway.app/webhook`
   - Add webhook secret in the notification settings

2. **Test End-to-End**
   - Send a test webhook from TradingView
   - Verify it appears in Railway logs
   - Check Telegram for the Cornix message
   - Verify it appears in your frontend UI

3. **Monitor Logs**
   - Railway: Service → Deployments → View Logs
   - Vercel: Project → Deployments → View Function Logs

4. **Set Up Custom Domains (Optional)**
   - Railway: Service → Settings → Domains → Add custom domain
   - Vercel: Project → Settings → Domains → Add custom domain

---

## 🔄 Updating Your Deployment

### Backend Updates
1. Push changes to GitHub
2. Railway auto-deploys from your main branch
3. Or manually redeploy in Railway dashboard

### Frontend Updates
1. Push changes to GitHub
2. Vercel auto-deploys from your main branch
3. Or run `vercel --prod` from `ui` folder

---

## 🔐 Security Recommendations

1. **Never commit sensitive data**
   - `.env` files are gitignored
   - Use environment variables in Railway/Vercel

2. **Rotate secrets regularly**
   - Update webhook secret periodically
   - Store backups securely

3. **Enable 2FA**
   - Enable on Railway account
   - Enable on Vercel account
   - Enable on GitHub account

4. **Monitor logs**
   - Check Railway logs for suspicious activity
   - Set up log monitoring/alerts if needed

---

## 📞 Support

If you encounter issues:

1. **Check logs first**
   - Railway: Service → Logs
   - Vercel: Project → Logs
   - Browser: Developer Console

2. **Common fixes**
   - Redeploy both services
   - Verify all environment variables
   - Check CORS configuration
   - Clear browser cache

3. **Documentation**
   - [Railway Docs](https://docs.railway.app)
   - [Vercel Docs](https://vercel.com/docs)

---

## 🎉 Success!

Once everything is deployed and verified:
- ✅ Backend running on Railway
- ✅ Frontend running on Vercel
- ✅ Webhook receiving TradingView alerts
- ✅ Telegram bot sending Cornix commands
- ✅ UI displaying signals and stats

Your complete trading bot system is now live! 🚀
