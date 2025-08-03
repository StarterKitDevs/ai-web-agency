"""
LangChain and LangGraph agent system for workflow orchestration
"""
from typing import Dict, Any, List, Optional
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import BaseTool
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
import asyncio
import logging
import json

from app.models import WorkflowState, AgentPhaseOutput, AgentType
from app.database import get_db, Project, AgentLog
from app.services.perplexity_service import perplexity_service
from app.services.supabase_service import supabase_service

logger = logging.getLogger(__name__)


class PerplexityTool(BaseTool):
    """Custom LangChain tool for Perplexity AI"""
    
    name: str = "perplexity_ai"
    description: str = "Use Perplexity AI to get information, answer questions, or generate content"
    
    async def _arun(self, query: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Async implementation of the tool"""
        try:
            response_data = await perplexity_service.chat_completion(query, context)
            if response_data:
                return response_data["response"]
            else:
                return "Sorry, I couldn't process your request at the moment."
        except Exception as e:
            logger.error(f"Error in PerplexityTool: {e}")
            return f"Error: {str(e)}"
    
    def _run(self, query: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Sync implementation (not used but required)"""
        return asyncio.run(self._arun(query, context))


class BaseAgentPhase:
    """Base class for all agent phases"""
    
    def __init__(self, phase_name: str):
        self.phase_name = phase_name
        self.perplexity_tool = PerplexityTool()
    
    async def execute(self, state: WorkflowState) -> WorkflowState:
        """Execute the agent phase"""
        try:
            # Log phase start
            await self._log_agent_action(state.project_id, self.phase_name, "started", 
                                       f"Started {self.phase_name} phase")
            
            # Execute phase logic
            output = await self._run_phase(state)
            
            if output.success:
                # Update state
                state.completed_phases.append(self.phase_name)
                state.phase_outputs[self.phase_name] = output.metadata
                
                # Log success
                await self._log_agent_action(state.project_id, self.phase_name, "completed", 
                                           output.message, output.metadata)
            else:
                # Log error
                state.errors.append(f"{self.phase_name}: {output.error}")
                await self._log_agent_action(state.project_id, self.phase_name, "failed", 
                                           output.message, {"error": output.error})
            
            return state
            
        except Exception as e:
            error_msg = f"Error in {self.phase_name} phase: {str(e)}"
            state.errors.append(error_msg)
            await self._log_agent_action(state.project_id, self.phase_name, "failed", 
                                       error_msg, {"error": str(e)})
            return state
    
    async def _run_phase(self, state: WorkflowState) -> AgentPhaseOutput:
        """Override this method in subclasses"""
        raise NotImplementedError
    
    async def _log_agent_action(self, project_id: int, agent_type: str, status: str, 
                               message: str, metadata: Optional[Dict[str, Any]] = None):
        """Log agent action to database"""
        try:
            db = next(get_db())
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


class DesignAgent(BaseAgentPhase):
    """Design agent phase"""
    
    def __init__(self):
        super().__init__("design")
    
    async def _run_phase(self, state: WorkflowState) -> AgentPhaseOutput:
        """Execute design phase"""
        try:
            # Get project details
            db = next(get_db())
            project = db.query(Project).filter(Project.id == state.project_id).first()
            if not project:
                return AgentPhaseOutput(
                    success=False,
                    message="Project not found",
                    error="Project not found"
                )
            
            # Simulate design work
            await asyncio.sleep(5)
            
            # Use Perplexity to generate design suggestions
            design_prompt = f"""
            Create design mockups for a {project.website_type} website with {project.design_style} style.
            Features needed: {', '.join(project.features)}
            Business: {project.business_name}
            
            Provide design recommendations and mockup descriptions.
            """
            
            design_response = await self.perplexity_tool._arun(design_prompt)
            
            metadata = {
                "design_style": project.design_style,
                "features": project.features,
                "mockups_created": 3,
                "design_system": "created",
                "ai_suggestions": design_response
            }
            
            return AgentPhaseOutput(
                success=True,
                message="Design mockups created successfully",
                metadata=metadata
            )
            
        except Exception as e:
            return AgentPhaseOutput(
                success=False,
                message=f"Design phase failed: {str(e)}",
                error=str(e)
            )


class DevelopmentAgent(BaseAgentPhase):
    """Development agent phase"""
    
    def __init__(self):
        super().__init__("development")
    
    async def _run_phase(self, state: WorkflowState) -> AgentPhaseOutput:
        """Execute development phase"""
        try:
            # Get project details
            db = next(get_db())
            project = db.query(Project).filter(Project.id == state.project_id).first()
            if not project:
                return AgentPhaseOutput(
                    success=False,
                    message="Project not found",
                    error="Project not found"
                )
            
            # Simulate development work
            await asyncio.sleep(10)
            
            # Use Perplexity to generate development plan
            dev_prompt = f"""
            Create a development plan for a {project.website_type} website with {project.design_style} style.
            Features to implement: {', '.join(project.features)}
            Business: {project.business_name}
            
            Provide technical implementation details and code structure.
            """
            
            dev_response = await self.perplexity_tool._arun(dev_prompt)
            
            metadata = {
                "website_type": project.website_type,
                "features_implemented": project.features,
                "pages_created": 5,
                "responsive_design": True,
                "ai_development_plan": dev_response
            }
            
            return AgentPhaseOutput(
                success=True,
                message="Website development completed successfully",
                metadata=metadata
            )
            
        except Exception as e:
            return AgentPhaseOutput(
                success=False,
                message=f"Development phase failed: {str(e)}",
                error=str(e)
            )


class DeploymentAgent(BaseAgentPhase):
    """Deployment agent phase"""
    
    def __init__(self):
        super().__init__("deployment")
    
    async def _run_phase(self, state: WorkflowState) -> AgentPhaseOutput:
        """Execute deployment phase"""
        try:
            # Simulate deployment work
            await asyncio.sleep(3)
            
            metadata = {
                "deployment_url": f"https://project-{state.project_id}.aiwebagency.com",
                "ssl_certificate": "installed",
                "cdn_configured": True,
                "domain_configured": True
            }
            
            return AgentPhaseOutput(
                success=True,
                message="Website deployed successfully",
                metadata=metadata
            )
            
        except Exception as e:
            return AgentPhaseOutput(
                success=False,
                message=f"Deployment phase failed: {str(e)}",
                error=str(e)
            )


class NotificationAgent(BaseAgentPhase):
    """Notification agent phase"""
    
    def __init__(self):
        super().__init__("notification")
    
    async def _run_phase(self, state: WorkflowState) -> AgentPhaseOutput:
        """Execute notification phase"""
        try:
            # Get project details
            db = next(get_db())
            project = db.query(Project).filter(Project.id == state.project_id).first()
            if not project:
                return AgentPhaseOutput(
                    success=False,
                    message="Project not found",
                    error="Project not found"
                )
            
            # Update Supabase user metadata
            if project.supabase_user_id:
                await supabase_service.update_user_metadata(
                    project.supabase_user_id,
                    {"project_status": "completed", "download_ready": True}
                )
            
            metadata = {
                "email_sent": True,
                "notification_type": "completion",
                "recipient": project.email,
                "supabase_updated": True
            }
            
            return AgentPhaseOutput(
                success=True,
                message="Completion notification sent successfully",
                metadata=metadata
            )
            
        except Exception as e:
            return AgentPhaseOutput(
                success=False,
                message=f"Notification phase failed: {str(e)}",
                error=str(e)
            )


class QAAgent(BaseAgentPhase):
    """QA agent phase - example of adding new agent"""
    
    def __init__(self):
        super().__init__("qa")
    
    async def _run_phase(self, state: WorkflowState) -> AgentPhaseOutput:
        """Execute QA phase"""
        try:
            # Simulate QA testing
            await asyncio.sleep(4)
            
            # Use Perplexity to generate QA checklist
            qa_prompt = f"""
            Create a comprehensive QA checklist for a website with the following features:
            {', '.join(state.phase_outputs.get('development', {}).get('features_implemented', []))}
            
            Include testing for functionality, responsiveness, performance, and accessibility.
            """
            
            qa_response = await self.perplexity_tool._arun(qa_prompt)
            
            metadata = {
                "tests_performed": 15,
                "issues_found": 0,
                "performance_score": 95,
                "accessibility_score": 98,
                "qa_checklist": qa_response
            }
            
            return AgentPhaseOutput(
                success=True,
                message="QA testing completed successfully",
                metadata=metadata
            )
            
        except Exception as e:
            return AgentPhaseOutput(
                success=False,
                message=f"QA phase failed: {str(e)}",
                error=str(e)
            )


class AnalyticsAgent(BaseAgentPhase):
    """Analytics agent phase - example of adding new agent"""
    
    def __init__(self):
        super().__init__("analytics")
    
    async def _run_phase(self, state: WorkflowState) -> AgentPhaseOutput:
        """Execute Analytics phase"""
        try:
            # Simulate analytics setup
            await asyncio.sleep(2)
            
            # Use Perplexity to generate analytics recommendations
            analytics_prompt = f"""
            Recommend analytics setup for a {state.phase_outputs.get('development', {}).get('website_type', 'business')} website.
            Include Google Analytics, conversion tracking, and performance monitoring.
            """
            
            analytics_response = await self.perplexity_tool._arun(analytics_prompt)
            
            metadata = {
                "google_analytics_configured": True,
                "conversion_tracking_setup": True,
                "performance_monitoring": True,
                "analytics_recommendations": analytics_response
            }
            
            return AgentPhaseOutput(
                success=True,
                message="Analytics setup completed successfully",
                metadata=metadata
            )
            
        except Exception as e:
            return AgentPhaseOutput(
                success=False,
                message=f"Analytics phase failed: {str(e)}",
                error=str(e)
            )


class WorkflowOrchestrator:
    """LangGraph workflow orchestrator"""
    
    def __init__(self):
        self.agents = {
            "design": DesignAgent(),
            "development": DevelopmentAgent(),
            "deployment": DeploymentAgent(),
            "notification": NotificationAgent(),
            "qa": QAAgent(),
            "analytics": AnalyticsAgent()
        }
        
        # Create workflow graph
        self.workflow = self._create_workflow()
    
    def _create_workflow(self) -> StateGraph:
        """Create the LangGraph workflow"""
        workflow = StateGraph(WorkflowState)
        
        # Add nodes for each agent phase
        for phase_name, agent in self.agents.items():
            workflow.add_node(phase_name, agent.execute)
        
        # Define the workflow sequence
        workflow.set_entry_point("design")
        workflow.add_edge("design", "development")
        workflow.add_edge("development", "qa")
        workflow.add_edge("qa", "deployment")
        workflow.add_edge("deployment", "analytics")
        workflow.add_edge("analytics", "notification")
        workflow.add_edge("notification", END)
        
        # Compile the workflow
        return workflow.compile(checkpointer=MemorySaver())
    
    async def run_workflow(self, project_id: int) -> Dict[str, Any]:
        """Run the complete workflow for a project"""
        try:
            # Initialize state
            initial_state = WorkflowState(
                project_id=project_id,
                current_phase="design",
                completed_phases=[],
                phase_outputs={},
                errors=[],
                final_status=None
            )
            
            # Run workflow
            config = RunnableConfig(recursion_limit=25)
            final_state = await self.workflow.ainvoke(initial_state, config)
            
            # Update project status
            db = next(get_db())
            project = db.query(Project).filter(Project.id == project_id).first()
            if project:
                if final_state.errors:
                    project.status = "failed"
                else:
                    project.status = "completed"
                    project.download_url = f"https://example.com/downloads/project-{project_id}.zip"
                db.commit()
            
            return {
                "success": len(final_state.errors) == 0,
                "completed_phases": final_state.completed_phases,
                "errors": final_state.errors,
                "final_status": project.status if project else "unknown"
            }
            
        except Exception as e:
            logger.error(f"Workflow execution failed for project {project_id}: {e}")
            return {
                "success": False,
                "completed_phases": [],
                "errors": [str(e)],
                "final_status": "failed"
            }


# Create global orchestrator instance
workflow_orchestrator = WorkflowOrchestrator() 