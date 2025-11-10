# Portfolio Backend API

A standalone backend API service for the portfolio website, handling blog posts from Substack RSS feed and contact form submissions via Google Sheets.

## 🚀 Features

- **Blog API**: Fetches and caches Substack blog posts via RSS feed
- **Contact Form**: Saves messages to Google Sheets
- **Caching**: In-memory caching with configurable TTL
- **Rate Limiting**: Protection against spam and abuse
- **CORS**: Configured for your frontend domain
- **TypeScript**: Fully typed for better development experience

## 📁 Project Structure

```
portfolio-backend/
├── src/
│   ├── index.ts                      # Main entry point
│   ├── controllers/                  # Request handlers
│   │   ├── blog.controller.ts
│   │   └── contact.controller.ts
│   ├── services/                     # Business logic
│   │   ├── substack.service.ts
│   │   └── sheets.service.ts
│   ├── routes/                       # API routes
│   │   ├── blog.routes.ts
│   │   └── contact.routes.ts
│   └── middlewares/                  # Express middlewares
│       ├── cors.middleware.ts
│       ├── error.middleware.ts
│       ├── rate-limit.middleware.ts
│       ├── logger.middleware.ts
│       └── validation.middleware.ts
├── dist/                             # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd portfolio-backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# CORS - Add your frontend URL
ALLOWED_ORIGINS=http://localhost:3000,https://shirokokun-portfolio.vercel.app

# Substack Configuration
SUBSTACK_RSS_URL=https://shirokokun.substack.com/feed

# Google Sheets Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=your-spreadsheet-id
GOOGLE_SHEETS_RANGE=Responses!A:E

# Cache Configuration (in seconds)
CACHE_TTL=1800
```

### 3. Google Sheets Setup

#### A. Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **Google Sheets API**
4. Go to **IAM & Admin** → **Service Accounts** → **Create Service Account**
5. Name it `portfolio-backend`
6. Click **Create and Continue**
7. Grant role: **Editor**
8. Click **Done**
9. Click on the created service account
10. Go to **Keys** tab → **Add Key** → **Create New Key** → **JSON**
11. Download the JSON file

#### B. Extract Credentials

From the downloaded JSON file, copy:
- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

#### C. Create Google Sheet

1. Create a new Google Sheet
2. Name it "Portfolio Messages"
3. Add header row:
   ```
   Timestamp | Name | Email | Subject | Message
   ```
4. Share the sheet with the service account email (from JSON file)
5. Give it **Editor** permissions
6. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
   ```

### 4. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:8080`

### 5. Test the API

#### Health Check
```bash
curl http://localhost:8080/health
```

#### Blog Posts
```bash
curl http://localhost:8080/api/blog/posts
```

#### Single Post
```bash
curl http://localhost:8080/api/blog/post/your-post-slug
```

#### Contact Form (Test)
```bash
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message from the API"
  }'
```

## 📦 Deployment Options

### Option 1: Railway (Recommended - Free Tier)

1. Create account at [railway.app](https://railway.app/)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `portfolio-backend` repository
4. Add environment variables in Railway dashboard
5. Deploy!

**Custom Domain (Optional):**
- Railway provides a free `.up.railway.app` domain
- You can add a custom domain in settings

### Option 2: Render (Free Tier)

1. Create account at [render.com](https://render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `portfolio-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables
6. Deploy!

### Option 3: Vercel (Serverless)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts to deploy
4. Add environment variables via Vercel dashboard

**Note**: For Vercel, you need to add a `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

### Option 4: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create portfolio-backend`
4. Add buildpack: `heroku buildpacks:set heroku/nodejs`
5. Set env vars: `heroku config:set KEY=VALUE`
6. Deploy: `git push heroku main`

## 🔧 Build for Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## 📚 API Endpoints

### Blog Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blog/posts` | Get all blog posts |
| GET | `/api/blog/posts?refresh=true` | Force refresh cache |
| GET | `/api/blog/post/:slug` | Get single post by slug |
| POST | `/api/blog/cache/clear` | Clear blog cache |

### Contact Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact/test` | Test Google Sheets connection |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API information |

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin restrictions
- **Rate Limiting**: 
  - General: 100 requests per 15 minutes
  - Contact form: 5 submissions per hour per IP
- **Input Validation**: Using Zod schemas
- **Environment Variables**: Sensitive data not in code

## 🐛 Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti :8080 | xargs kill -9
```

### Google Sheets "Permission Denied"
- Ensure the sheet is shared with service account email
- Check that the service account has Editor permissions
- Verify the private key is properly escaped in .env

### CORS errors
- Add your frontend URL to `ALLOWED_ORIGINS` in .env
- Make sure there are no trailing slashes
- Clear browser cache

### Cache not working
- Check `CACHE_TTL` value in .env (in seconds)
- Restart the server after changing .env

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `8080` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `ALLOWED_ORIGINS` | Yes | - | Comma-separated frontend URLs |
| `SUBSTACK_RSS_URL` | Yes | - | Your Substack RSS feed URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Yes | - | Google service account email |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Yes | - | Google service account private key |
| `GOOGLE_SHEETS_ID` | Yes | - | Google Sheets spreadsheet ID |
| `GOOGLE_SHEETS_RANGE` | No | `Responses!A:E` | Sheet range for data |
| `CACHE_TTL` | No | `1800` | Cache duration in seconds |

## 🔄 Updating the Backend

1. Make changes to code
2. Commit and push to GitHub
3. Deployment platform auto-deploys (if configured)
4. Or manually trigger deployment

## 📞 Support

If you encounter issues:
1. Check logs in your deployment platform
2. Verify all environment variables are set correctly
3. Test locally with `npm run dev` first
4. Check that Google Sheets API is enabled

## 📄 License

MIT
