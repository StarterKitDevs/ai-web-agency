"""
Pydantic models for API request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class WebsiteType(str, Enum):
    """Website type options"""
    LANDING = "landing"
    BUSINESS = "business"
    ECOMMERCE = "ecommerce"
    BLOG = "blog"
    PORTFOLIO = "portfolio"
    CUSTOM = "custom"


class DesignStyle(str, Enum):
    """Design style options"""
    MODERN = "modern"
    MINIMAL = "minimal"
    BOLD = "bold"
    CORPORATE = "corporate"
    CREATIVE = "creative"
    VINTAGE = "vintage"


class ProjectStatus(str, Enum):
    """Project status options"""
    PENDING = "pending"
    PAID = "paid"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class AgentType(str, Enum):
    """Agent type options"""
    DESIGN = "design"
    DEVELOPMENT = "development"
    DEPLOYMENT = "deployment"
    NOTIFICATION = "notification"
    QA = "qa"
    ANALYTICS = "analytics"


class AgentStatus(str, Enum):
    """Agent status options"""
    STARTED = "started"
    COMPLETED = "completed"
    FAILED = "failed"


# Request Models
class ProjectCreateRequest(BaseModel):
    """Request model for creating a new project"""
    business_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    website_type: WebsiteType
    features: List[str] = Field(..., min_items=1)
    design_style: DesignStyle
    budget: int = Field(..., ge=150, le=500)
    estimated_price: int = Field(..., ge=150, le=500)


class PaymentIntentRequest(BaseModel):
    """Request model for creating payment intent"""
    project_id: int
    amount: int = Field(..., gt=0)  # Amount in cents


class CopilotRequest(BaseModel):
    """Request model for copilot chat"""
    message: str = Field(..., min_length=1, max_length=1000)
    project_id: Optional[int] = None
    context: Optional[Dict[str, Any]] = None


# Response Models
class ProjectResponse(BaseModel):
    """Response model for project data"""
    id: int
    business_name: str
    email: str
    website_type: str
    features: List[str]
    design_style: str
    budget: int
    estimated_price: int
    status: str
    stripe_payment_intent_id: Optional[str]
    supabase_user_id: Optional[str]
    download_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PaymentIntentResponse(BaseModel):
    """Response model for payment intent"""
    client_secret: str
    payment_intent_id: str


class AgentLogResponse(BaseModel):
    """Response model for agent logs"""
    id: int
    project_id: int
    agent_type: str
    status: str
    message: Optional[str]
    error: Optional[str]
    metadata: Optional[Dict[str, Any]]
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProjectStatusResponse(BaseModel):
    """Response model for project status"""
    project: ProjectResponse
    agent_logs: List[AgentLogResponse]
    current_agent: Optional[str]
    progress_percentage: int


class CopilotResponse(BaseModel):
    """Response model for copilot chat"""
    response: str
    suggestions: List[str] = Field(..., max_items=3)


class WebSocketMessage(BaseModel):
    """WebSocket message model"""
    type: str  # project_update, agent_log, payment_status
    data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# LangGraph State Models
class WorkflowState(BaseModel):
    """State model for LangGraph workflow"""
    project_id: int
    current_phase: str
    completed_phases: List[str] = []
    phase_outputs: Dict[str, Any] = {}
    errors: List[str] = []
    final_status: Optional[str] = None
    
    class Config:
        arbitrary_types_allowed = True


class AgentPhaseOutput(BaseModel):
    """Output model for agent phases"""
    success: bool
    message: str
    metadata: Dict[str, Any] = {}
    error: Optional[str] = None 