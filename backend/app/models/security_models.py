"""
Security Models for Enhanced Wildcard SSL & Subdomain Management
Database schemas and validation models for enterprise-grade security
"""
from pydantic import BaseModel, Field, validator
from typing import Dict, List, Optional, Any
from datetime import datetime
from enum import Enum
import re
import uuid

class SecurityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ThreatType(str, Enum):
    SUBDOMAIN_TAKEOVER = "subdomain_takeover"
    XSS_ATTEMPT = "xss_attempt"
    SQL_INJECTION = "sql_injection"
    PHISHING_ATTEMPT = "phishing_attempt"
    RATE_LIMIT_VIOLATION = "rate_limit_violation"
    SUSPICIOUS_ACTIVITY = "suspicious_activity"

class SecurityAuditLog(BaseModel):
    """Security audit log entry"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    subdomain_id: Optional[str] = None
    event_type: str = Field(..., max_length=100)
    event_description: str
    severity_level: SecurityLevel = SecurityLevel.INFO
    client_ip: str
    created_at: datetime = Field(default_factory=datetime.now)
    threat_type: Optional[ThreatType] = None
    metadata: Optional[Dict[str, Any]] = None

class SubdomainSecurity(BaseModel):
    """Subdomain security configuration"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    user_id: str
    subdomain: str = Field(..., max_length=255)
    security_token: Optional[str] = None
    isolation_level: str = Field(default="standard", max_length=50)
    last_security_audit: Optional[datetime] = None
    security_score: int = Field(default=100, ge=0, le=100)
    ssl_configured: bool = Field(default=False)
    security_headers: Dict[str, str] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @validator('subdomain')
    def validate_subdomain(cls, v):
        """Validate subdomain name for security compliance"""
        if not v:
            raise ValueError('Subdomain name is required')
        
        # Length validation
        if len(v) < 3 or len(v) > 63:
            raise ValueError('Subdomain must be between 3 and 63 characters')
        
        # Format validation (RFC compliant)
        if not re.match(r'^[a-z0-9]([a-z0-9-]*[a-z0-9])?$', v):
            raise ValueError('Subdomain must contain only lowercase letters, numbers, and hyphens')
        
        # Blocked patterns
        blocked_patterns = [
            'admin', 'api', 'www', 'mail', 'ftp', 'ssh', 'telnet',
            'root', 'system', 'config', 'backup', 'test', 'dev',
            'staging', 'beta', 'alpha', 'local', 'localhost',
            'secure', 'login', 'auth', 'oauth', 'payment',
            'bank', 'paypal', 'stripe', 'credit', 'card'
        ]
        
        for pattern in blocked_patterns:
            if pattern in v.lower():
                raise ValueError(f'Subdomain contains blocked pattern: {pattern}')
        
        # Suspicious characters
        suspicious_chars = [
            '--', '/*', '*/', 'union', 'select', 'insert', 'update',
            'delete', 'drop', 'create', 'alter', 'exec', 'eval',
            'script', 'javascript', 'vbscript', 'onload', 'onerror'
        ]
        
        for suspicious in suspicious_chars:
            if suspicious in v.lower():
                raise ValueError(f'Subdomain contains suspicious characters: {suspicious}')
        
        return v

class SecureDeploymentRequest(BaseModel):
    """Secure deployment request model"""
    project_id: str
    business_name: str = Field(..., min_length=2, max_length=100)
    client_ip: str
    security_level: SecurityLevel = SecurityLevel.MEDIUM
    ssl_required: bool = Field(default=True)
    isolation_level: str = Field(default="standard")
    custom_security_headers: Optional[Dict[str, str]] = None

    @validator('business_name')
    def validate_business_name(cls, v):
        """Validate business name for security"""
        if not v or len(v.strip()) < 2:
            raise ValueError('Business name must be at least 2 characters')
        
        # Check for suspicious content
        suspicious_patterns = [
            'script', 'javascript', 'eval', 'exec', 'system',
            'admin', 'root', 'password', 'secret'
        ]
        
        business_lower = v.lower()
        for pattern in suspicious_patterns:
            if pattern in business_lower:
                raise ValueError(f'Business name contains suspicious content: {pattern}')
        
        return v.strip()

class DeploymentStatus(BaseModel):
    """Deployment status model"""
    exists: bool
    subdomain: Optional[str] = None
    full_url: Optional[str] = None
    created_at: Optional[datetime] = None
    security_score: int = Field(default=0, ge=0, le=100)
    ssl_status: Optional[Dict[str, Any]] = None
    security_headers: Dict[str, str] = Field(default_factory=dict)
    uptime: Optional[str] = None
    last_security_audit: Optional[datetime] = None
    error: Optional[str] = None

class SecurityReport(BaseModel):
    """Comprehensive security report model"""
    deployment_metrics: Dict[str, Any]
    security_metrics: Dict[str, Any]
    overall_security_score: int = Field(ge=0, le=100)
    active_alerts: List[Dict[str, Any]] = Field(default_factory=list)
    threat_summary: Dict[str, int] = Field(default_factory=dict)
    recent_events: List[Dict[str, Any]] = Field(default_factory=list)

