"""
Configuration settings for the AI Web Agency Backend
"""
from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database Configuration
    database_url: str = "postgresql://user:password@localhost:5432/ai_web_agency"
    redis_url: str = "redis://localhost:6379"
    
    # Supabase Configuration
    supabase_url: str = "https://xxzieezklzehlhizphkj.supabase.co"
    supabase_service_role_key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    
    # Stripe Configuration
    stripe_secret_key: str = "sk_test_your_stripe_secret_key_here"
    stripe_webhook_secret: str = "whsec_your_webhook_secret_here"
    
    # AI/Perplexity Configuration
    perplexity_api_key: str = "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"
    
    # Security
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Application Settings
    debug: bool = True
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Create settings instance
settings = Settings() 