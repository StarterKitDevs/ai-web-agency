# AI Web Agency - MVP Deployment

A production-ready AI-powered web development agency platform with automated workflow orchestration.

## 🚀 **Quick Deploy**

### **Frontend (Next.js) → Vercel**
1. **Connect to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy to Vercel
   vercel --prod
   ```

2. **Environment Variables (Vercel Dashboard):**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_BACKEND_URL=https://ai-web-agency-backend.onrender.com
   ```

### **Backend (FastAPI) → Render**
1. **Connect to Render:**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect your GitHub repo
   - Set root directory to `backend/`

2. **Environment Variables (Render Dashboard):**
   ```
   PERPLEXITY_API_KEY=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
   SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   DATABASE_URL=postgresql://...
   ```

3. **Build Command:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start Command:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

## 📋 **Features**

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
- Supabase (client)
- Stripe (client)
- React Hook Form + Zod

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

## 🔧 **Local Development**

### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

### **Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### **Environment Setup**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Backend (.env)
PERPLEXITY_API_KEY=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
SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
```

## 📊 **API Endpoints**

### **Projects**
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}/status` - Get project status
- `POST /api/projects/{id}/trigger` - Trigger agent workflow
- `GET /api/projects` - List all projects

### **Payments**
- `POST /api/payments/create-intent` - Create Stripe PaymentIntent
- `POST /api/payments/webhook` - Stripe webhook handler

### **Copilot**
- `POST /api/copilot` - AI chat with suggestions

### **WebSocket**
- `WS /ws` - Real-time updates

## 🤖 **Agent Workflow**

1. **Design Agent** → Creates mockups using Perplexity AI
2. **Development Agent** → Generates code and deployment config
3. **Deployment Agent** → Publishes to Vercel
4. **Notification Agent** → Sends client updates

## 🚀 **Deployment URLs**

- **Frontend**: `https://ai-web-agency.vercel.app`
- **Backend**: `https://ai-web-agency-backend.onrender.com`
- **API Docs**: `https://ai-web-agency-backend.onrender.com/docs`

## 📝 **Environment Variables**

### **Frontend (Vercel)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_BACKEND_URL=https://ai-web-agency-backend.onrender.com
```

### **Backend (Render)**
```env
PERPLEXITY_API_KEY=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
SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
```

## 🎯 **MVP Features**

- ✅ **Landing Page**: Professional agency website
- ✅ **Quote Form**: Interactive pricing calculator
- ✅ **Payment Processing**: Stripe integration
- ✅ **User Authentication**: Supabase magic link
- ✅ **Project Dashboard**: Live status tracking
- ✅ **AI Copilot**: Intelligent chat assistant
- ✅ **Agent Workflow**: Automated web development
- ✅ **Real-time Updates**: Live progress tracking
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Dark/Light Mode**: Theme switching

## 🔄 **Workflow Process**

1. **Client fills quote form** → Real-time pricing
2. **Payment processed** → Stripe + Supabase user creation
3. **Agent workflow triggered** → Design → Dev → Deploy → Notify
4. **Live website delivered** → Client notified via email/SMS
5. **Dashboard updates** → Real-time progress tracking

## 📈 **Next Steps**

- [ ] Add custom domain
- [ ] Implement email service (SendGrid)
- [ ] Add SMS notifications (Twilio)
- [ ] Enhanced error handling
- [ ] Performance monitoring
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] A/B testing setup

## 🆘 **Support**

For deployment issues or questions:
1. Check environment variables
2. Verify API endpoints
3. Check deployment logs
4. Test local development first

**Ready for MVP deployment! 🚀** 