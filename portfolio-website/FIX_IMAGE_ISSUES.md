# Fix Image Loading Issues

## ✅ Changes Made

### 1. Replaced Next.js Image with Regular img Tags
**Why:** Next.js Image component with static export can have issues. Regular img tags work better for static sites.

**Files Updated:**
- `components/ArtworkGallery.tsx` - Replaced Image with img tags
- `components/Bio.tsx` - Replaced Image with img tags  
- `components/Work.tsx` - Replaced Image with img tags

### 2. Fixed Image Container Structure
- Added proper wrapper divs for images
- Maintained aspect ratios using Tailwind classes
- Added proper error handling with fallbacks

### 3. Fixed MetadataBase Warning
- Added `metadataBase` to `app/layout.tsx` to fix Open Graph image warnings

## 📋 Image Paths

All images should be in `public/images/`:
- ✅ `public/images/artwork/` - Artwork gallery images (17 files)
- ✅ `public/images/projects/` - Project images
- ✅ `public/images/categories/` - Category images
- ✅ `public/images/placeholder.jpg` - Fallback image

## 🔍 Troubleshooting

### If images still don't show:

1. **Check file paths:**
   - Images must be in `public/images/` directory
   - Paths in code should start with `/images/` (not `/public/images/`)

2. **Check file names:**
   - Some files have special characters: `New Project 49 [6070DF3].png`
   - Make sure filenames match exactly (case-sensitive)

3. **Check browser console:**
   - Open DevTools → Network tab
   - Look for 404 errors on image requests
   - Check if paths are correct

4. **For Vercel:**
   - Make sure all image files are committed to Git
   - Check Vercel build logs for any errors
   - Verify `public/` folder is included in deployment

## 🚀 Next Steps

1. **Test locally:**
   ```bash
   npm run build
   npm start
   ```
   Check if images load correctly.

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Fix: Replace Next.js Image with img tags for static export"
   git push origin main
   ```

3. **Verify on Vercel:**
   - Check if images load after deployment
   - Check browser console for any errors

## ✅ Expected Behavior

- Images should load from `/images/artwork/` paths
- If local images fail, should fallback to Google Drive URLs
- Profile photo should load from Google Drive
- All images should have proper error handling

