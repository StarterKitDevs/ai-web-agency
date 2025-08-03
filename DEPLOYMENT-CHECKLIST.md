# 🚀 Deployment Checklist

## ✅ **Frontend Deployment (Vercel)**

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up/Login
- [ ] Click "New Project"
- [ ] Choose "Upload Template"
- [ ] Upload frontend files (everything except `backend/` folder)
- [ ] Set project name: `ai-web-agency`
- [ ] Click "Deploy"
- [ ] Add environment variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4emllZXprbHplaGxoaXpwa2oiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDU2NzIwMCwiZXhwIjoyMDUwMTQzMjAwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8`
  - [ ] `NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com`

## ✅ **Backend Deployment (Render)**

- [ ] Go to [render.com](https://render.com)
- [ ] Sign up/Login
- [ ] Click "New +" → "Web Service"
- [ ] Choose "Upload Files"
- [ ] Upload backend files (everything in `backend/` folder)
- [ ] Set service name: `ai-web-agency-backend`
- [ ] Set build command: `pip install -r requirements.txt`
- [ ] Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Add environment variables:
  - [ ] `PERPLEXITY_API_KEY=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`
  - [ ] `SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4emllZXprbHplaGxoaXpwa2oiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzM0NTY3MjAwLCJleHAiOjIwNTAxNDMyMDB9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8`
  - [ ] `STRIPE_SECRET_KEY=sk_test_...`
  - [ ] `STRIPE_WEBHOOK_SECRET=whsec_...`
  - [ ] `DATABASE_URL=postgresql://...`
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)

## ✅ **Final Setup**

- [ ] Copy backend URL from Render
- [ ] Update frontend environment variable with backend URL
- [ ] Test the application

## 🎯 **Your URLs**

- **Frontend**: `https://ai-web-agency.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **API Docs**: `https://your-backend.onrender.com/docs`

## 🎉 **Success!**

Once all checkboxes are checked, your AI Web Agency MVP will be live! 