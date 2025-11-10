# ⚠️ IMPORTANT: Railway Configuration

## 🎯 Correct Railway Setup

### **OPTION 1: Deploy Backend Only (RECOMMENDED)**

This is the cleanest approach - deploy only the backend to Railway.

#### Railway Dashboard Settings:
```
Root Directory: portfolio-backend
Build Command: npm install && npm run build
Start Command: npm start
```

✅ **Why this works:**
- Railway looks inside `portfolio-backend/` folder
- Finds `package.json` with TypeScript in dependencies
- Runs `npm install` there (installs TypeScript)
- Runs `npm run build` (finds `tsc` command)
- Success! ✨

---

### **OPTION 2: Monorepo Deployment (If needed)**

If you MUST deploy from root:

#### Railway Dashboard Settings:
```
Root Directory: (leave empty or set to "/")
Build Command: cd portfolio-backend && npm install && npm run build
Start Command: cd portfolio-backend && npm start
```

✅ **Why this works:**
- Changes into backend directory
- Runs install there (gets TypeScript)
- Builds and starts from there

---

## 🚀 Quick Fix RIGHT NOW

### Step 1: In Railway Dashboard

1. Click your service
2. Go to **Settings** tab
3. Scroll to **Deploy** section
4. Find **Root Directory** field
5. Set it to: `portfolio-backend`
6. Click **Save**

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click **⋮** (three dots) on latest deployment
3. Click **Redeploy**

**That's it!** Railway will now:
```
✓ cd portfolio-backend/
✓ npm install (installs TypeScript)
✓ npm run build (tsc works!)
✓ npm start
✓ Server running! 🎉
```

---

## 📋 Environment Variables Needed

Add these in Railway Dashboard → Variables:

```
NODE_ENV=production
PORT=8080
ALLOWED_ORIGINS=https://your-vercel-url.vercel.app

# Google Sheets
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
SPREADSHEET_ID=your_sheet_id
SHEET_NAME=Responses

# Email
EMAIL_USER=your.email@gmail.com
EMAIL_APP_PASSWORD=your_app_password
EMAIL_TO=recipient@example.com

# Spotify (get refresh token after deployment)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=https://your-railway-url.railway.app/api/spotify/callback
```

---

## ✅ Verify Setup

After setting Root Directory to `portfolio-backend`, your build logs should show:

```
Building...
→ cd portfolio-backend
→ npm install
  ✓ Installing dependencies...
  ✓ typescript@5.3.3
  ✓ @types/node@20.10.5
  
→ npm run build
  ✓ tsc
  ✓ Creating dist/ folder
  ✓ Build successful!

→ npm start
  ✓ Server running on port 8080
  ✓ Deployment successful! 🎉
```

---

## 🐛 Still Getting "tsc: not found"?

Double-check:

1. **Root Directory is set to:** `portfolio-backend`
2. **In `portfolio-backend/package.json`:**
   ```json
   "dependencies": {
     "typescript": "^5.3.3",
     "@types/node": "^20.10.5",
     ...
   }
   ```

3. **If TypeScript is in devDependencies, move it:**
   ```bash
   cd portfolio-backend
   npm install --save typescript @types/node @types/express @types/cors
   npm uninstall --save-dev typescript @types/node @types/express @types/cors
   ```

---

## 🎯 Summary

**The Issue:**
- Railway was building from root
- Root doesn't have TypeScript
- Backend has TypeScript

**The Fix:**
- Tell Railway to use `portfolio-backend` as Root Directory
- OR update build commands to `cd` into backend first

**Recommended:**
- Set Root Directory to `portfolio-backend` in Railway settings
- This is the cleanest and most reliable approach

---

**After applying this fix, your backend will deploy successfully!** 🚀
