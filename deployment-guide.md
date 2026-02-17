# Mentorlink-2 Production Deployment Guide

This guide will help you deploy the Mentorlink application to production platforms like Vercel, Render, or Railway.

---

## Table of Contents
1. [Frontend Deployment (Vercel/Render/Netlify)](#frontend-deployment)
2. [Backend Deployment (Render/Railway/Heroku)](#backend-deployment)
3. [Database Setup (MongoDB Atlas)](#database-setup)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Troubleshooting](#troubleshooting)

---

## Frontend Deployment

### Prerequisites
- GitHub/GitLab repository with your code
- Vercel/Render/Netlify account

### Option 1: Vercel (Recommended for Frontend)

#### Step 1: Prepare Environment Variables
1. Copy `.env.production.example` to `.env.production`:
   ```bash
   cp .env.production.example .env.production
   ```

2. Edit `.env.production` and set your backend URL:
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (or leave default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add Environment Variables:
   - Go to "Environment Variables" tab
   - Add: `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - Apply to: Production, Preview, Development

6. Click "Deploy"

#### Step 3: Post-Deploy
- Your app will be live at `https://your-app.vercel.app`
- Copy this URL - you'll need it for backend CORS setup

### Option 2: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" > "Static Site"
3. Connect your repository
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`
6. Click "Create Static Site"

### Option 3: Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" > "Import an existing project"
3. Connect your repository
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Environment variables:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`
6. Click "Deploy site"

---

## Backend Deployment

### Prerequisites
- MongoDB Atlas account (or other MongoDB hosting)
- Backend environment variables ready

### Option 1: Render (Recommended for Backend)

#### Step 1: Create Web Service
1. Go to [render.com](https://render.com)
2. Click "New +" > "Web Service"
3. Connect your repository
4. Configure:
   - **Name:** `mentorlink-backend`
   - **Root Directory:** `./backend` (if applicable)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` or `node server.js`

#### Step 2: Set Environment Variables
Add the following in Render Dashboard > Environment:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mentorlink?retryWrites=true&w=majority

# Frontend URLs (CORS)
FRONTEND_URL=https://your-app.vercel.app
CLIENT_URL=https://your-app.vercel.app

# Server
NODE_ENV=production
PORT=5000

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Optional: Email service
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional: Socket.io
SOCKET_PORT=5000
```

#### Step 3: Deploy
1. Click "Create Web Service"
2. Render will automatically deploy
3. Copy the service URL: `https://mentorlink-backend.onrender.com`

### Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Add environment variables (same as Render above)
   - Railway auto-detects Node.js
5. Click "Deploy"

### Option 3: Heroku

1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app:
   ```bash
   heroku create mentorlink-backend
   ```
4. Set environment variables:
   ```bash
   heroku config:set MONGO_URI=your-mongo-uri
   heroku config:set FRONTEND_URL=https://your-app.vercel.app
   heroku config:set NODE_ENV=production
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

---

## Database Setup

### MongoDB Atlas (Recommended)

#### Step 1: Create Cluster
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in/Create account
3. Create a new cluster (Free tier available)
4. Choose cloud provider and region closest to your backend

#### Step 2: Configure Access
1. **Network Access:**
   - Go to "Network Access" > "Add IP Address"
   - Click "Allow Access from Anywhere" (for production)
   - Or add specific IPs of Render/Vercel/Railway

2. **Database Access:**
   - Go to "Database Access" > "Add New Database User"
   - Create username and strong password
   - Grant "Read and write to any database" permission

#### Step 3: Get Connection String
1. Go to "Clusters" > "Connect"
2. Choose "Connect your application"
3. Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
4. Replace `<username>`, `<password>`, and `<dbname>`

#### Step 4: Initialize Database
1. Create database named `mentorlink`
2. Create collections:
   - `users`
   - `events`
   - `mentors`
   - `students`
   - `messages`

---

## Post-Deployment Verification

### Health Check
1. **Backend Health:**
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```
   Expected response:
   ```json
   {"status": "ok", "timestamp": "2025-01-15T..."}
   ```

2. **Frontend API Connection:**
   - Open browser console on your deployed frontend
   - Check for any CORS or 404 errors
   - Visit `/events` page and verify events load

### Test Critical Features
- [ ] User signup/login works
- [ ] Events page loads data
- [ ] Mentors directory displays
- [ ] Student profiles accessible
- [ ] Real-time chat functions (if enabled)
- [ ] Dark mode toggle works
- [ ] Responsive design on mobile

### Monitor Performance
- **Frontend:** Vercel/Netlify dashboard shows build status
- **Backend:** Render/Railway logs show requests
- **Database:** MongoDB Atlas monitors connections

---

## Troubleshooting

### Events Page Not Loading

**Symptom:** Events page shows "Failed to Load Events"

**Solutions:**
1. Check `VITE_API_URL` is set correctly in frontend
2. Verify backend is running: `curl https://backend-url/api/health`
3. Check MongoDB connection string is valid
4. Review backend logs for errors

### CORS Errors

**Symptom:** Console shows "Access-Control-Allow-Origin" errors

**Solution:**
1. Ensure `FRONTEND_URL` in backend matches your actual frontend URL
2. Update backend CORS configuration:
   ```javascript
   // In backend/server.js
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

### Backend 502/503 Errors

**Symptom:** Backend returns gateway errors

**Solutions:**
1. **Free tier sleep:** Render free tier services sleep after inactivity
   - First request may take 30-60 seconds to wake up
   - Consider upgrading to paid tier
2. Check backend logs for startup errors
3. Verify MongoDB connection is established

### Build Failures

**Frontend Build Fails:**
- Check Node version compatibility (use Node 18+)
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall
- Check for syntax errors in JSX files

**Backend Build Fails:**
- Verify `package.json` has all dependencies
- Check for missing environment variables
- Review error logs in deployment platform

### Slow API Responses

**Symptoms:** Pages take >5 seconds to load

**Solutions:**
1. Enable backend health check (already done in api.js)
2. Add database indexes for frequently queried fields
3. Implement caching (Redis, etc.)
4. Upgrade to paid tier for better performance

---

## Environment Variables Checklist

### Frontend (.env.production)
- [x] `VITE_API_URL` - Backend API URL

### Backend (Render/Railway/Heroku)
- [x] `MONGO_URI` - MongoDB connection string
- [x] `FRONTEND_URL` - Frontend URL for CORS
- [x] `CLIENT_URL` - Same as FRONTEND_URL
- [x] `NODE_ENV` - Set to "production"
- [x] `PORT` - Auto-assigned or 5000
- [x] `JWT_SECRET` - Strong random string
- [ ] `EMAIL_USER` - (Optional) For email features
- [ ] `EMAIL_PASS` - (Optional) For email features

---

## Best Practices

### Security
1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Enable HTTPS only** - Most platforms do this automatically
4. **Whitelist IPs** - In MongoDB Atlas, specify allowed IPs

### Performance
1. **Enable CDN** - Vercel/Netlify do this automatically
2. **Optimize images** - Use WebP format, lazy loading
3. **Code splitting** - Vite does this automatically
4. **Database indexes** - Add indexes on frequently queried fields

### Monitoring
1. **Set up alerts** - Use Render/Vercel monitoring
2. **Log aggregation** - Consider services like Logtail, Papertrail
3. **Uptime monitoring** - Use UptimeRobot or similar
4. **Error tracking** - Consider Sentry for error reporting

---

## Support

If you encounter issues not covered here:

1. **Check Logs:**
   - Frontend: Browser console + deployment platform logs
   - Backend: Deployment platform logs
   - Database: MongoDB Atlas logs

2. **Common Issues:**
   - API URL format: Must include `/api` at the end
   - CORS: Frontend and backend URLs must match exactly
   - MongoDB: Check IP whitelist and user credentials

3. **Get Help:**
   - GitHub Issues: Report bugs in your repository
   - Platform Docs:
     - [Vercel Documentation](https://vercel.com/docs)
     - [Render Documentation](https://render.com/docs)
     - [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)

---

## Quick Reference

### Deployment URLs
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.onrender.com`
- **API Base:** `https://your-backend.onrender.com/api`
- **Health Check:** `https://your-backend.onrender.com/api/health`

### Important Files
- Frontend config: `.env.production`
- Backend config: Environment variables in deployment platform
- Database: MongoDB Atlas cluster

### Re-deploy Steps
1. **Frontend:** Push to main branch (auto-deploys on Vercel)
2. **Backend:** Push to main branch (auto-deploys on Render)
3. **Force rebuild:** Use platform dashboard to trigger manual deploy

---

**Last Updated:** January 2025
**Compatible with:** Node 18+, React 19, Vite 7, MongoDB 6+
