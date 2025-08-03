# 🚀 Manual Deployment - No Installation Required

## 📋 **Step 1: Deploy Frontend to Vercel**

### **1.1 Go to Vercel**
- Open [vercel.com](https://vercel.com)
- Sign up/Login with GitHub, Google, or email

### **1.2 Create New Project**
- Click "New Project"
- Choose "Upload Template"
- Click "Upload Files"

### **1.3 Upload Frontend Files**
- Select all files from your project folder EXCEPT the `backend/` folder
- Upload these files:
  - `app/` folder
  - `components/` folder
  - `lib/` folder
  - `package.json`
  - `tsconfig.json`
  - `tailwind.config.js`
  - `postcss.config.js`
  - `next.config.js`
  - `vercel.json`
  - `README.md`

### **1.4 Configure Project**
- **Project Name**: `ai-web-agency`
- **Framework Preset**: Next.js (auto-detected)
- Click "Deploy"

### **1.5 Add Environment Variables**
After deployment, go to Project Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4emllZXprbHplaGxoaXpwa2oiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDU2NzIwMCwiZXhwIjoyMDUwMTQzMjAwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

---

## 📋 **Step 2: Deploy Backend to Render**

### **2.1 Go to Render**
- Open [render.com](https://render.com)
- Sign up/Login with GitHub, Google, or email

### **2.2 Create Web Service**
- Click "New +"
- Select "Web Service"
- Choose "Upload Files"

### **2.3 Upload Backend Files**
- Select all files from the `backend/` folder
- Upload these files:
  - `app/` folder
  - `agents/` folder
  - `requirements.txt`
  - `Procfile`
  - `runtime.txt`
  - `Dockerfile`
  - `docker-compose.yml`
  - `README.md`

### **2.4 Configure Service**
- **Name**: `ai-web-agency-backend`
- **Environment**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### **2.5 Add Environment Variables**
In the Environment tab, add:
```
PERPLEXITY_API_KEY=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
SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4emllZXprbHplaGxoaXpwa2oiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzM0NTY3MjAwLCJleHAiOjIwNTAxNDMyMDB9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
```

### **2.6 Deploy**
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)

---

## 📋 **Step 3: Update Frontend Backend URL**

### **3.1 Get Backend URL**
- Go to your Render dashboard
- Copy the URL (e.g., `https://ai-web-agency-backend.onrender.com`)

### **3.2 Update Frontend Environment**
- Go to your Vercel dashboard
- Update `NEXT_PUBLIC_BACKEND_URL` with your actual backend URL

---

## 🎯 **Expected URLs**

- **Frontend**: `https://ai-web-agency.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **API Docs**: `https://your-backend.onrender.com/docs`

---

## ✅ **What You'll Get**

Once deployed, you'll have:
- ✅ Professional landing page
- ✅ Interactive quote calculator
- ✅ Stripe payment integration
- ✅ AI Copilot chatbot
- ✅ Automated agent workflow
- ✅ Real-time project tracking
- ✅ Dark/light mode
- ✅ Mobile responsive design

---

## 🚀 **Ready to Deploy?**

Just follow the steps above - no installations needed!

**Your MVP will be live in 15-20 minutes! 🎉** 