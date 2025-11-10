# 🚀 DEPLOYMENT GUIDE - LET'S GO LIVE!

## 📋 PRE-DEPLOYMENT CHECKLIST

✅ Code committed and pushed to GitHub
✅ Email notifications working locally
✅ Contact form working locally
✅ Blog RSS feed working (backend)

---

## 🚂 STEP 1: Deploy Backend to Railway

### 1.1 Login to Railway
```bash
# If you haven't installed Railway CLI:
npm install -g @railway/cli

# Login
railway login
```

### 1.2 Create New Project
```bash
cd d:\PORTFOLIO\portfolio-backend
railway init
```
- Choose: "Empty Project"
- Name: `portfolio-backend`

### 1.3 Add Environment Variables

Go to Railway Dashboard → Your Project → Variables

Add these:
```bash
# Server
NODE_ENV=production
PORT=8080

# CORS (will update after Vercel deploy)
ALLOWED_ORIGINS=https://shirokokun-portfolio-live.vercel.app

# Substack
SUBSTACK_RSS_URL=https://shirokokun.substack.com/feed

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=portfolio-backend@totemic-atom-454000-r9.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQClFK90qYPZ3hsY\nOrRGAxHvw8UThCI6PH05WrEDaRE8QpY/NXvATgSc5ZSEdTPVSHgCW401YKRfd0Po\naDsPKXW+v8xl83hv5ygSRzO8WiYS6/F1fCkNBRcLCcLPDMjT0+q+VKo5FpLmMYcE\nwo7MmOaMccF/538fTV7LN8fz56Xx1wNjNf9YY3SWyuWIwUcnACbKFjuecYCuj5qg\nygO0W6Tx7mLzYvTmEh7ZM6ym6t05MVVAkNBoK/gCjTBNlyanWQYGDWsmMjtbbOp9\nXJyGJK1vdyjhcW/9aTnU24NBSBDHiW+hjPGT3Ed94K5k4abGnKhVMVp/i8sDPT42\nKsqHGG5nAgMBAAECggEARuh8NyHLO22eeMlafwo5jaIrSGdE5nvuFBFDIKJkX1yA\nuhTom6FHdPdeVIkdYxtWRTj7Djb9U+5gUndXCvu1kmJDU3WBwZtqiHNiIyEb4pvL\nYzoaTffmPn0KWzJ0Hx0TY37tgUkTf2I9y0sg2HxC54fDZIPVBGaQ9bx3nGpfyuFt\nVSm/qkLbvSDuH/IWYsc20a3vWKnVV2jsKafziQpRl6VBre/D6jkzNZwRsInhLrcv\nAKgdNPvElbirzC0IL3sGn9lbYeZnaFFdwtlwbJDLTtKGv8urFqvlSayLboPXRKuq\nKSyLEWfgBu8vfUJ54UIHOBwffq56lsPvxamz+PnO/QKBgQDmf8wZDfZE1YDM2HjD\nE+lJMVWVGBj1xNGaOYFRnmdDsuBhh4Exme6v41JWCqbfP9ALBtcm5Lwzfx+WvzYS\nrI7ETEwItLYhGI7t7EHKe+1BstqIBa14SMxi9yZyU7je4S8+60AxZVUHGSTB6smi\nyospqKwQzVmr/Il7qoVIUOu0YwKBgQC3WBtaFrtJHkYY6sYXdRN1gzYNse+rvE0+\npFSvL1LWeiKWOXJ7MifnW3wVUI6/Qt6jq7ZvXsUYhg3QE3GfCkL0oe8UZX3kLDmm\nC3U2TQvP1By3Y/Gqd5/BGoCGU3yZhoxBEIYarlFBtGsJvemW7EldJvofLdCj8Qfw\nIM5gMH4zLQKBgQDICMJsP+SoKg1kOLzctyvufCUEhewrZcptKFilJ24An30AxuME\n080D0ajDyOy2tB9tYltXgowduMYGQhzAKgagLoKRz5p7sF9h9XXHLrNhH8Fs6Fh6\nGdteS5SPBT9cFVq2JN0JwSIATf7LV2HzqAkLdzkUP9IBYuFBdGPEtY1IdwKBgQCI\nZTh77dtIiwgU81uJCeT/ECz/RTeK6FwC1RfW9/rFajkezv/23JpJCIsoBDUd3m5p\nDo57DeLM2rWd7UkiyuyCt5F3+AUO4UPF3lJFok2+QAtY9zZK3hFwA/pHdAaG5Eyk\n/tj1Mmdq3QCgT7NePsxZS2zaEyhbPi3sm0tMzeakxQKBgAQ0c5DMSw/GJ/poLO8v\n5E5x+cbg6yA4Apr/9+BnKvbP5M3KBGJqYGC4v1elXIyht92jl/Ex1Pp5X41NgFwT\nDqiA77uIj+8W/HNKBqKTneLNuNOPKN3U4DXIysDttvkQUezu/F6yST+Ed4Y8AIJx\nCQUQJBV1/ebuIBIzcO3XztvZ\n-----END PRIVATE KEY-----\n
GOOGLE_SHEETS_ID=1WWf-R0i5MuNw1WzhZUGpSSvZnb1zld6MQbw5ZArc53w
GOOGLE_SHEETS_RANGE=Responses!A:E

# Email (DON'T COMMIT THESE!)
EMAIL_USER=swastikgupta.nexboy@gmail.com
EMAIL_APP_PASSWORD=govsftdmxemjoxqh

# Cache
CACHE_TTL=1800
```

