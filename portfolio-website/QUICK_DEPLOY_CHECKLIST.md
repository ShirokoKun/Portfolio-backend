# Quick Deployment Checklist

## Before Uploading to GitHub

- [ ] All artwork images are in `/public/images/artwork/` folder
- [ ] Test locally: Run `npm run build` - should complete without errors
- [ ] Test locally: Run `npm start` - website should work
- [ ] Check that all images load correctly in the artwork gallery
- [ ] Verify `.gitignore` doesn't exclude your artwork folder
- [ ] Remove any sensitive data from code (API keys, passwords)

## GitHub Upload Steps

1. **Initialize Git** (if not done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to github.com → New repository
   - Name: `portfolio-website`
   - Don't initialize with README

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git
   git branch -M main
   git push -u origin main
   ```

## Vercel Deployment Steps

1. **Sign up**: vercel.com → Continue with GitHub
2. **Import Project**: Add New → Project → Select your repo
3. **Deploy**: Click Deploy (settings auto-detected)
4. **Done!**: Your site is live at `your-project.vercel.app`

## After Deployment

- [ ] Test the live website
- [ ] Check artwork gallery loads correctly
- [ ] Test contact form submission
- [ ] Verify all links work
- [ ] Check mobile responsiveness

## File Size Check

Your artwork folder: ~50MB total
- ✅ Under GitHub's 100MB per file limit
- ✅ Under GitHub's 1GB repository limit
- ✅ Safe to upload!

## Need to Update?

After making changes:
```bash
git add .
git commit -m "Description of changes"
git push origin main
```
Vercel will automatically redeploy! 🚀

