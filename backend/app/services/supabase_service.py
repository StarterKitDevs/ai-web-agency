"""
Supabase service for authentication and user management
"""
from supabase import create_client, Client
from typing import Optional, Dict, Any
import logging

from app.config import settings

logger = logging.getLogger(__name__)


class SupabaseService:
    """Service for interacting with Supabase"""
    
    def __init__(self):
        """Initialize Supabase client"""
        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key
        )
    
    async def create_user(self, email: str, project_id: int) -> Optional[str]:
        """
        Create a new user in Supabase with magic link authentication
        
        Args:
            email: User's email address
            project_id: Associated project ID
            
        Returns:
            User ID if successful, None otherwise
        """
        try:
            # Create user with magic link
            response = self.client.auth.admin.create_user({
                "email": email,
                "email_confirm": True,
                "user_metadata": {
                    "project_id": project_id,
                    "source": "ai_web_agency"
                }
            })
            
            user_id = response.user.id if response.user else None
            
            if user_id:
                # Send magic link email
                self.client.auth.admin.generate_link({
                    "type": "magiclink",
                    "email": email
                })
                
                logger.info(f"Created Supabase user {user_id} for project {project_id}")
                return user_id
            
        except Exception as e:
            logger.error(f"Error creating Supabase user: {e}")
            return None
    
    async def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user information from Supabase
        
        Args:
            user_id: Supabase user ID
            
        Returns:
            User data if found, None otherwise
        """
        try:
            response = self.client.auth.admin.get_user_by_id(user_id)
            return response.user.dict() if response.user else None
        except Exception as e:
            logger.error(f"Error getting Supabase user {user_id}: {e}")
            return None
    
    async def update_user_metadata(self, user_id: str, metadata: Dict[str, Any]) -> bool:
        """
        Update user metadata in Supabase
        
        Args:
            user_id: Supabase user ID
            metadata: Metadata to update
            
        Returns:
            True if successful, False otherwise
        """
        try:
            self.client.auth.admin.update_user_by_id(
                user_id,
                {"user_metadata": metadata}
            )
            return True
        except Exception as e:
            logger.error(f"Error updating user metadata: {e}")
            return False
    
    async def validate_jwt(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Validate JWT token from Supabase
        
        Args:
            token: JWT token to validate
            
        Returns:
            Token payload if valid, None otherwise
        """
        try:
            response = self.client.auth.get_user(token)
            return response.user.dict() if response.user else None
        except Exception as e:
            logger.error(f"Error validating JWT: {e}")
            return None


# Create global instance
supabase_service = SupabaseService() 