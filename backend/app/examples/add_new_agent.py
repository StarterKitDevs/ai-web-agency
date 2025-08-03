"""
Example: How to add a new agent phase to the LangGraph workflow

This file demonstrates how to extend the workflow with new agent phases.
Copy this pattern to add your own custom agents.
"""

from typing import Dict, Any
import asyncio
import logging

from app.services.langchain_agents import BaseAgentPhase, AgentPhaseOutput
from app.models import WorkflowState

logger = logging.getLogger(__name__)


class SEOAgent(BaseAgentPhase):
    """SEO agent phase - example of adding a new agent"""
    
    def __init__(self):
        super().__init__("seo")
    
    async def _run_phase(self, state: WorkflowState) -> AgentPhaseOutput:
        """Execute SEO phase"""
        try:
            # Simulate SEO work
            await asyncio.sleep(3)
            
            # Get project details from previous phases
            project_id = state.project_id
            db = next(get_db())
            project = db.query(Project).filter(Project.id == project_id).first()
            
            if not project:
                return AgentPhaseOutput(
                    success=False,
                    message="Project not found",
                    error="Project not found"
                )
            
            # Use Perplexity to generate SEO recommendations
            seo_prompt = f"""
            Create SEO recommendations for a {project.website_type} website.
            Business: {project.business_name}
            Features: {', '.join(project.features)}
            
            Include keyword research, meta tags, content optimization, and technical SEO.
            """
            
            seo_response = await self.perplexity_tool._arun(seo_prompt)
            
            metadata = {
                "keywords_researched": 25,
                "meta_tags_optimized": True,
                "content_optimized": True,
                "technical_seo_completed": True,
                "seo_recommendations": seo_response
            }
            
            return AgentPhaseOutput(
                success=True,
                message="SEO optimization completed successfully",
                metadata=metadata
            )
            
        except Exception as e:
            return AgentPhaseOutput(
                success=False,
                message=f"SEO phase failed: {str(e)}",
                error=str(e)
            )


class SecurityAgent(BaseAgentPhase):
    """Security agent phase - another example"""
    
    def __init__(self):
        super().__init__("security")
    
    async def _run_phase(self, state: WorkflowState) -> AgentPhaseOutput:
        """Execute Security phase"""
        try:
            # Simulate security work
            await asyncio.sleep(2)
            
            # Use Perplexity to generate security recommendations
            security_prompt = f"""
            Create security recommendations for a {state.phase_outputs.get('development', {}).get('website_type', 'business')} website.
            
            Include SSL configuration, security headers, vulnerability scanning, and best practices.
            """
            
            security_response = await self.perplexity_tool._arun(security_prompt)
            
            metadata = {
                "ssl_configured": True,
                "security_headers_set": True,
                "vulnerability_scan_completed": True,
                "security_recommendations": security_response
            }
            
            return AgentPhaseOutput(
                success=True,
                message="Security audit completed successfully",
                metadata=metadata
            )
            
        except Exception as e:
            return AgentPhaseOutput(
                success=False,
                message=f"Security phase failed: {str(e)}",
                error=str(e)
            )


# Example: How to modify the WorkflowOrchestrator to include new agents
"""
To add new agents to the workflow:

1. Create your agent class (like SEOAgent above)
2. Update the WorkflowOrchestrator in langchain_agents.py:

class WorkflowOrchestrator:
    def __init__(self):
        self.agents = {
            "design": DesignAgent(),
            "development": DevelopmentAgent(),
            "qa": QAAgent(),
            "seo": SEOAgent(),  # Add your new agent
            "security": SecurityAgent(),  # Add another agent
            "deployment": DeploymentAgent(),
            "analytics": AnalyticsAgent(),
            "notification": NotificationAgent()
        }
        
        # Create workflow graph
        self.workflow = self._create_workflow()
    
    def _create_workflow(self) -> StateGraph:
        workflow = StateGraph(WorkflowState)
        
        # Add nodes for each agent phase
        for phase_name, agent in self.agents.items():
            workflow.add_node(phase_name, agent.execute)
        
        # Define the workflow sequence with new agents
        workflow.set_entry_point("design")
        workflow.add_edge("design", "development")
        workflow.add_edge("development", "qa")
        workflow.add_edge("qa", "seo")  # Add your new agent
        workflow.add_edge("seo", "security")  # Add another agent
        workflow.add_edge("security", "deployment")
        workflow.add_edge("deployment", "analytics")
        workflow.add_edge("analytics", "notification")
        workflow.add_edge("notification", END)
        
        return workflow.compile(checkpointer=MemorySaver())

3. Update the progress calculation in projects.py:
   total_agents = 8  # design, development, qa, seo, security, deployment, analytics, notification

4. Update the trigger endpoint response:
   "workflow_phases": ["design", "development", "qa", "seo", "security", "deployment", "analytics", "notification"]
"""


# Example: Custom agent with specific business logic
class CustomBusinessAgent(BaseAgentPhase):
    """Custom agent with specific business requirements"""
    
    def __init__(self):
        super().__init__("custom_business")
    
    async def _run_phase(self, state: WorkflowState) -> AgentPhaseOutput:
        """Execute custom business logic"""
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
            
            # Custom business logic
            if project.website_type == "ecommerce":
                # E-commerce specific logic
                await self._handle_ecommerce_setup(project)
            elif project.website_type == "blog":
                # Blog specific logic
                await self._handle_blog_setup(project)
            else:
                # General business logic
                await self._handle_general_setup(project)
            
            metadata = {
                "business_logic_completed": True,
                "website_type": project.website_type,
                "custom_features_configured": True
            }
            
            return AgentPhaseOutput(
                success=True,
                message="Custom business logic completed successfully",
                metadata=metadata
            )
            
        except Exception as e:
            return AgentPhaseOutput(
                success=False,
                message=f"Custom business phase failed: {str(e)}",
                error=str(e)
            )
    
    async def _handle_ecommerce_setup(self, project):
        """Handle e-commerce specific setup"""
        # Add e-commerce specific logic here
        pass
    
    async def _handle_blog_setup(self, project):
        """Handle blog specific setup"""
        # Add blog specific logic here
        pass
    
    async def _handle_general_setup(self, project):
        """Handle general business setup"""
        # Add general business logic here
        pass 