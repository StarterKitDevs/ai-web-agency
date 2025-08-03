"""
Agent service for orchestrating AI agent workflow
"""
import asyncio
from typing import Optional, Dict, Any, List
import logging
from datetime import datetime
import json

from app.database import get_db, Project, AgentLog
from app.models import AgentType, AgentStatus
from app.services.supabase_service import supabase_service

logger = logging.getLogger(__name__)


class AgentService:
    """Service for orchestrating AI agent workflow"""
    
    def __init__(self):
        """Initialize agent service"""
        self.agents = {
            AgentType.DESIGN: self._design_agent,
            AgentType.DEVELOPMENT: self._development_agent,
            AgentType.DEPLOYMENT: self._deployment_agent,
            AgentType.NOTIFICATION: self._notification_agent
        }
    
    async def start_workflow(self, project_id: int) -> bool:
        """
        Start the agent workflow for a project
        
        Args:
            project_id: Project ID to process
            
        Returns:
            True if workflow started successfully, False otherwise
        """
        try:
            # Get database session
            db = next(get_db())
            
            # Get project
            project = db.query(Project).filter(Project.id == project_id).first()
            if not project:
                logger.error(f"Project {project_id} not found")
                return False
            
            # Update project status
            project.status = "in_progress"
            db.commit()
            
            # Start workflow asynchronously
            asyncio.create_task(self._run_workflow(project_id))
            
            logger.info(f"Started workflow for project {project_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error starting workflow for project {project_id}: {e}")
            return False
    
    async def _run_workflow(self, project_id: int):
        """
        Run the complete agent workflow
        
        Args:
            project_id: Project ID to process
        """
        try:
            db = next(get_db())
            
            # Run agents in sequence
            for agent_type in [AgentType.DESIGN, AgentType.DEVELOPMENT, AgentType.DEPLOYMENT, AgentType.NOTIFICATION]:
                success = await self._run_agent(project_id, agent_type, db)
                if not success:
                    logger.error(f"Agent {agent_type} failed for project {project_id}")
                    break
                
                # Small delay between agents
                await asyncio.sleep(2)
            
            # Update project status to completed
            project = db.query(Project).filter(Project.id == project_id).first()
            if project:
                project.status = "completed"
                project.download_url = f"https://example.com/downloads/project-{project_id}.zip"
                db.commit()
                
                # Log completion
                await self._log_agent_action(project_id, AgentType.NOTIFICATION, AgentStatus.COMPLETED, 
                                           "Project completed successfully", db)
            
        except Exception as e:
            logger.error(f"Error in workflow for project {project_id}: {e}")
            await self._log_agent_action(project_id, "workflow", AgentStatus.FAILED, 
                                       f"Workflow failed: {str(e)}", db)
    
    async def _run_agent(self, project_id: int, agent_type: AgentType, db) -> bool:
        """
        Run a specific agent
        
        Args:
            project_id: Project ID
            agent_type: Type of agent to run
            db: Database session
            
        Returns:
            True if agent succeeded, False otherwise
        """
        try:
            # Log agent start
            await self._log_agent_action(project_id, agent_type, AgentStatus.STARTED, 
                                       f"Started {agent_type} agent", db)
            
            # Run the agent
            agent_func = self.agents.get(agent_type)
            if agent_func:
                result = await agent_func(project_id, db)
                
                if result:
                    await self._log_agent_action(project_id, agent_type, AgentStatus.COMPLETED, 
                                               f"Completed {agent_type} agent", db)
                    return True
                else:
                    await self._log_agent_action(project_id, agent_type, AgentStatus.FAILED, 
                                               f"Failed {agent_type} agent", db)
                    return False
            else:
                logger.error(f"Unknown agent type: {agent_type}")
                return False
                
        except Exception as e:
            logger.error(f"Error running agent {agent_type} for project {project_id}: {e}")
            await self._log_agent_action(project_id, agent_type, AgentStatus.FAILED, 
                                       f"Agent error: {str(e)}", db)
            return False
    
    async def _design_agent(self, project_id: int, db) -> bool:
        """
        Design agent - creates design mockups
        
        Args:
            project_id: Project ID
            db: Database session
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Simulate design work
            await asyncio.sleep(5)  # Simulate processing time
            
            # Get project details
            project = db.query(Project).filter(Project.id == project_id).first()
            if not project:
                return False
            
            # Log design work
            metadata = {
                "design_style": project.design_style,
                "features": project.features,
                "mockups_created": 3,
                "design_system": "created"
            }
            
            await self._log_agent_action(project_id, AgentType.DESIGN, AgentStatus.COMPLETED, 
                                       "Design mockups created", db, metadata)
            
            return True
            
        except Exception as e:
            logger.error(f"Design agent error: {e}")
            return False
    
    async def _development_agent(self, project_id: int, db) -> bool:
        """
        Development agent - builds the website
        
        Args:
            project_id: Project ID
            db: Database session
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Simulate development work
            await asyncio.sleep(10)  # Simulate processing time
            
            # Get project details
            project = db.query(Project).filter(Project.id == project_id).first()
            if not project:
                return False
            
            # Log development work
            metadata = {
                "website_type": project.website_type,
                "features_implemented": project.features,
                "pages_created": 5,
                "responsive_design": True
            }
            
            await self._log_agent_action(project_id, AgentType.DEVELOPMENT, AgentStatus.COMPLETED, 
                                       "Website development completed", db, metadata)
            
            return True
            
        except Exception as e:
            logger.error(f"Development agent error: {e}")
            return False
    
    async def _deployment_agent(self, project_id: int, db) -> bool:
        """
        Deployment agent - deploys the website
        
        Args:
            project_id: Project ID
            db: Database session
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Simulate deployment work
            await asyncio.sleep(3)  # Simulate processing time
            
            # Log deployment work
            metadata = {
                "deployment_url": f"https://project-{project_id}.aiwebagency.com",
                "ssl_certificate": "installed",
                "cdn_configured": True
            }
            
            await self._log_agent_action(project_id, AgentType.DEPLOYMENT, AgentStatus.COMPLETED, 
                                       "Website deployed successfully", db, metadata)
            
            return True
            
        except Exception as e:
            logger.error(f"Deployment agent error: {e}")
            return False
    
    async def _notification_agent(self, project_id: int, db) -> bool:
        """
        Notification agent - sends notifications
        
        Args:
            project_id: Project ID
            db: Database session
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Get project details
            project = db.query(Project).filter(Project.id == project_id).first()
            if not project:
                return False
            
            # Send email notification
            if project.supabase_user_id:
                # Update user metadata
                await supabase_service.update_user_metadata(
                    project.supabase_user_id,
                    {"project_status": "completed", "download_ready": True}
                )
            
            # Log notification work
            metadata = {
                "email_sent": True,
                "notification_type": "completion",
                "recipient": project.email
            }
            
            await self._log_agent_action(project_id, AgentType.NOTIFICATION, AgentStatus.COMPLETED, 
                                       "Completion notification sent", db, metadata)
            
            return True
            
        except Exception as e:
            logger.error(f"Notification agent error: {e}")
            return False
    
    async def _log_agent_action(self, project_id: int, agent_type: str, status: str, 
                               message: str, db, metadata: Optional[Dict[str, Any]] = None):
        """
        Log agent action to database
        
        Args:
            project_id: Project ID
            agent_type: Type of agent
            status: Action status
            message: Log message
            db: Database session
            metadata: Additional metadata
        """
        try:
            agent_log = AgentLog(
                project_id=project_id,
                agent_type=agent_type,
                status=status,
                message=message,
                metadata=metadata
            )
            
            db.add(agent_log)
            db.commit()
            
            logger.info(f"Logged agent action: {agent_type} - {status} for project {project_id}")
            
        except Exception as e:
            logger.error(f"Error logging agent action: {e}")


# Create global instance
agent_service = AgentService() 