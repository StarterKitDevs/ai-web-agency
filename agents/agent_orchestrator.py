"""
Agent Orchestrator - Supervisor class with LangChain/LangGraph integration
"""
import asyncio
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from app.database import get_db, Project, AgentLog
from app.services.supabase_service import supabase_service
from agents.design_agent import design_agent
from agents.dev_agent import dev_agent
from agents.deploy_agent import deploy_agent
from agents.notify_agent import notify_agent

logger = logging.getLogger(__name__)


class AgentOrchestrator:
    """Supervisor class that orchestrates all agents using LangChain/LangGraph"""
    
    def __init__(self):
        self.agents = {
            "design": design_agent,
            "development": dev_agent,
            "deployment": deploy_agent,
            "notification": notify_agent
        }
        
        # Create LangGraph workflow
        self.workflow = self._create_workflow()
    
    def _create_workflow(self) -> StateGraph:
        """Create the LangGraph workflow"""
        workflow = StateGraph(Dict[str, Any])
        
        # Add nodes for each agent phase
        workflow.add_node("design", self._run_design_agent)
        workflow.add_node("development", self._run_development_agent)
        workflow.add_node("deployment", self._run_deployment_agent)
        workflow.add_node("notification", self._run_notification_agent)
        
        # Define the workflow sequence
        workflow.set_entry_point("design")
        workflow.add_edge("design", "development")
        workflow.add_edge("development", "deployment")
        workflow.add_edge("deployment", "notification")
        workflow.add_edge("notification", END)
        
        # Compile the workflow
        return workflow.compile(checkpointer=MemorySaver())
    
    async def _run_design_agent(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Run design agent"""
        project_id = state.get("project_id")
        if not project_id:
            raise Exception("Project ID not found in state")
        
        logger.info(f"Starting design agent for project {project_id}")
        result = await design_agent.execute(project_id, state)
        return result
    
    async def _run_development_agent(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Run development agent"""
        project_id = state.get("project_id")
        if not project_id:
            raise Exception("Project ID not found in state")
        
        logger.info(f"Starting development agent for project {project_id}")
        result = await dev_agent.execute(project_id, state)
        return result
    
    async def _run_deployment_agent(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Run deployment agent"""
        project_id = state.get("project_id")
        if not project_id:
            raise Exception("Project ID not found in state")
        
        logger.info(f"Starting deployment agent for project {project_id}")
        result = await deploy_agent.execute(project_id, state)
        return result
    
    async def _run_notification_agent(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Run notification agent"""
        project_id = state.get("project_id")
        if not project_id:
            raise Exception("Project ID not found in state")
        
        logger.info(f"Starting notification agent for project {project_id}")
        result = await notify_agent.execute(project_id, state)
        return result
    
    async def execute_workflow(self, project_id: int) -> Dict[str, Any]:
        """
        Execute the complete agent workflow for a project
        
        Args:
            project_id: Project ID to process
            
        Returns:
            Final workflow state with all agent outputs
        """
        try:
            # Initialize state
            initial_state = await self._initialize_state(project_id)
            
            # Log workflow start
            await self._log_orchestrator_action(
                project_id, 
                "started", 
                "Agent workflow started",
                {"agents": list(self.agents.keys())}
            )
            
            # Run LangGraph workflow
            config = RunnableConfig(recursion_limit=25)
            final_state = await self.workflow.ainvoke(initial_state, config)
            
            # Update project status
            await self._update_project_status(project_id, final_state)
            
            # Log workflow completion
            await self._log_orchestrator_action(
                project_id, 
                "completed", 
                "Agent workflow completed successfully",
                {
                    "completed_agents": self._get_completed_agents(final_state),
                    "final_status": final_state.get("project_status", "unknown")
                }
            )
            
            return final_state
            
        except Exception as e:
            error_msg = f"Agent workflow failed: {str(e)}"
            logger.error(error_msg)
            await self._log_orchestrator_action(project_id, "failed", error_msg, {"error": str(e)})
            return {"error": str(e), "project_id": project_id}
    
    async def _initialize_state(self, project_id: int) -> Dict[str, Any]:
        """Initialize workflow state"""
        try:
            db = next(get_db())
            project = db.query(Project).filter(Project.id == project_id).first()
            
            if not project:
                raise Exception(f"Project {project_id} not found")
            
            # Update project status to in_progress
            project.status = "in_progress"
            db.commit()
            
            return {
                "project_id": project_id,
                "project_data": {
                    "business_name": project.business_name,
                    "email": project.email,
                    "website_type": project.website_type,
                    "features": project.features,
                    "design_style": project.design_style,
                    "budget": project.budget,
                    "estimated_price": project.estimated_price
                },
                "workflow_started_at": datetime.utcnow().isoformat(),
                "completed_agents": [],
                "errors": [],
                "project_status": "in_progress"
            }
            
        except Exception as e:
            logger.error(f"Error initializing state for project {project_id}: {e}")
            raise
    
    async def _update_project_status(self, project_id: int, final_state: Dict[str, Any]):
        """Update project status based on workflow completion"""
        try:
            db = next(get_db())
            project = db.query(Project).filter(Project.id == project_id).first()
            
            if project:
                if final_state.get("error"):
                    project.status = "failed"
                else:
                    project.status = "completed"
                    # Update with deployment URL if available
                    live_url = final_state.get("live_url")
                    if live_url:
                        project.download_url = live_url
                
                db.commit()
                logger.info(f"Updated project {project_id} status to {project.status}")
                
        except Exception as e:
            logger.error(f"Error updating project status: {e}")
    
    def _get_completed_agents(self, final_state: Dict[str, Any]) -> List[str]:
        """Get list of completed agents from final state"""
        completed = []
        agent_checks = [
            ("design_completed", "design"),
            ("development_completed", "development"),
            ("deployment_completed", "deployment"),
            ("notification_completed", "notification")
        ]
        
        for check, agent_name in agent_checks:
            if final_state.get(check):
                completed.append(agent_name)
        
        return completed
    
    async def _log_orchestrator_action(self, project_id: int, status: str, message: str, metadata: Optional[Dict[str, Any]] = None):
        """Log orchestrator action to database"""
        try:
            db = next(get_db())
            agent_log = AgentLog(
                project_id=project_id,
                agent_type="orchestrator",
                status=status,
                message=message,
                metadata=metadata
            )
            db.add(agent_log)
            db.commit()
            logger.info(f"Logged orchestrator action: {status} for project {project_id}")
        except Exception as e:
            logger.error(f"Error logging orchestrator action: {e}")
    
    async def get_workflow_status(self, project_id: int) -> Dict[str, Any]:
        """
        Get current workflow status for a project
        
        Args:
            project_id: Project ID
            
        Returns:
            Workflow status information
        """
        try:
            db = next(get_db())
            
            # Get project
            project = db.query(Project).filter(Project.id == project_id).first()
            if not project:
                return {"error": "Project not found"}
            
            # Get agent logs
            agent_logs = db.query(AgentLog).filter(AgentLog.project_id == project_id).order_by(AgentLog.created_at.desc()).all()
            
            # Calculate progress
            total_agents = len(self.agents)
            completed_agents = len([log for log in agent_logs if log.status == "completed" and log.agent_type in self.agents])
            progress_percentage = int((completed_agents / total_agents) * 100) if total_agents > 0 else 0
            
            # Get current agent
            current_agent = None
            if project.status == "in_progress":
                for log in reversed(agent_logs):
                    if log.status == "started" and log.agent_type in self.agents:
                        current_agent = log.agent_type
                        break
            
            return {
                "project_id": project_id,
                "status": project.status,
                "progress_percentage": progress_percentage,
                "current_agent": current_agent,
                "completed_agents": completed_agents,
                "total_agents": total_agents,
                "agent_logs": [
                    {
                        "agent_type": log.agent_type,
                        "status": log.status,
                        "message": log.message,
                        "timestamp": log.created_at.isoformat(),
                        "metadata": log.metadata
                    }
                    for log in agent_logs
                ]
            }
            
        except Exception as e:
            logger.error(f"Error getting workflow status: {e}")
            return {"error": str(e)}
    
    async def add_custom_agent(self, agent_name: str, agent_instance):
        """
        Add a custom agent to the workflow
        
        Args:
            agent_name: Name of the agent
            agent_instance: Agent instance with execute method
        """
        try:
            self.agents[agent_name] = agent_instance
            logger.info(f"Added custom agent: {agent_name}")
        except Exception as e:
            logger.error(f"Error adding custom agent: {e}")
    
    async def trigger_agent_workflow(self, project_id: int) -> Dict[str, Any]:
        """
        Trigger the agent workflow for a project
        This is the main entry point called by the API
        
        Args:
            project_id: Project ID to process
            
        Returns:
            Workflow execution result
        """
        try:
            # Check if project exists and is ready for workflow
            db = next(get_db())
            project = db.query(Project).filter(Project.id == project_id).first()
            
            if not project:
                return {"error": "Project not found"}
            
            if project.status == "pending":
                return {"error": "Project must be paid before starting workflow"}
            
            if project.status == "in_progress":
                return {"error": "Workflow already in progress"}
            
            # Start workflow asynchronously
            asyncio.create_task(self.execute_workflow(project_id))
            
            return {
                "message": f"Agent workflow started for project {project_id}",
                "project_id": project_id,
                "status": "workflow_started",
                "agents": list(self.agents.keys())
            }
            
        except Exception as e:
            logger.error(f"Error triggering workflow: {e}")
            return {"error": str(e)}


# Create global orchestrator instance
agent_orchestrator = AgentOrchestrator() 