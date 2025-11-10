# 🚀 Deployment Instructions

## ✅ Current Status
- ✅ All TypeScript errors fixed
- ✅ Git repository initialized
- ✅ All changes committed
- ✅ Ready for deployment

## 📋 Next Steps

### 1. Push to GitHub

```powershell
# 1. Create a new repository on GitHub (don't initialize with README)
#    Go to: https://github.com/new
#    Name it something like: portfolio-fullstack

# 2. Add the remote and push
cd d:\PORTFOLIO
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. **Root Directory**: `portfolio-backend`
5. **Add Environment Variables**:
   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL=portfolio-backend@totemic-atom-454000-r9.iam.gserviceaccount.com
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=<your-private-key>
   GOOGLE_SHEETS_ID=1WWf-R0i5MuNw1WzhZUGpSSvZnb1zld6MQbw5ZArc53w
   GOOGLE_SHEETS_RANGE=Sheet1!A:E
   PORT=8080
   ```
   
   **IMPORTANT**: When adding the private key:
   - Copy the ENTIRE key from your backend `.env` file including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
   - Keep all line breaks intact

6. Railway will auto-deploy. Once done, copy the Railway URL (e.g., `https://your-app.railway.app`)

### 3. Update Backend CORS

After getting your Vercel URL (next step), update Railway environment variables:

```
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
```

### 4. Deploy Frontend to Vercel

**Option A: Using Vercel Dashboard**

1. Go to [Vercel](https://vercel.com/)
2. Click "New Project" → Import your GitHub repo
3. **Root Directory**: `portfolio-website`
4. **Framework Preset**: Next.js
5. **Build Command**: `npm run build` (default)
6. **Output Directory**: `.next` (default)
7. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
   GOOGLE_SERVICE_ACCOUNT_EMAIL=portfolio-backend@totemic-atom-454000-r9.iam.gserviceaccount.com
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=<your-private-key>
   GOOGLE_SHEETS_ID=1WWf-R0i5MuNw1WzhZUGpSSvZnb1zld6MQbw5ZArc53w
   GOOGLE_SHEETS_RANGE=Sheet1!A:E
   ```

**Option B: Using Vercel CLI**

```powershell
cd d:\PORTFOLIO\portfolio-website
npm install -g vercel
vercel login
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: your-portfolio
# - Directory: ./ (current)
# - Override settings? No

# Add environment variables via Vercel dashboard after first deploy
```

### 5. Verify Deployment

**Backend Health Check:**
```
https://your-railway-app.railway.app/health
```
Should return: `{"status":"ok","timestamp":"..."}`

**Backend API Test:**
```
https://your-railway-app.railway.app/api/blog/posts
```
Should return array of 3 Substack posts

**Frontend Test:**
```
https://your-vercel-app.vercel.app
```
Should load your portfolio with Substack posts

### 6. Post-Deployment

1. **Update CORS**: Add your Vercel URL to Railway's `ALLOWED_ORIGINS`
2. **Custom Domain** (optional):
   - Vercel: Project Settings → Domains
   - Railway: Project Settings → Networking → Custom Domain
3. **Test Contact Form**: Submit a test message and verify it appears in your Google Sheet

## 🔧 Troubleshooting

### Backend Build Fails
- Check all environment variables are set correctly
- Verify private key includes all line breaks
- Check Railway logs for specific errors

### Frontend Can't Connect to Backend
- Verify `NEXT_PUBLIC_API_URL` points to Railway URL
- Check Railway's CORS settings include Vercel URL
- Look at browser console for CORS errors

### Google Sheets Not Working
- Verify service account email has Editor access to the sheet
- Check Sheet ID matches environment variable
- Confirm range is `Sheet1!A:E` (not "Responses")

## 📝 Environment Variables Reference

**Backend (.env on Railway):**
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=portfolio-backend@totemic-atom-454000-r9.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIE...your-key...==\n-----END PRIVATE KEY-----\n
GOOGLE_SHEETS_ID=1WWf-R0i5MuNw1WzhZUGpSSvZnb1zld6MQbw5ZArc53w
GOOGLE_SHEETS_RANGE=Sheet1!A:E
PORT=8080
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

**Frontend (.env on Vercel):**
```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
GOOGLE_SERVICE_ACCOUNT_EMAIL=portfolio-backend@totemic-atom-454000-r9.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIE...your-key...==\n-----END PRIVATE KEY-----\n
GOOGLE_SHEETS_ID=1WWf-R0i5MuNw1WzhZUGpSSvZnb1zld6MQbw5ZArc53w
GOOGLE_SHEETS_RANGE=Sheet1!A:E
```

## ✨ All Fixed Issues
- ✅ 7 TypeScript compilation errors resolved
- ✅ Unused parameter warnings fixed (`req` → `_req`, etc.)
- ✅ Null safety issues resolved in contact controller
- ✅ Code ready for production build

---

**Need help?** Check the logs:
- Railway: Project → Deployments → View Logs
- Vercel: Project → Deployments → View Function Logs