**IMPORTANT:** For `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`:
- Must have `\n` as literal characters (not actual newlines)
- Copy the EXACT value from your local `.env`

### 1.4 Deploy
```bash
railway up
```

### 1.5 Get Your Railway URL
```bash
railway domain
```
Save this URL! Example: `https://portfolio-backend-production-xxxx.up.railway.app`

---

## ☁️ STEP 2: Deploy Frontend to Vercel

### 2.1 Login to Vercel
```bash
# If you haven't installed Vercel CLI:
npm install -g vercel

# Login
vercel login
```

### 2.2 Deploy
```bash
cd d:\PORTFOLIO\portfolio-website
vercel --prod
```

### 2.3 Add Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these for **Production**:
```bash
# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=portfolio-backend@totemic-atom-454000-r9.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQClFK90qYPZ3hsY\nOrRGAxHvw8UThCI6PH05WrEDaRE8QpY/NXvATgSc5ZSEdTPVSHgCW401YKRfd0Po\naDsPKXW+v8xl83hv5ygSRzO8WiYS6/F1fCkNBRcLCcLPDMjT0+q+VKo5FpLmMYcE\nwo7MmOaMccF/538fTV7LN8fz56Xx1wNjNf9YY3SWyuWIwUcnACbKFjuecYCuj5qg\nygO0W6Tx7mLzYvTmEh7ZM6ym6t05MVVAkNBoK/gCjTBNlyanWQYGDWsmMjtbbOp9\nXJyGJK1vdyjhcW/9aTnU24NBSBDHiW+hjPGT3Ed94K5k4abGnKhVMVp/i8sDPT42\nKsqHGG5nAgMBAAECggEARuh8NyHLO22eeMlafwo5jaIrSGdE5nvuFBFDIKJkX1yA\nuhTom6FHdPdeVIkdYxtWRTj7Djb9U+5gUndXCvu1kmJDU3WBwZtqiHNiIyEb4pvL\nYzoaTffmPn0KWzJ0Hx0TY37tgUkTf2I9y0sg2HxC54fDZIPVBGaQ9bx3nGpfyuFt\nVSm/qkLbvSDuH/IWYsc20a3vWKnVV2jsKafziQpRl6VBre/D6jkzNZwRsInhLrcv\nAKgdNPvElbirzC0IL3sGn9lbYeZnaFFdwtlwbJDLTtKGv8urFqvlSayLboPXRKuq\nKSyLEWfgBu8vfUJ54UIHOBwffq56lsPvxamz+PnO/QKBgQDmf8wZDfZE1YDM2HjD\nE+lJMVWVGBj1xNGaOYFRnmdDsuBhh4Exme6v41JWCqbfP9ALBtcm5Lwzfx+WvzYS\nrI7ETEwItLYhGI7t7EHKe+1BstqIBa14SMxi9yZyU7je4S8+60AxZVUHGSTB6smi\nyospqKwQzVmr/Il7qoVIUOu0YwKBgQC3WBtaFrtJHkYY6sYXdRN1gzYNse+rvE0+\npFSvL1LWeiKWOXJ7MifnW3wVUI6/Qt6jq7ZvXsUYhg3QE3GfCkL0oe8UZX3kLDmm\nC3U2TQvP1By3Y/Gqd5/BGoCGU3yZhoxBEIYarlFBtGsJvemW7EldJvofLdCj8Qfw\nIM5gMH4zLQKBgQDICMJsP+SoKg1kOLzctyvufCUEhewrZcptKFilJ24An30AxuME\n080D0ajDyOy2tB9tYltXgowduMYGQhzAKgagLoKRz5p7sF9h9XXHLrNhH8Fs6Fh6\nGdteS5SPBT9cFVq2JN0JwSIATf7LV2HzqAkLdzkUP9IBYuFBdGPEtY1IdwKBgQCI\nZTh77dtIiwgU81uJCeT/ECz/RTeK6FwC1RfW9/rFajkezv/23JpJCIsoBDUd3m5p\nDo57DeLM2rWd7UkiyuyCt5F3+AUO4UPF3lJFok2+QAtY9zZK3hFwA/pHdAaG5Eyk\n/tj1Mmdq3QCgT7NePsxZS2zaEyhbPi3sm0tMzeakxQKBgAQ0c5DMSw/GJ/poLO8v\n5E5x+cbg6yA4Apr/9+BnKvbP5M3KBGJqYGC4v1elXIyht92jl/Ex1Pp5X41NgFwT\nDqiA77uIj+8W/HNKBqKTneLNuNOPKN3U4DXIysDttvkQUezu/F6yST+Ed4Y8AIJx\nCQUQJBV1/ebuIBIzcO3XztvZ\n-----END PRIVATE KEY-----\n
GOOGLE_SHEETS_ID=1WWf-R0i5MuNw1WzhZUGpSSvZnb1zld6MQbw5ZArc53w
GOOGLE_SHEETS_RANGE=Responses!A:E

# Backend API URL (use your Railway URL from Step 1.5)
NEXT_PUBLIC_API_URL=https://portfolio-backend-production-xxxx.up.railway.app

# Site URL
NEXT_PUBLIC_SITE_URL=https://shirokokun-portfolio-live.vercel.app

# Email (DON'T COMMIT THESE!)
EMAIL_USER=swastikgupta.nexboy@gmail.com
EMAIL_APP_PASSWORD=govsftdmxemjoxqh
```

