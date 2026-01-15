# Hotel Management System - Deployment Guide

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier)
- Render/Railway/Vercel account (free tier)

---

## Step 1: Setup MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your database password
6. Add database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/hotel-management`
7. In "Network Access", add `0.0.0.0/0` to allow connections from anywhere

---

## Step 2: Deploy Backend to Render

### Option A: Using GitHub

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/hotel-management.git
   git push -u origin main
   ```

2. Go to [Render](https://render.com) and sign up
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `hotel-management-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   
6. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = (paste your MongoDB connection string)
   - `JWT_SECRET` = (generate a random string, e.g., use https://randomkeygen.com/)
   - `FRONTEND_URL` = (will add after frontend deployment)

7. Click "Create Web Service"
8. Copy your backend URL (e.g., `https://hotel-management-backend.onrender.com`)

### Option B: Using Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js
5. Add environment variables (same as above)
6. Set root directory to `backend`

---

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: (leave empty)
   - **Output Directory**: `.`

5. Click "Deploy"
6. Copy your frontend URL (e.g., `https://hotel-management.vercel.app`)

---

## Step 4: Update Configuration

### Update Backend CORS:

1. Go back to Render dashboard
2. Add environment variable:
   - `FRONTEND_URL` = (your Vercel URL)

### Update Frontend API URL:

1. In your local project, edit `frontend/js/app.js`:
   ```javascript
   const API_URL = 'https://your-backend-url.onrender.com/api';
   ```

2. Commit and push changes:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

3. Vercel will automatically redeploy

---

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try to sign up for a new account
3. Test booking a room
4. Verify emails are sent (if configured)

---

## Alternative: Deploy Everything to Render

### Deploy Backend (same as above)

### Deploy Frontend as Static Site:

1. In Render, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `hotel-management-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: (leave empty)
   - **Publish Directory**: `.`

4. Click "Create Static Site"

---

## Environment Variables Summary

### Backend (.env)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-management
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-url.vercel.app
```

---

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your frontend URL exactly
- Check that CORS is configured in `backend/app.js`

### Database Connection Failed
- Verify MongoDB Atlas connection string is correct
- Check that IP `0.0.0.0/0` is whitelisted in MongoDB Atlas Network Access

### 500 Errors
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set correctly

### Frontend Can't Connect to Backend
- Update `API_URL` in `frontend/js/app.js` to your backend URL
- Make sure backend is running (check Render dashboard)

---

## Post-Deployment Checklist

- [ ] Backend is accessible at `/api` endpoint
- [ ] Frontend loads correctly
- [ ] Sign up works and creates users in database
- [ ] Room booking works
- [ ] Emails are sent (if configured)
- [ ] All pages load without errors
- [ ] Mobile responsive design works

---

## Monitoring & Maintenance

### Check Backend Health
```
curl https://your-backend-url.onrender.com/api
```

### View Logs
- Render: Dashboard → Service → Logs
- Vercel: Dashboard → Project → Deployments → View Function Logs

---

## Cost Estimates

- **MongoDB Atlas**: Free (512MB storage)
- **Render**: Free tier includes 750 hours/month (backend may sleep after 15 min inactivity)
- **Vercel**: Free (100GB bandwidth)

**Total: $0/month** for basic usage!

---

## Upgrading to Paid Plans (Optional)

For production use with higher traffic:
- **MongoDB Atlas**: $9/month (2GB storage, better performance)
- **Render**: $7/month (always-on server)
- **Vercel**: Free tier is usually sufficient

---

## Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
