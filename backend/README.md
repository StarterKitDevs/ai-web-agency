# AI Web Agency Backend

A production-ready FastAPI backend for an AI-powered web agency platform with Stripe payments, Supabase authentication, and AI agent orchestration using LangChain and LangGraph.

## Features

- 🚀 **FastAPI** - High-performance async web framework
- 💳 **Stripe Integration** - Secure payment processing
- 🔐 **Supabase Auth** - User authentication and management
- 🤖 **AI Agent Workflow** - LangChain/LangGraph orchestrated agents
- 💬 **AI Copilot** - Perplexity AI-powered chatbot with LangChain tools
- 📊 **Real-time Updates** - WebSocket connections for live updates
- 🗄️ **PostgreSQL** - Robust database with SQLAlchemy ORM
- 🔄 **Redis** - Caching and session management
- 🐳 **Docker** - Containerized deployment
- 📝 **Auto-generated Docs** - Interactive API documentation
- 🔗 **LangChain Integration** - Modern AI workflow orchestration
- 📈 **LangGraph Workflows** - Stateful agent coordination

## Tech Stack

- **Framework**: FastAPI 0.104.1
- **Language**: Python 3.11+
- **Database**: PostgreSQL with SQLAlchemy
- **Cache**: Redis
- **Payments**: Stripe
- **Auth**: Supabase
- **AI**: Perplexity API with LangChain tools
- **Workflow**: LangGraph for agent orchestration
- **Deployment**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (for local development)
- Redis (for local development)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Update environment variables**
   ```bash
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/ai_web_agency
   REDIS_URL=redis://localhost:6379

   # Supabase
   SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Stripe
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

   # AI/Perplexity
   PERPLEXITY_API_KEY=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

   # Security
   SECRET_KEY=your-secret-key-here
   ```

### Development Setup

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Or run locally**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up postgres redis -d

   # Run the API
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Access the API**
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs
   - Health: http://localhost:8000/health

## API Endpoints

### Projects

- `POST /api/projects/` - Create a new project
- `GET /api/projects/` - List all projects
- `GET /api/projects/{id}/status` - Get project status and agent logs
- `POST /api/projects/{id}/trigger` - Manually trigger LangGraph workflow

### Payments

- `POST /api/payments/create-intent` - Create Stripe PaymentIntent
- `POST /api/payments/webhook` - Stripe webhook handler
- `GET /api/payments/{payment_intent_id}` - Get payment status

### Copilot

- `POST /api/copilot/` - Chat with AI copilot using LangChain tools

### WebSocket

- `WS /ws/{client_id}` - Real-time updates

## LangGraph Agent Workflow

The backend uses LangGraph to orchestrate AI agents in sequence:

1. **Design Agent** - Creates design mockups with AI assistance
2. **Development Agent** - Builds the website with technical planning
3. **QA Agent** - Comprehensive testing and quality assurance
4. **Deployment Agent** - Deploys to production
5. **Analytics Agent** - Sets up monitoring and analytics
6. **Notification Agent** - Sends completion notifications

### Workflow Features

- **State Management**: LangGraph maintains workflow state between phases
- **Error Handling**: Graceful error handling with detailed logging
- **AI Integration**: Each agent uses Perplexity AI for intelligent decision-making
- **Extensible**: Easy to add new agent phases (see examples below)
- **Real-time Updates**: WebSocket broadcasting of agent progress

### Workflow Triggers

- **Automatic**: Triggered by successful Stripe payment
- **Manual**: Admin can trigger via API endpoint

## Adding New Agent Phases

### Example: SEO Agent

```python
class SEOAgent(BaseAgentPhase):
    """SEO agent phase"""
    
    def __init__(self):
        super().__init__("seo")
    
    async def _run_phase(self, state: WorkflowState) -> AgentPhaseOutput:
        # Your SEO logic here
        seo_prompt = f"Create SEO recommendations for {project.website_type}"
        seo_response = await self.perplexity_tool._arun(seo_prompt)
        
        return AgentPhaseOutput(
            success=True,
            message="SEO optimization completed",
            metadata={"seo_recommendations": seo_response}
        )
```

### Integration Steps

1. **Create Agent Class**: Extend `BaseAgentPhase`
2. **Add to Workflow**: Update `WorkflowOrchestrator`
3. **Update Progress**: Modify progress calculation
4. **Test**: Verify agent integration

See `app/examples/add_new_agent.py` for complete examples.

## Database Schema

### Projects Table
```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website_type VARCHAR(100) NOT NULL,
    features JSON NOT NULL,
    design_style VARCHAR(100) NOT NULL,
    budget INTEGER NOT NULL,
    estimated_price INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    stripe_payment_intent_id VARCHAR(255),
    supabase_user_id VARCHAR(255),
    download_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Agent Logs Table
```sql
CREATE TABLE agent_logs (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    agent_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    message TEXT,
    error TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Payments Table
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    stripe_payment_intent_id VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black app/
isort app/
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## Deployment

### Docker Deployment
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Production Considerations

1. **Environment Variables**
   - Use production Stripe keys
   - Set strong SECRET_KEY
   - Configure production database URL

2. **Security**
   - Enable HTTPS
   - Configure CORS properly
   - Use environment variables for secrets

3. **Monitoring**
   - Add logging to external service
   - Set up health checks
   - Monitor agent performance

4. **Scaling**
   - Use connection pooling
   - Implement caching strategies
   - Consider message queues for agents

## API Documentation

### Interactive Docs
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Example Requests

#### Create Project
```bash
curl -X POST "http://localhost:8000/api/projects/" \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "TechCorp",
    "email": "contact@techcorp.com",
    "website_type": "business",
    "features": ["responsive", "seo", "analytics"],
    "design_style": "modern",
    "budget": 300,
    "estimated_price": 275
  }'
```

#### Create Payment Intent
```bash
curl -X POST "http://localhost:8000/api/payments/create-intent" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "amount": 27500
  }'
```

#### Chat with Copilot
```bash
curl -X POST "http://localhost:8000/api/copilot/" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the status of my project?",
    "project_id": 1
  }'
```

#### Trigger LangGraph Workflow
```bash
curl -X POST "http://localhost:8000/api/projects/1/trigger" \
  -H "Content-Type: application/json"
```

## Troubleshooting

### Common Issues

1. **Database Connection**
   - Check PostgreSQL is running
   - Verify DATABASE_URL format
   - Ensure database exists

2. **Stripe Integration**
   - Verify API keys are correct
   - Check webhook endpoint configuration
   - Test with Stripe CLI

3. **Supabase Auth**
   - Verify service role key
   - Check Supabase project settings
   - Test user creation manually

4. **LangGraph Workflow**
   - Check agent logs in database
   - Verify project status updates
   - Monitor WebSocket connections

5. **LangChain Dependencies**
   - Ensure all LangChain packages are installed
   - Check Perplexity API key configuration
   - Verify tool integration

### Logs
```bash
# View application logs
docker-compose logs api

# View database logs
docker-compose logs postgres

# View Redis logs
docker-compose logs redis
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details 