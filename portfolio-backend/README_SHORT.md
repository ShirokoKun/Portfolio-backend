# Portfolio Backend

Backend API for portfolio website. See [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) for full documentation.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Verify configuration
node init.js

# 4. Run development server
npm run dev

# 5. Test
curl http://localhost:8080/health
```

## 📚 Documentation

- **[COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)** - Full setup walkthrough
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions
- **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** - Connect to frontend
- **[README_FULL.md](./README.md)** - API reference

## 🚀 Deployment

**Railway (Recommended)**
```bash
git push origin main
# Deploy via Railway dashboard
```

**Render**
```bash
# Connect GitHub repo via Render dashboard
```

## 📡 API Endpoints

- `GET /health` - Health check
- `GET /api/blog/posts` - All blog posts
- `GET /api/blog/post/:slug` - Single post
- `POST /api/contact` - Submit contact form

## 🔧 Environment Variables

See `.env.example` for all required variables.

## 📝 License

MIT
