# Deployment Guide: Portfolio Website to GitHub & Vercel

This guide will walk you through uploading your portfolio to GitHub and deploying it live on Vercel.

## 📋 Prerequisites

- GitHub account (free)
- Vercel account (free)
- Git installed on your computer
- Node.js and npm/yarn installed

---

## 🚀 Step 1: Prepare Your Project for GitHub

### 1.1 Check Your `.gitignore` File

Make sure your `.gitignore` includes:
```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build
/dist

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# IDE
.vscode/
.idea/
*.swp
*.swo
```

**✅ DO COMMIT:**
- `/public/images/artwork/` folder (your artwork images)
- All source code files
- Configuration files (`package.json`, `next.config.js`, etc.)

**❌ DON'T COMMIT:**
- `node_modules/` folder
- `.env.local` file (if it contains secrets)
- Build artifacts

### 1.2 Optimize Large Images (Optional but Recommended)

Some of your artwork files are quite large (10-16MB). Consider compressing them:

**Option A: Use Online Tools**
- [TinyPNG](https://tinypng.com/) - Compress PNG/JPG files
- [Squoosh](https://squoosh.app/) - Advanced compression

**Option B: Use Command Line (if you have ImageMagick)**
```bash
# Compress PNG files
magick convert "input.png" -quality 85 -strip "output.png"
```

**Recommended sizes:**
- Main display images: Max 2MB each
- Thumbnails: Max 200KB each

---

## 📤 Step 2: Upload to GitHub

### 2.1 Initialize Git Repository (if not already done)

```bash
# Navigate to your project directory
cd d:\PORTFOLIO\portfolio-website

# Initialize git (if not already initialized)
git init

# Check current status
git status
```

### 2.2 Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `portfolio-website` (or your preferred name)
4. Description: "My personal portfolio website"
5. Choose: **Public** (or Private if you prefer)
6. **DO NOT** initialize with README, .gitignore, or license (you already have these)
7. Click **"Create repository"**

### 2.3 Connect and Push to GitHub

```bash
# Add all files to git
git add .

# Create your first commit
git commit -m "Initial commit: Portfolio website with artwork gallery"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If you get authentication errors:**
- Use GitHub Personal Access Token instead of password
- Or use GitHub Desktop app (easier for beginners)

### 2.4 Verify Upload

1. Go to your GitHub repository page
2. Check that all files are uploaded:
   - ✅ `components/` folder
   - ✅ `app/` folder
   - ✅ `public/images/artwork/` folder with all images
   - ✅ `package.json`
   - ✅ `next.config.js`

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easiest option)
4. Authorize Vercel to access your GitHub

### 3.2 Import Your Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your `portfolio-website` repository
3. Click **"Import"**

### 3.3 Configure Project Settings

Vercel will auto-detect Next.js, but verify these settings:

**Framework Preset:** Next.js  
**Root Directory:** `./` (default)  
**Build Command:** `npm run build` (auto-detected)  
**Output Directory:** `.next` (auto-detected)  
**Install Command:** `npm install` (auto-detected)

**Environment Variables (if needed):**
- If you have any `.env.local` variables, add them here
- For Google Forms: No environment variables needed

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your site will be live at: `https://your-project-name.vercel.app`

### 3.5 Custom Domain (Optional)

1. In Vercel project settings → **"Domains"**
2. Add your custom domain (e.g., `swastikgupta.com`)
3. Follow DNS configuration instructions

---

## 🔄 Step 4: Continuous Deployment

### Automatic Updates

Once connected, every time you push to GitHub:
1. Vercel automatically detects the change
2. Builds your project
3. Deploys the new version
4. Your site updates automatically!

**Workflow:**
```bash
# Make changes to your code
# ... edit files ...

# Commit changes
git add .
git commit -m "Updated artwork gallery"

# Push to GitHub
git push origin main

# Vercel automatically deploys! 🚀
```

---

## 📝 Step 5: What to Upload to GitHub

### ✅ Upload These:

```
portfolio-website/
├── app/                    ✅ All Next.js app files
├── components/             ✅ All React components
├── constants/              ✅ Configuration files
├── public/
│   ├── images/
│   │   ├── artwork/        ✅ YOUR ARTWORK IMAGES (all of them)
│   │   ├── categories/     ✅ Category images
│   │   ├── photography/   ✅ Photography images
│   │   └── projects/       ✅ Project images
│   └── ...                 ✅ Other public assets
├── .gitignore              ✅ Git ignore rules
├── next.config.js          ✅ Next.js config
├── package.json            ✅ Dependencies
├── tailwind.config.ts      ✅ Tailwind config
├── tsconfig.json           ✅ TypeScript config
└── README.md               ✅ Project documentation
```

### ❌ Don't Upload:

```
node_modules/               ❌ (auto-ignored by .gitignore)
.next/                      ❌ (build folder)
.env.local                  ❌ (local environment variables)
.vercel/                    ❌ (Vercel cache)
```

---

## 🎯 Quick Checklist

Before deploying, make sure:

- [ ] All artwork images are in `/public/images/artwork/`
- [ ] `.gitignore` is properly configured
- [ ] No sensitive data in code (API keys, passwords)
- [ ] `package.json` has correct dependencies
- [ ] `next.config.js` is configured for static export
- [ ] Test locally: `npm run build` works without errors
- [ ] All images load correctly locally

---

## 🐛 Troubleshooting

### Build Fails on Vercel

1. **Check build logs** in Vercel dashboard
2. **Common issues:**
   - Missing dependencies → Check `package.json`
   - TypeScript errors → Fix type errors
   - Image path issues → Verify image paths are correct

### Images Not Loading

1. **Check image paths** - must start with `/images/...`
2. **Verify files are in `public/` folder**
3. **Check file names** - case-sensitive on Linux servers

### Google Forms Not Working

1. **Verify form ID** in `components/Contact.tsx`
2. **Check entry IDs** - may need to update them
3. **Test form submission** after deployment

---

## 📊 Repository Size Considerations

Your artwork folder is ~50MB total. GitHub allows:
- **Free accounts:** 100MB per file, 1GB per repository
- **Your files:** All under limits ✅

**If repository gets too large:**
- Use Git LFS (Large File Storage) for images
- Or compress images further

---

## 🎉 You're Done!

Once deployed, your portfolio will be:
- ✅ Live on the internet
- ✅ Automatically updated on every push
- ✅ Fast and optimized by Vercel
- ✅ Accessible worldwide

**Your live URL:** `https://your-project-name.vercel.app`

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Docs:** https://docs.github.com

Happy deploying! 🚀