class SSLConfiguration(BaseModel):
    """SSL configuration model"""
    certificate_domain: str
    subdomain: str
    full_domain: str
    ssl_protocols: List[str] = Field(default_factory=lambda: ['TLSv1.2', 'TLSv1.3'])
    cipher_suite: str = Field(default="ECDHE-RSA-AES256-GCM-SHA384")
    hsts_enabled: bool = Field(default=True)
    hsts_max_age: int = Field(default=31536000)
    include_subdomains: bool = Field(default=True)
    certificate_valid: bool = Field(default=False)
    days_until_expiry: Optional[int] = None
    issuer: Optional[str] = None
    subject: Optional[str] = None

class SecurityHeaders(BaseModel):
    """Security headers configuration"""
    x_frame_options: str = Field(default="DENY")
    x_content_type_options: str = Field(default="nosniff")
    x_xss_protection: str = Field(default="1; mode=block")
    referrer_policy: str = Field(default="strict-origin-when-cross-origin")
    content_security_policy: str = Field(
        default="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;"
    )
    strict_transport_security: str = Field(default="max-age=31536000; includeSubDomains; preload")
    permissions_policy: str = Field(default="geolocation=(), microphone=(), camera=()")
    x_permitted_cross_domain_policies: str = Field(default="none")
    x_download_options: str = Field(default="noopen")
    x_dns_prefetch_control: str = Field(default="off")

    def to_dict(self) -> Dict[str, str]:
        """Convert to dictionary for HTTP headers"""
        return {
            'X-Frame-Options': self.x_frame_options,
            'X-Content-Type-Options': self.x_content_type_options,
            'X-XSS-Protection': self.x_xss_protection,
            'Referrer-Policy': self.referrer_policy,
            'Content-Security-Policy': self.content_security_policy,
            'Strict-Transport-Security': self.strict_transport_security,
            'Permissions-Policy': self.permissions_policy,
            'X-Permitted-Cross-Domain-Policies': self.x_permitted_cross_domain_policies,
            'X-Download-Options': self.x_download_options,
            'X-DNS-Prefetch-Control': self.x_dns_prefetch_control
        }

class RateLimitConfig(BaseModel):
    """Rate limiting configuration"""
    max_calls: int = Field(default=5, ge=1)
    window_seconds: int = Field(default=3600, ge=60)
    burst_limit: int = Field(default=20, ge=1)
    client_ip: str
    current_calls: int = Field(default=0, ge=0)
    last_reset: datetime = Field(default_factory=datetime.now)

class SecurityValidation(BaseModel):
    """Security validation result"""
    valid: bool
    security_score: int = Field(ge=0, le=100)
    security_level: SecurityLevel
    recommendations: List[str] = Field(default_factory=list)
    threat_detected: bool = Field(default=False)
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class EnvironmentIsolation(BaseModel):
    """Environment isolation configuration"""
    isolated_path: str
    security_token: str
    resource_limits: Dict[str, Any] = Field(default_factory=dict)
    security_headers: SecurityHeaders = Field(default_factory=SecurityHeaders)
    access_controls: Dict[str, Any] = Field(default_factory=dict)
    isolation_level: str = Field(default="standard")

# Database schema definitions
SECURITY_AUDIT_LOG_SCHEMA = """
CREATE TABLE IF NOT EXISTS security_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subdomain_id UUID REFERENCES subdomains(id),
    event_type VARCHAR(100) NOT NULL,
    event_description TEXT,
    severity_level VARCHAR(20) DEFAULT 'info',
    client_ip INET,
    threat_type VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
"""

SUBDOMAINS_SCHEMA = """
CREATE TABLE IF NOT EXISTS subdomains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    user_id UUID NOT NULL,
    subdomain VARCHAR(255) UNIQUE NOT NULL,
    security_token VARCHAR(255),
    isolation_level VARCHAR(50) DEFAULT 'standard',
    last_security_audit TIMESTAMP,
    security_score INTEGER DEFAULT 100,
    ssl_configured BOOLEAN DEFAULT FALSE,
    security_headers JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
"""

PROJECTS_SECURITY_SCHEMA = """
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS security_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS deployment_path VARCHAR(500),
ADD COLUMN IF NOT EXISTS security_score INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS ssl_configured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_security_audit TIMESTAMP;
"""

# Indexes for performance
SECURITY_INDEXES = """
CREATE INDEX IF NOT EXISTS idx_security_audit_log_event_type ON security_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_severity ON security_audit_log(severity_level);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_subdomains_security_score ON subdomains(security_score);
CREATE INDEX IF NOT EXISTS idx_subdomains_ssl_configured ON subdomains(ssl_configured);
CREATE INDEX IF NOT EXISTS idx_subdomains_last_audit ON subdomains(last_security_audit);
""" 