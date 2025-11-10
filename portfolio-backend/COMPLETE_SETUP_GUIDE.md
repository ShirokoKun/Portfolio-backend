# 🎯 Complete Backend Setup & Integration Guide

This guide walks you through setting up a **separate backend system** for your portfolio website, deploying it independently, and connecting it to your frontend.

---

## 📦 What You've Built

```
┌─────────────────────────────────────────────┐
│   Frontend: shirokokun-portfolio.vercel.app │
│   (Next.js Static Site)                     │
└──────────────┬──────────────────────────────┘
               │ HTTP Requests
               │
┌──────────────▼──────────────────────────────┐
│   Backend: portfolio-backend.railway.app    │
│   (Express.js API Server)                   │
│                                              │
│   Routes:                                    │
│   • GET  /api/blog/posts                    │
│   • GET  /api/blog/post/:slug               │
│   • POST /api/contact                       │
│   • GET  /health                            │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
  ┌────▼────┐     ┌────▼──────┐
  │Substack │     │  Google   │
  │   RSS   │     │  Sheets   │
  └─────────┘     └───────────┘
```

---

## 🚀 Quick Start (5 Steps)

### 1️⃣ Install Backend Dependencies

```bash
cd d:\PORTFOLIO\portfolio-backend
npm install
```

### 2️⃣ Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=8080
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,https://shirokokun-portfolio.vercel.app
SUBSTACK_RSS_URL=https://shirokokun.substack.com/feed
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=your-sheet-id
GOOGLE_SHEETS_RANGE=Responses!A:E
CACHE_TTL=1800
```

### 3️⃣ Test Locally

```bash
npm run dev
```

Visit: `http://localhost:8080/health`

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 1.234
}
```

### 4️⃣ Deploy Backend

**Option A: Railway (Recommended)**

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial backend"
   git remote add origin https://github.com/YOUR_USERNAME/portfolio-backend.git
   git push -u origin main
   ```

2. Deploy:
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub
   - Select `portfolio-backend`
   - Add environment variables in Railway dashboard
   - Copy your Railway URL: `https://your-app.up.railway.app`

**Option B: Render**

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Build: `npm install && npm run build`
5. Start: `npm start`
6. Add environment variables
7. Deploy!

### 5️⃣ Connect Frontend

Add to your portfolio website's `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
```

For production (Vercel):
1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add: `NEXT_PUBLIC_API_URL` = `https://your-app.up.railway.app`
4. Redeploy

---

## 📝 Google Sheets Setup (Detailed)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Portfolio Backend"
3. Enable **Google Sheets API**:
   - APIs & Services → Library
   - Search "Google Sheets API"
   - Click Enable

### Step 2: Create Service Account

1. IAM & Admin → Service Accounts
2. Create Service Account
3. Name: `portfolio-backend`
4. Grant role: **Editor**
5. Done
6. Click on created service account
7. Keys tab → Add Key → Create New Key → JSON
8. Download JSON file

### Step 3: Extract Credentials

From downloaded JSON:

```json
{
  "client_email": "xxx@xxx.iam.gserviceaccount.com",  ← Copy this
  "private_key": "-----BEGIN PRIVATE KEY-----\n..."   ← Copy this
}
```

Add to your `.env`:
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Step 4: Create Google Sheet

1. Create new Google Sheet
2. Name: "Portfolio Messages"
3. Add header row (Row 1):
   ```
   | Timestamp | Name | Email | Subject | Message |
   ```
4. Share sheet with service account email
5. Give **Editor** permission
6. Copy Spreadsheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/{THIS_IS_THE_ID}/edit
   ```

Add to `.env`:
```env
GOOGLE_SHEETS_ID=1abc...xyz
GOOGLE_SHEETS_RANGE=Responses!A:E
```

---

## 🔧 Frontend Integration

### Option 1: Use New API Client (Recommended)

The API client is already created at `lib/api-client.ts`. Just import and use it:

```typescript
// In any component
import { apiClient } from '@/lib/api-client';

// Fetch blog posts
const { posts } = await apiClient.getBlogPosts();

// Submit contact form
await apiClient.submitContact(formData);
```

### Option 2: Update Existing Components

You can keep using your existing API routes (`/api/substack`, `/api/contact`) as fallbacks, or completely replace them with the new backend.

**To replace completely:**

1. Delete old API routes:
   ```bash
   rm app/api/substack/route.ts
   rm app/api/contact/route.ts
   ```

2. Components will automatically use the new backend via `NEXT_PUBLIC_API_URL`

---

## 🧪 Testing

### Test Backend Locally

```bash
# Health check
curl http://localhost:8080/health

# Blog posts
curl http://localhost:8080/api/blog/posts

# Single post
curl http://localhost:8080/api/blog/post/your-slug

# Contact form
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Testing the backend API!"
  }'