### 2.4 Redeploy
After adding environment variables:
```bash
vercel --prod
```

---

## 🔄 STEP 3: Update CORS in Railway

Now that you have your Vercel URL, go back to Railway:

1. Go to Railway Dashboard → portfolio-backend → Variables
2. Update `ALLOWED_ORIGINS`:
   ```
   https://shirokokun-portfolio-live.vercel.app
   ```
3. Railway will auto-redeploy

---

## ✅ STEP 4: Test Everything

### Test Contact Form
1. Go to: `https://shirokokun-portfolio-live.vercel.app/contact`
2. Submit a test message
3. Check:
   - ✅ Google Sheet (message saved)
   - ✅ Your email (notification received)

### Test Blog
1. Go to: `https://shirokokun-portfolio-live.vercel.app/blog`
2. Should see 3 blog posts from Substack

### Test Backend API
```bash
curl https://your-railway-url.up.railway.app/health
curl https://your-railway-url.up.railway.app/api/blog/posts
```

---

## 🐛 TROUBLESHOOTING

### Contact Form Not Working
- Check Vercel logs: `vercel logs`
- Verify environment variables are set in Vercel dashboard
- Check Google Sheets permissions

### Blog Not Displaying
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Verify Railway backend is running
- Check CORS settings in Railway

### Email Not Sending
- Verify `EMAIL_USER` and `EMAIL_APP_PASSWORD` in Vercel
- Check Vercel function logs for errors
- Verify Gmail app password is still valid

---

## 📊 POST-DEPLOYMENT CHECKLIST

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] CORS configured correctly
- [ ] Environment variables set on both platforms
- [ ] Contact form works (saves to Google Sheets)
- [ ] Email notifications work
- [ ] Blog displays 3 posts
- [ ] All pages load correctly
- [ ] Mobile responsive test
- [ ] Share your live portfolio link! 🎉

---

## 🚀 YOUR LIVE URLS

**Frontend:** https://shirokokun-portfolio-live.vercel.app
**Backend:** https://[your-railway-url].up.railway.app

---

**Ready to deploy? Let's do this!** 🔥
