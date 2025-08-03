"""
Design Agent - Converts project requirements to design mockups
"""
import asyncio
import logging
from typing import Dict, Any, Optional
from datetime import datetime

from app.services.perplexity_service import perplexity_service
from app.database import get_db, Project, AgentLog

logger = logging.getLogger(__name__)


class DesignAgent:
    """Agent responsible for creating design mockups from project requirements"""
    
    def __init__(self):
        self.agent_name = "design"
    
    async def execute(self, project_id: int, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute design phase
        
        Args:
            project_id: Project ID
            state: Current project state
            
        Returns:
            Updated state with design outputs
        """
        try:
            # Log agent start
            await self._log_agent_action(project_id, "started", "Design agent started")
            
            # Get project details
            project = await self._get_project(project_id)
            if not project:
                raise Exception("Project not found")
            
            # Generate design requirements prompt
            design_prompt = self._build_design_prompt(project)
            
            # Use Perplexity to generate design mockups
            design_response = await perplexity_service.chat_completion(design_prompt)
            
            if not design_response:
                raise Exception("Failed to generate design mockups")
            
            # Create mockup specifications
            mockup_specs = await self._create_mockup_specs(project, design_response["response"])
            
            # Simulate design work (in real implementation, this would call design tools)
            await asyncio.sleep(5)  # Simulate processing time
            
            # Update state with design outputs
            state.update({
                "design_completed": True,
                "design_mockups": mockup_specs,
                "design_ai_response": design_response["response"],
                "design_timestamp": datetime.utcnow().isoformat(),
                "mockup_count": len(mockup_specs),
                "design_style_applied": project.design_style
            })
            
            # Log success
            await self._log_agent_action(
                project_id, 
                "completed", 
                f"Design mockups created successfully - {len(mockup_specs)} mockups generated",
                {
                    "mockup_count": len(mockup_specs),
                    "design_style": project.design_style,
                    "features_incorporated": project.features
                }
            )
            
            return state
            
        except Exception as e:
            error_msg = f"Design agent failed: {str(e)}"
            logger.error(error_msg)
            await self._log_agent_action(project_id, "failed", error_msg, {"error": str(e)})
            state["design_error"] = str(e)
            return state
    
    def _build_design_prompt(self, project) -> str:
        """Build comprehensive design prompt for Perplexity"""
        prompt = f"""
        Create detailed design mockups for a {project.website_type} website.
        
        Project Requirements:
        - Business: {project.business_name}
        - Website Type: {project.website_type}
        - Design Style: {project.design_style}
        - Features: {', '.join(project.features)}
        - Budget: ${project.budget}
        
        Design Requirements:
        1. Create 3-5 detailed mockup descriptions
        2. Include color schemes, typography, and layout specifications
        3. Consider the {project.design_style} design style
        4. Ensure responsive design principles
        5. Incorporate all requested features: {', '.join(project.features)}
        6. Provide specific design recommendations for each page type
        
        Output Format:
        - Mockup 1: [Detailed description with colors, layout, typography]
        - Mockup 2: [Detailed description with colors, layout, typography]
        - Mockup 3: [Detailed description with colors, layout, typography]
        - Color Palette: [Primary, secondary, accent colors]
        - Typography: [Font recommendations with sizes]
        - Layout Structure: [Grid system and component layout]
        
        Focus on creating modern, professional designs that align with the {project.design_style} aesthetic.
        """
        return prompt
    
    async def _create_mockup_specs(self, project, ai_response: str) -> list:
        """Create structured mockup specifications from AI response"""
        mockups = []
        
        # Parse AI response to extract mockup details
        lines = ai_response.split('\n')
        current_mockup = None
        
        for line in lines:
            line = line.strip()
            if line.startswith('Mockup') or line.startswith('- Mockup'):
                if current_mockup:
                    mockups.append(current_mockup)
                current_mockup = {
                    "id": len(mockups) + 1,
                    "name": line,
                    "description": "",
                    "colors": {},
                    "typography": {},
                    "layout": {}
                }
            elif current_mockup and line:
                current_mockup["description"] += line + " "
        
        if current_mockup:
            mockups.append(current_mockup)
        
        # If parsing failed, create default mockups
        if not mockups:
            mockups = [
                {
                    "id": 1,
                    "name": "Homepage Mockup",
                    "description": f"Modern {project.design_style} homepage with {', '.join(project.features)}",
                    "colors": {"primary": "#3B82F6", "secondary": "#64748B", "accent": "#F59E0B"},
                    "typography": {"heading": "Inter", "body": "Inter"},
                    "layout": {"type": "grid", "columns": 12}
                },
                {
                    "id": 2,
                    "name": "Inner Page Mockup", 
                    "description": f"Consistent {project.design_style} inner page design",
                    "colors": {"primary": "#3B82F6", "secondary": "#64748B", "accent": "#F59E0B"},
                    "typography": {"heading": "Inter", "body": "Inter"},
                    "layout": {"type": "grid", "columns": 12}
                }
            ]
        
        return mockups
    
    async def _get_project(self, project_id: int) -> Optional[Project]:
        """Get project from database"""
        try:
            db = next(get_db())
            return db.query(Project).filter(Project.id == project_id).first()
        except Exception as e:
            logger.error(f"Error getting project {project_id}: {e}")
            return None
    
    async def _log_agent_action(self, project_id: int, status: str, message: str, metadata: Optional[Dict[str, Any]] = None):
        """Log agent action to database"""
        try:
            db = next(get_db())
            agent_log = AgentLog(
                project_id=project_id,
                agent_type=self.agent_name,
                status=status,
                message=message,
                metadata=metadata
            )
            db.add(agent_log)
            db.commit()
            logger.info(f"Logged {self.agent_name} action: {status} for project {project_id}")
        except Exception as e:
            logger.error(f"Error logging {self.agent_name} action: {e}")


# Create global instance
 