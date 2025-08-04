# AI Web Agency - Enhanced Frontend

A production-ready AI-powered web development agency platform with automated workflow orchestration and modern UX.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/StarterKitDevs/ai-web-agency)

## 🚀 **Quick Deploy**

### **Automatic Deployment (Recommended)**
1. **Fork this repository** to your GitHub account
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
   - Deploy automatically!

### **Manual Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### **Environment Variables (Vercel Dashboard):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_BACKEND_URL=https://ai-web-agency-backend.onrender.com
```

## 🎨 **Enhanced Frontend Features**

### **Modern User Experience**
- ✅ **Enhanced Hero Section** with compelling messaging and social proof
- ✅ **Interactive Chat Bot** with quick replies and AI assistance
- ✅ **Process Timeline** showing 4-step development process
- ✅ **Social Proof Section** with testimonials and statistics
- ✅ **Responsive Navigation** with mobile menu and theme toggle
- ✅ **Dark/Light Mode** with smooth transitions
- ✅ **Professional Branding** with gradient designs and animations

### **Technical Improvements**
- ✅ **Radix UI Components** for better accessibility
- ✅ **Enhanced Dependencies** with latest versions
- ✅ **Optimized Build Process** for faster deployment
- ✅ **GitHub Actions** for automatic deployment
- ✅ **Vercel Configuration** for optimal performance

## 📋 **Core Features**

### **Frontend**
- ✅ Responsive landing page with dark/light mode
- ✅ Interactive quote form with real-time pricing
- ✅ Stripe payment integration
- ✅ Supabase authentication (magic link)
- ✅ Live dashboard with project status
- ✅ AI Copilot chatbot with streaming responses
- ✅ Real-time updates via Supabase Realtime

### **Backend**
- ✅ FastAPI with comprehensive API endpoints
- ✅ LangChain/LangGraph agent orchestration
- ✅ Perplexity AI integration for intelligent responses
- ✅ Stripe webhook handling
- ✅ Supabase integration for auth and storage
- ✅ Real-time WebSocket support
- ✅ Modular agent system (Design, Dev, Deploy, Notify)

### **AI Agents**
- ✅ **Design Agent**: Converts requirements to mockups
- ✅ **Development Agent**: Generates functional code
- ✅ **Deployment Agent**: Publishes to Vercel
- ✅ **Notification Agent**: Sends client updates
- ✅ **Orchestrator**: Manages workflow with LangGraph

## 🛠 **Tech Stack**

### **Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Radix UI Components
- Supabase (client)
- Stripe (client)
- React Hook Form + Zod
- Lucide React Icons

### **Backend**
- FastAPI (Python 3.11+)
- SQLAlchemy + PostgreSQL
- LangChain + LangGraph
- Perplexity AI API
- Stripe (server)
- Supabase (server)

### **Infrastructure**
- Vercel (frontend hosting)
- Render/Railway (backend hosting)
- Supabase (database + auth)
- Stripe (payments)
- GitHub Actions (CI/CD)

## 🚀 **Deployment Status**

This project uses GitHub Actions for automatic deployment to Vercel. Every push to the main branch triggers a new deployment.

**Latest Deployment:** [![Deploy Status](https://github.com/StarterKitDevs/ai-web-agency/workflows/Deploy%20to%20Vercel/badge.svg)](https://github.com/StarterKitDevs/ai-web-agency/actions) 