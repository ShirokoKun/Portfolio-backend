# 🎯 Quick Deployment Guide

This guide will help you deploy your backend in under 10 minutes!

## 🚀 Railway (Easiest - Recommended)

### Step 1: Push to GitHub
```bash
cd portfolio-backend
git init
git add .
git commit -m "Initial backend setup"
git remote add origin https://github.com/YOUR_USERNAME/portfolio-backend.git
git push -u origin main
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app/)
2. Sign up with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select `portfolio-backend` repository
5. Railway will automatically detect Node.js and deploy!

### Step 3: Add Environment Variables
1. Click on your project
2. Go to **Variables** tab
3. Add all variables from your `.env` file:
   ```
   ALLOWED_ORIGINS=https://shirokokun-portfolio.vercel.app
   SUBSTACK_RSS_URL=https://shirokokun.substack.com/feed
   GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=xxx
   GOOGLE_SHEETS_ID=xxx
   CACHE_TTL=1800
   ```

### Step 4: Get Your URL
1. Go to **Settings** → **Domains**
2. Railway provides: `your-app.up.railway.app`
3. Copy this URL - you'll need it for frontend!

---

## 🎨 Connect Frontend

Once backend is deployed, update your frontend:

### 1. Add Backend URL to Frontend `.env`

Create `.env.local` in your portfolio website:

```env
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
```

### 2. Update Vercel Environment Variables

1. Go to [vercel.com](https://vercel.com/) dashboard
2. Select your portfolio project
3. Go to **Settings** → **Environment Variables**
4. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
   ```
5. Redeploy your frontend

### 3. Test Connection

```bash
# Test blog API
curl https://your-app.up.railway.app/api/blog/posts

# Test health
curl https://your-app.up.railway.app/health
```

---

## ⚡ Alternative: Render

1. Go to [render.com](https://render.com/)
2. **New** → **Web Service**
3. Connect GitHub repo
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables
6. Deploy!

---

## 🔄 Update Workflow

### When you make changes:

```bash
# 1. Make your changes
# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "Update: description"
git push origin main

# 4. Railway/Render auto-deploys!
```

---

## ✅ Verify Deployment

Once deployed, test all endpoints:

```bash
# Replace YOUR_URL with your Railway/Render URL

# 1. Health check
curl https://YOUR_URL/health

# 2. Blog posts
curl https://YOUR_URL/api/blog/posts

# 3. Single post
curl https://YOUR_URL/api/blog/post/your-slug

# 4. Contact form
curl -X POST https://YOUR_URL/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Testing backend deployment!"
  }'
```

---

## 🐛 Common Issues

### "Cannot find module"
```bash
npm install
npm run build
```

### "Port already in use"
Change `PORT` in environment variables

### "CORS error"
Add your frontend URL to `ALLOWED_ORIGINS`

### "Google Sheets error"
- Verify service account email/key
- Check sheet is shared with service account
- Ensure Google Sheets API is enabled

---

## 🎉 You're Done!

Your backend is now live and ready to handle:
- ✅ Blog posts from Substack
- ✅ Contact form submissions to Google Sheets
- ✅ Automatic caching
- ✅ Rate limiting
- ✅ CORS protection

Next steps:
1. Update frontend to use new backend URL
2. Test contact form on live site
3. Monitor logs in Railway/Render dashboard
