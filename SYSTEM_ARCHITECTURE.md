# 🏗️ AI Web Agency - System Architecture Diagram

## 📋 **System Overview**

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           AI WEB AGENCY PLATFORM                                  │
│                                                                                   │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │
│  │   FRONTEND      │    │    BACKEND      │    │   EXTERNAL      │              │
│  │   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   SERVICES      │              │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🎯 **Frontend Architecture (Next.js)**

### **📱 Client-Facing Pages**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND PAGES                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  🏠 Main Application (/):                                                        │
│  ├── Hero Section (Get Your Website Now)                                         │
│  ├── Quote Form (Real-time pricing & payment)                                    │
│  ├── Process Timeline (Visual workflow)                                          │
│  ├── Social Proof (Testimonials & stats)                                        │
│  └── Chat Bot (AI Assistant)                                                     │
│                                                                                   │
│  🔧 Bolt DIY (/bolt-diy):                                                        │
│  ├── Template Selection (7 templates + Freestyle)                                │
│  ├── Customization (Design, features, layout)                                   │
│  ├── Generation (AI chat interface)                                              │
│  └── Launch (Preview, download, deploy)                                         │
│                                                                                   │
│  👑 Admin Dashboard (/admin/*):                                                  │
│  ├── /admin/login (Authentication)                                               │
│  ├── /admin/dashboard (Overview & metrics)                                       │
│  ├── /admin/projects (Project management)                                        │
│  ├── /admin/completed-projects (Completed sites)                                 │
│  ├── /admin/agents (AI agent monitoring)                                         │
│  ├── /admin/analytics (Business metrics)                                         │
│  └── /admin/settings (System configuration)                                       │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### **🔌 API Routes (Frontend)**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND API ROUTES                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  📋 /api/projects/                                                               │
│  ├── POST: Create new project (client & admin)                                   │
│  ├── GET: List projects (with admin filter)                                      │
│  ├── PUT: Update project                                                          │
│  └── DELETE: Delete project                                                       │
│                                                                                   │
│  🎯 /api/projects/generate/                                                      │
│  └── POST: Trigger AI website generation                                         │
│                                                                                   │
│  🚀 /api/projects/quick-create/                                                  │
│  └── POST: Simulated quick project creation                                      │
│                                                                                   │
│  🌐 /api/projects/live-site/                                                     │
│  ├── POST: Store live site URLs & documentation                                 │
│  └── GET: Retrieve live site info                                                │
│                                                                                   │
│  💳 /api/payments/create-intent/                                                 │
│  └── POST: Create Stripe payment intent                                          │
│                                                                                   │
│  🔐 /api/admin/login/                                                            │
│  └── POST: Admin authentication (JWT simulation)                                 │
│                                                                                   │
│  ✅ /api/admin/verify/                                                           │
│  └── POST: Verify admin token                                                    │
│                                                                                   │
│  🤖 /api/bolt-diy/generate/                                                      │
│  ├── POST: Generate Bolt DIY website                                            │
│  └── GET: Check generation status                                                │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🖥️ **Backend Architecture (FastAPI)**

### **🤖 AI Agent System**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              AI AGENT WORKFLOW                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  🎨 DESIGN AGENT (BaseAgentPhase)                                                │
│  ├── Input: Project requirements, business description                            │
│  ├── Process: Create design mockups, wireframes, UI/UX                          │
│  ├── Output: Design specifications, mockups, color schemes                       │
│  └── Tools: Perplexity AI, design tools, image generation                        │
│                                                                                   │
│  💻 DEVELOPMENT AGENT (BaseAgentPhase)                                           │
│  ├── Input: Design specs, requirements, technical needs                          │
│  ├── Process: Generate code, build components, implement features                │
│  ├── Output: Functional website, source code, deployment package                 │
│  └── Tools: Code generation, component building, testing                         │
│                                                                                   │
│  🚀 DEPLOYMENT AGENT (BaseAgentPhase)                                            │
│  ├── Input: Built website, deployment requirements                               │
│  ├── Process: Deploy to Vercel, configure domain, SSL                           │
│  ├── Output: Live website URL, deployment status                                │
│  └── Tools: Vercel API, domain management, SSL setup                            │
│                                                                                   │
│  📧 NOTIFICATION AGENT (BaseAgentPhase)                                          │
│  ├── Input: Project completion, client details                                   │
│  ├── Process: Send completion emails, update status                             │
│  ├── Output: Client notifications, status updates                                │
│  └── Tools: Email service, status management                                     │
│                                                                                   │
│  🧪 QA AGENT (BaseAgentPhase)                                                    │
│  ├── Input: Built website, quality requirements                                 │
│  ├── Process: Comprehensive testing, performance optimization                     │
│  ├── Output: Test results, optimization recommendations                          │
│  └── Tools: Testing frameworks, performance tools                                │
│                                                                                   │
│  📊 ANALYTICS AGENT (BaseAgentPhase)                                             │
│  ├── Input: Deployed website, analytics requirements                             │
│  ├── Process: Setup Google Analytics, monitoring, tracking                       │
│  ├── Output: Analytics configuration, monitoring setup                           │
│  └── Tools: Google Analytics, monitoring services                                │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### **🎛️ Agent Orchestrator (LangGraph)**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           AGENT ORCHESTRATOR                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  🔄 WORKFLOW SEQUENCE:                                                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   DESIGN    │───►│ DEVELOPMENT │───►│ DEPLOYMENT  │───►│ NOTIFICATION│      │
│  │   AGENT     │    │   AGENT     │    │   AGENT     │    │   AGENT     │      │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                                                   │
│  📋 STATE MANAGEMENT:                                                             │
│  ├── Project requirements & specifications                                        │
│  ├── Design outputs (mockups, wireframes)                                        │
│  ├── Development outputs (code, components)                                      │
│  ├── Deployment outputs (URLs, configurations)                                   │
│  └── Final status & notifications                                                │
│                                                                                   │
│  🔧 FEATURES:                                                                    │
│  ├── Automatic progression through phases                                        │
│  ├── Error handling & retry logic                                                │
│  ├── Real-time status updates                                                    │
│  ├── Parallel processing where possible                                          │
│  └── Checkpointing for workflow recovery                                         │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### **🔌 Backend API Endpoints**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND API ENDPOINTS                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  📋 /api/projects/                                                               │
│  ├── POST: Create project & start workflow                                       │
│  ├── GET: List projects with filters                                             │
│  ├── GET /{id}: Get specific project                                             │
│  ├── PUT /{id}: Update project                                                   │
│  └── DELETE /{id}: Delete project                                                │
│                                                                                   │
│  🔄 /api/projects/{id}/status                                                    │
│  ├── GET: Get project status & agent logs                                        │
│  └── POST: Update project status                                                 │
│                                                                                   │
│  ⚡ /api/projects/{id}/trigger                                                   │
│  └── POST: Manually trigger LangGraph workflow                                   │
│                                                                                   │
│  💳 /api/payments/                                                               │
│  ├── POST /create-intent: Create Stripe PaymentIntent                            │
│  ├── POST /webhook: Handle Stripe webhooks                                       │
│  └── GET /{payment_intent_id}: Get payment status                               │
│                                                                                   │
│  🤖 /api/copilot/                                                                │
│  └── POST: Chat with AI copilot using LangChain tools                           │
│                                                                                   │
│  🔌 /ws/{client_id}                                                              │
│  └── WebSocket: Real-time updates & notifications                               │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 **Data Flow Diagrams**

### **📋 Project Creation Flow**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              PROJECT CREATION FLOW                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  1. CLIENT SUBMISSION:                                                            │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                        │
│     │ Quote Form  │───►│ Payment     │───►│ Project     │                        │
│     │ (Frontend)  │    │ Processing  │    │ Creation    │                        │
│     └─────────────┘    └─────────────┘    └─────────────┘                        │
│                                                                                   │
│  2. BACKEND PROCESSING:                                                           │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                        │
│     │ API Route   │───►│ Database    │───►│ Agent       │                        │
│     │ Handler     │    │ Storage     │    │ Orchestrator│                        │
│     └─────────────┘    └─────────────┘    └─────────────┘                        │
│                                                                                   │
│  3. AI WORKFLOW:                                                                  │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│     │ Design      │───►│ Development │───►│ Deployment  │───►│ Notification│    │
│     │ Agent       │    │ Agent       │    │ Agent       │    │ Agent       │    │
│     └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                                                   │
│  4. COMPLETION:                                                                   │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                        │
│     │ Live Site   │───►│ Client      │───►│ Admin       │                        │
│     │ Generation  │    │ Notification│    │ Dashboard   │                        │
│     └─────────────┘    └─────────────┘    └─────────────┘                        │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### **🎯 Bolt DIY Generation Flow**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              BOLT DIY GENERATION FLOW                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  1. TEMPLATE SELECTION:                                                           │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                        │
│     │ Template    │───►│ Customize   │───►│ Generate    │                        │
│     │ Selection   │    │ Options     │    │ Interface   │                        │
│     └─────────────┘    └─────────────┘    └─────────────┘                        │
│                                                                                   │
│  2. PROMPT GENERATION:                                                            │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                        │
│     │ User Input  │───►│ Professional│───►│ AI          │                        │
│     │ Collection  │    │ Prompt      │    │ Generation  │                        │
│     └─────────────┘    └─────────────┘    └─────────────┘                        │
│                                                                                   │
│  3. AI PROCESSING:                                                                │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                        │
│     │ Requirements│───►│ Code        │───►│ Website     │                        │
│     │ Analysis    │    │ Generation  │    │ Assembly    │                        │
│     └─────────────┘    └─────────────┘    └─────────────┘                        │
│                                                                                   │
│  4. DELIVERY:                                                                     │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                        │
│     │ Preview     │───►│ Download    │───►│ Deploy      │                        │
│     │ Website     │    │ Files       │    │ Live        │                        │
│     └─────────────┘    └─────────────┘    └─────────────┘                        │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🔧 **Technical Stack Integration**

### **🛠️ Frontend Technologies**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND TECH STACK                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  🎨 UI Framework:                                                                │
│  ├── Next.js 14 (App Router)                                                     │
│  ├── TypeScript                                                                   │
│  ├── Tailwind CSS                                                                 │
│  └── shadcn/ui Components                                                        │
│                                                                                   │
│  🔧 State Management:                                                             │
│  ├── React Hooks (useState, useEffect, useRef)                                   │
│  ├── React Hook Form + Zod validation                                            │
│  └── Custom hooks (useToast, etc.)                                               │
│                                                                                   │
│  💳 Payment Integration:                                                          │
│  ├── Stripe (client-side)                                                        │
│  └── Payment intent creation                                                     │
│                                                                                   │
│  🔐 Authentication:                                                               │
│  ├── JWT simulation (admin)                                                      │
│  └── Session management                                                           │
│                                                                                   │
│  📱 Real-time Updates:                                                            │
│  ├── WebSocket connections                                                        │
│  └── Auto-refresh mechanisms                                                      │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### **⚙️ Backend Technologies**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND TECH STACK                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  🚀 API Framework:                                                               │
│  ├── FastAPI (Python 3.11+)                                                      │
│  ├── Pydantic models                                                             │
│  └── Automatic API documentation                                                 │
│                                                                                   │
│  🗄️ Database:                                                                    │
│  ├── PostgreSQL (via Supabase)                                                   │
│  ├── SQLAlchemy ORM                                                              │
│  └── Alembic migrations                                                          │
│                                                                                   │
│  🤖 AI Integration:                                                              │
│  ├── LangChain + LangGraph                                                       │
│  ├── Perplexity AI API                                                           │
│  └── Custom agent orchestration                                                  │
│                                                                                   │
│  💳 Payment Processing:                                                           │
│  ├── Stripe (server-side)                                                        │
│  ├── Webhook handling                                                            │
│  └── Payment intent management                                                   │
│                                                                                   │
│  🔌 Real-time:                                                                   │
│  ├── WebSocket support                                                           │
│  ├── Supabase Realtime                                                           │
│  └── Event-driven architecture                                                   │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 **Agent Communication Flow**

### **📡 Real-time Communication**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              REAL-TIME COMMUNICATION                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  🔄 FRONTEND ◄──► BACKEND:                                                       │
│  ├── WebSocket connections for live updates                                       │
│  ├── API polling for status changes                                              │
│  ├── Event-driven notifications                                                  │
│  └── Auto-refresh mechanisms                                                     │
│                                                                                   │
│  🤖 AGENT ◄──► ORCHESTRATOR:                                                     │
│  ├── LangGraph state management                                                  │
│  ├── Agent-to-agent communication                                                │
│  ├── Progress tracking & logging                                                 │
│  └── Error handling & recovery                                                   │
│                                                                                   │
│  📊 ADMIN ◄──► SYSTEM:                                                           │
│  ├── Real-time project monitoring                                                │
│  ├── Agent status updates                                                        │
│  ├── Performance metrics                                                          │
│  └── System health monitoring                                                    │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 📊 **Data Models & Relationships**

### **🗄️ Database Schema**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  📋 PROJECTS:                                                                     │
│  ├── id (Primary Key)                                                            │
│  ├── business_name                                                                │
│  ├── email                                                                        │
│  ├── status (pending, in_progress, completed, failed)                           │
│  ├── progress (0-100)                                                            │
│  ├── estimated_price                                                             │
│  ├── created_at                                                                   │
│  ├── completed_at                                                                │
│  └── agent (current agent)                                                       │
│                                                                                   │
│  🤖 AGENT_LOGS:                                                                  │
│  ├── id (Primary Key)                                                            │
│  ├── project_id (Foreign Key)                                                    │
│  ├── agent_type (design, development, deployment, notification)                 │
│  ├── status (running, completed, failed)                                         │
│  ├── message                                                                      │
│  ├── created_at                                                                   │
│  └── metadata (JSON)                                                             │
│                                                                                   │
│  💳 PAYMENTS:                                                                     │
│  ├── id (Primary Key)                                                            │
│  ├── project_id (Foreign Key)                                                    │
│  ├── stripe_payment_intent_id                                                    │
│  ├── amount                                                                       │
│  ├── status                                                                       │
│  └── created_at                                                                   │
│                                                                                   │
│  🌐 LIVE_SITES:                                                                   │
│  ├── id (Primary Key)                                                            │
│  ├── project_id (Foreign Key)                                                    │
│  ├── live_site_url                                                               │
│  ├── documentation_url                                                            │
│  ├── deployment_url                                                               │
│  └── created_at                                                                   │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🚀 **Deployment Architecture**

### **🌐 Production Infrastructure**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              DEPLOYMENT ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  🎯 FRONTEND DEPLOYMENT:                                                         │
│  ├── Vercel (Next.js hosting)                                                    │
│  ├── GitHub Actions (CI/CD)                                                      │
│  ├── Automatic deployments on push                                                │
│  └── Custom domain configuration                                                 │
│                                                                                   │
│  ⚙️ BACKEND DEPLOYMENT:                                                           │
│  ├── Render/Railway (FastAPI hosting)                                            │
│  ├── PostgreSQL database (Supabase)                                              │
│  ├── Redis for caching                                                           │
│  └── Environment variable management                                              │
│                                                                                   │
│  🔐 EXTERNAL SERVICES:                                                           │
│  ├── Supabase (Database + Auth)                                                  │
│  ├── Stripe (Payments)                                                           │
│  ├── Perplexity AI (AI processing)                                               │
│  └── Vercel (Website deployment)                                                 │
│                                                                                   │
│  📊 MONITORING:                                                                   │
│  ├── Application performance monitoring                                           │
│  ├── Error tracking & logging                                                     │
│  ├── Uptime monitoring                                                           │
│  └── Analytics & metrics                                                          │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🔧 **Configuration & Environment**

### **⚙️ Environment Variables**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              ENVIRONMENT CONFIGURATION                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  🔐 SECURITY:                                                                    │
│  ├── SECRET_KEY (JWT signing)                                                    │
│  ├── STRIPE_SECRET_KEY (Payment processing)                                      │
│  ├── STRIPE_WEBHOOK_SECRET (Webhook verification)                               │
│  └── PERPLEXITY_API_KEY (AI processing)                                         │
│                                                                                   │
│  🗄️ DATABASE:                                                                    │
│  ├── DATABASE_URL (PostgreSQL connection)                                        │
│  ├── SUPABASE_URL (Supabase configuration)                                       │
│  ├── SUPABASE_ANON_KEY (Client access)                                          │
│  └── SUPABASE_SERVICE_ROLE_KEY (Admin access)                                    │
│                                                                                   │
│  🌐 DEPLOYMENT:                                                                   │
│  ├── NEXT_PUBLIC_BASE_URL (Frontend URL)                                        │
│  ├── CORS_ORIGINS (Allowed domains)                                             │
│  └── ENVIRONMENT (development/production)                                        │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 📈 **Performance & Scalability**

### **⚡ Performance Optimizations**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              PERFORMANCE OPTIMIZATIONS                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  🚀 FRONTEND:                                                                    │
│  ├── Next.js App Router optimization                                             │
│  ├── Component lazy loading                                                      │
│  ├── Image optimization                                                           │
│  └── Bundle size optimization                                                    │
│                                                                                   │
│  ⚙️ BACKEND:                                                                      │
│  ├── Async/await for I/O operations                                             │
│  ├── Database connection pooling                                                 │
│  ├── Redis caching for frequent queries                                         │
│  └── Background task processing                                                  │
│                                                                                   │
│  🤖 AI AGENTS:                                                                   │
│  ├── Parallel agent processing                                                   │
│  ├── Workflow checkpointing                                                      │
│  ├── Error recovery mechanisms                                                   │
│  └── Resource optimization                                                       │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 **Summary**

This comprehensive system architecture shows:

### **🎯 Key Components:**
1. **Frontend**: Next.js with TypeScript, Tailwind CSS, and shadcn/ui
2. **Backend**: FastAPI with LangChain/LangGraph agent orchestration
3. **AI Agents**: 6 specialized agents (Design, Development, Deployment, Notification, QA, Analytics)
4. **Database**: PostgreSQL via Supabase with real-time capabilities
5. **Payments**: Stripe integration for payment processing
6. **Deployment**: Vercel (frontend) + Render/Railway (backend)

### **🔄 Data Flow:**
1. **Client Submission** → **Payment Processing** → **Project Creation**
2. **Agent Orchestration** → **AI Workflow** → **Live Site Generation**
3. **Real-time Updates** → **Admin Monitoring** → **Client Notification**

### **🤖 AI Agent Workflow:**
1. **Design Agent**: Creates mockups and wireframes
2. **Development Agent**: Generates functional code
3. **Deployment Agent**: Deploys to production
4. **Notification Agent**: Sends completion updates
5. **QA Agent**: Comprehensive testing
6. **Analytics Agent**: Setup monitoring

### **📊 Monitoring & Management:**
- **Real-time project tracking**
- **Agent status monitoring**
- **Performance metrics**
- **Error handling & recovery**
- **Admin dashboard for oversight**

This architecture provides a scalable, maintainable, and feature-rich platform for AI-powered web development! 🚀 