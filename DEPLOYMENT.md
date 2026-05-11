# Deployment Guide: Voice AI Twin 🚀

This guide explains how to deploy your project to GitHub and host it live.

## 1. Push to GitHub
Run these commands in your project root:
```powershell
git add .
git commit -m "feat: integrated real-time Voice AI with LiveKit & Groq"
# Replace with your actual repo URL
# git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
# git branch -M main
# git push -u origin main
```

## 2. Frontend Deployment (Vercel)
1. Go to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `frontend`.
5. Add **Environment Variables**:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-backend.railway.app`)
6. Click **Deploy**.

## 3. Backend Deployment (Railway - Recommended)
Railway is best for this because it supports multiple services in one repo.

### Setup Backend API
1. Connect your repo to Railway.
2. In the **Variables** tab, add all keys from your `backend/.env`.
3. Railway will automatically detect the Python environment.

### Setup Voice Agent Worker
The Voice Agent needs to run 24/7.
1. Create a new "Empty Service" in your Railway project.
2. Connect it to the same repo.
3. Set the **Start Command** to: `python backend/voice_agent.py`
4. Add the same Environment Variables.

## 4. LiveKit Configuration
Make sure your `LIVEKIT_URL` in the environment variables is the production one (starts with `wss://`).

---

### Critical Check
- Ensure `CORS` in `backend/app/main.py` allows your Vercel URL.
- Ensure `REACT_APP_API_URL` in Vercel points to the deployed Backend.