```

### Test After Deployment

Replace `localhost:8080` with your Railway/Render URL and test again.

### Test Frontend Integration

1. Open your portfolio site
2. Open browser DevTools → Network tab
3. Navigate to blog section
4. Check network requests go to your backend URL
5. Try submitting contact form
6. Verify entry appears in Google Sheets

---

## 🎯 Benefits of This Architecture

### ✅ Separation of Concerns
- Frontend only handles UI
- Backend handles data fetching and business logic

### ✅ Independent Deployment
- Deploy backend and frontend separately
- Update one without touching the other

### ✅ Better Caching
- Server-side caching with configurable TTL
- Reduces external API calls

### ✅ Rate Limiting
- Protect against spam and abuse
- Contact form: 5 submissions/hour per IP
- General API: 100 requests/15min per IP

### ✅ Scalability
- Can scale backend independently
- Add more features without frontend changes

### ✅ Security
- API keys stored only on backend
- CORS protection
- Input validation

---

## 📊 File Structure Reference

```
portfolio-backend/
├── src/
│   ├── index.ts                     # Entry point
│   ├── controllers/                 # Request handlers
│   │   ├── blog.controller.ts       # Blog endpoints logic
│   │   └── contact.controller.ts    # Contact endpoints logic
│   ├── services/                    # Business logic
│   │   ├── substack.service.ts      # RSS parsing & caching
│   │   └── sheets.service.ts        # Google Sheets integration
│   ├── routes/                      # API routes
│   │   ├── blog.routes.ts           # /api/blog/* routes
│   │   └── contact.routes.ts        # /api/contact/* routes
│   └── middlewares/                 # Express middlewares
│       ├── cors.middleware.ts       # CORS configuration
│       ├── error.middleware.ts      # Error handling
│       ├── rate-limit.middleware.ts # Rate limiting
│       ├── logger.middleware.ts     # Request logging
│       └── validation.middleware.ts # Input validation
├── dist/                            # Compiled output (auto-generated)
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── .env                            # Environment variables (gitignored)
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── README.md                        # Main documentation
├── DEPLOYMENT.md                    # Deployment guide
└── FRONTEND_INTEGRATION.md          # Frontend setup guide

portfolio-website/
├── lib/
│   └── api-client.ts               # ← NEW: API client for backend
├── app/
│   ├── api/                        # ← OPTIONAL: Can remove these
│   │   ├── substack/route.ts       #    if fully using backend
│   │   └── contact/route.ts
│   └── ...
└── .env.local                      # ← Add NEXT_PUBLIC_API_URL
```

---

## 🐛 Troubleshooting

### Backend won't start

**Error**: "Cannot find module 'express'"
```bash
npm install
```

**Error**: "Port 8080 already in use"
```bash
# Windows
netstat -ano | findstr :8080
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti :8080 | xargs kill -9
```

### Google Sheets not working

**Error**: "Permission denied"
- Ensure sheet is shared with service account email
- Check service account has **Editor** permission
- Verify Google Sheets API is enabled in Cloud Console

**Error**: "Invalid credentials"
- Check private key is properly escaped in `.env`
- Ensure no extra spaces/newlines
- Use double quotes around the key value

### CORS errors in browser

**Error**: "blocked by CORS policy"
- Add your frontend URL to `ALLOWED_ORIGINS` in backend `.env`
- Remove trailing slashes from URLs
- Restart backend after changing `.env`

### Frontend can't connect to backend

**Error**: "Failed to fetch"
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify backend is running and accessible
- Check backend URL in browser: `https://your-backend.com/health`
- Check browser console for exact error

---

## 🔄 Update Workflow

### Making changes to backend:

```bash
# 1. Make changes locally
cd portfolio-backend

# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin main

# 4. Railway/Render auto-deploys!
```

### Making changes to frontend:

```bash
# 1. Make changes locally
cd portfolio-website

# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "feat: update UI"
git push origin main

# 4. Vercel auto-deploys!
```

---

## 📈 Monitoring & Logs

### Railway
- Dashboard → Your Project → Deployments
- Click on deployment → View Logs
- Real-time log streaming

### Render
- Dashboard → Your Service
- Logs tab
- Download logs option

### Vercel (Frontend)
- Dashboard → Your Project → Deployments
- Functions tab (for serverless functions)

---

## 🎉 Next Steps

Now that your backend is set up:

1. ✅ Test all endpoints locally
2. ✅ Deploy to Railway/Render
3. ✅ Update frontend environment variables
4. ✅ Test live integration
5. ✅ Monitor logs for errors
6. ✅ Add more features as needed!

### Possible Enhancements

- **Email notifications**: Add Resend/SendGrid for email alerts
- **Analytics**: Track API usage
- **Admin dashboard**: View contact submissions
- **Blog search**: Add search functionality
- **Comments**: Integrate Giscus or similar
- **Newsletter**: Substack newsletter signup
- **Authentication**: Add admin routes with auth

---

## 📞 Need Help?

1. Check logs in Railway/Render dashboard
2. Verify all environment variables are set
3. Test endpoints with curl/Postman
4. Check browser console for frontend errors
5. Review CORS configuration

---

## 📄 Files Overview

| File | Purpose |
|------|---------|
| `README.md` | Main documentation |
| `DEPLOYMENT.md` | Deployment guide |
| `FRONTEND_INTEGRATION.md` | Frontend setup |
| **`THIS_FILE.md`** | **Complete setup guide** |
| `.env.example` | Environment template |
| `package.json` | Dependencies |
| `tsconfig.json` | TypeScript config |

---

**Your backend is production-ready and deployed! 🚀**
