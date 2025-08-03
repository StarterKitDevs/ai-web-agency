# 🚀 AI Web Agency - Complete Deployment Guide

## 📋 **Prerequisites Installation**

### **1. Install Node.js**
- Go to [nodejs.org](https://nodejs.org)
- Download LTS version (18.x or higher)
- Run installer with default settings

### **2. Install Git**
- Go to [git-scm.com](https://git-scm.com)
- Download for Windows
- Run installer with default settings

### **3. Verify Installation**
```bash
node --version
npm --version
git --version
```

---

## 🚀 **Option 1: GitHub + Vercel/Render (Recommended)**

### **Step 1: Setup GitHub Repository**
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `ai-web-agency`
3. Make it **Public**
4. **Don't** initialize with README (we have one)
5. Click "Create repository"

### **Step 2: Push Code to GitHub**
```bash
# Run the setup script
.\setup-github.bat

# Or manually:
git init
git add .
git commit -m "Initial commit: AI Web Agency MVP"
git remote add origin https://github.com/YOUR_USERNAME/ai-web-agency.git
git push -u origin main
```

### **Step 3: Deploy Frontend to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `ai-web-agency` repository
5. Vercel will auto-detect Next.js
6. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4emllZXprbHplaGxoaXpwa2oiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDU2NzIwMCwiZXhwIjoyMDUwMTQzMjAwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
   ```
7. Click "Deploy"

### **Step 4: Deploy Backend to Render**
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your `ai-web-agency` repository
5. Configure:
   - **Name**: `ai-web-agency-backend`
   - **Root Directory**: `backend/`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   ```
   PERPLEXITY_API_KEY=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
   SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4emllZXprbHplaGxoaXpwa2oiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzM0NTY3MjAwLCJleHAiOjIwNTAxNDMyMDB9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   DATABASE_URL=postgresql://...
   ```
7. Click "Create Web Service"

---

## 🚀 **Option 2: Local Vercel CLI Deployment**

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Deploy Frontend**
```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### **Step 3: Deploy Backend**
Follow the Render deployment steps from Option 1.

---

## 🚀 **Option 3: Manual File Upload (Simplest)**

### **Frontend to Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Choose "Upload Template"
4. Upload your project files
5. Configure environment variables

### **Backend to Render:**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Choose "Upload Files"
4. Upload your backend folder
5. Configure as in Option 1

---

## 🔧 **Environment Variables Reference**

### **Frontend (Vercel)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4emllZXprbHplaGxoaXpwa2oiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDU2NzIwMCwiZXhwIjoyMDUwMTQzMjAwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

### **Backend (Render)**
```env
PERPLEXITY_API_KEY=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
SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4emllZXprbHplaGxoaXpwa2oiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzM0NTY3MjAwLCJleHAiOjIwNTAxNDMyMDB9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
```

---

## 🎯 **Expected URLs**

- **Frontend**: `https://ai-web-agency.vercel.app`
- **Backend**: `https://ai-web-agency-backend.onrender.com`
- **API Docs**: `https://ai-web-agency-backend.onrender.com/docs`

---

## 🆘 **Troubleshooting**

### **Common Issues:**
1. **Node.js not found**: Install from [nodejs.org](https://nodejs.org)
2. **Git not found**: Install from [git-scm.com](https://git-scm.com)
3. **Build errors**: Check environment variables
4. **CORS errors**: Verify backend URL in frontend env vars

### **Get Help:**
- Check deployment logs in Vercel/Render dashboards
- Verify all environment variables are set
- Test API endpoints at `/docs`

---

## 🎉 **Success!**

Once deployed, you'll have a fully functional AI-powered web agency platform with:
- ✅ Professional landing page
- ✅ Interactive quote calculator
- ✅ Stripe payment processing
- ✅ AI Copilot chatbot
- ✅ Automated agent workflow
- ✅ Real-time project tracking

**Your MVP is ready to go live! 🚀** 