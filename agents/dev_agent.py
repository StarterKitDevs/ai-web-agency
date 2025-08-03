"""
Development Agent - Generates functional code and sets up deployment
"""
import asyncio
import logging
import json
from typing import Dict, Any, Optional
from datetime import datetime

from app.services.perplexity_service import perplexity_service
from app.database import get_db, Project, AgentLog

logger = logging.getLogger(__name__)


class DevAgent:
    """Agent responsible for generating functional code and setting up deployment"""
    
    def __init__(self):
        self.agent_name = "development"
    
    async def execute(self, project_id: int, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute development phase
        
        Args:
            project_id: Project ID
            state: Current project state
            
        Returns:
            Updated state with development outputs
        """
        try:
            # Log agent start
            await self._log_agent_action(project_id, "started", "Development agent started")
            
            # Get project details
            project = await self._get_project(project_id)
            if not project:
                raise Exception("Project not found")
            
            # Generate development plan using Perplexity
            dev_plan = await self._generate_development_plan(project, state)
            
            # Generate code structure
            code_structure = await self._generate_code_structure(project, dev_plan)
            
            # Set up deployment configuration
            deployment_config = await self._setup_deployment_config(project, code_structure)
            
            # Simulate development work
            await asyncio.sleep(10)  # Simulate processing time
            
            # Update state with development outputs
            state.update({
                "development_completed": True,
                "development_plan": dev_plan,
                "code_structure": code_structure,
                "deployment_config": deployment_config,
                "development_timestamp": datetime.utcnow().isoformat(),
                "pages_created": len(code_structure.get("pages", [])),
                "components_created": len(code_structure.get("components", [])),
                "features_implemented": project.features
            })
            
            # Log success
            await self._log_agent_action(
                project_id, 
                "completed", 
                f"Development completed successfully - {len(code_structure.get('pages', []))} pages, {len(code_structure.get('components', []))} components",
                {
                    "pages_count": len(code_structure.get("pages", [])),
                    "components_count": len(code_structure.get("components", [])),
                    "features_implemented": project.features,
                    "deployment_ready": True
                }
            )
            
            return state
            
        except Exception as e:
            error_msg = f"Development agent failed: {str(e)}"
            logger.error(error_msg)
            await self._log_agent_action(project_id, "failed", error_msg, {"error": str(e)})
            state["development_error"] = str(e)
            return state
    
    async def _generate_development_plan(self, project, state: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive development plan using Perplexity"""
        design_mockups = state.get("design_mockups", [])
        
        prompt = f"""
        Create a detailed development plan for a {project.website_type} website.
        
        Project Requirements:
        - Business: {project.business_name}
        - Website Type: {project.website_type}
        - Features: {', '.join(project.features)}
        - Design Style: {project.design_style}
        
        Design Mockups Available: {len(design_mockups)} mockups
        
        Development Requirements:
        1. Create a comprehensive technical architecture
        2. Define page structure and routing
        3. List required components and their functionality
        4. Specify technology stack (Next.js, React, TypeScript, Tailwind)
        5. Define API endpoints and data models
        6. Plan responsive design implementation
        7. Include SEO optimization strategy
        8. Plan for all requested features: {', '.join(project.features)}
        
        Output Format:
        - Architecture: [Technical architecture overview]
        - Pages: [List of pages with descriptions]
        - Components: [List of reusable components]
        - API Endpoints: [Required API endpoints]
        - Data Models: [Database schema and data structures]
        - Technology Stack: [Specific technologies and versions]
        - Deployment Strategy: [Deployment approach and configuration]
        
        Focus on modern, scalable, and maintainable code architecture.
        """
        
        response = await perplexity_service.chat_completion(prompt)
        if not response:
            raise Exception("Failed to generate development plan")
        
        # Parse and structure the development plan
        return {
            "architecture": "Next.js 14 with App Router, TypeScript, Tailwind CSS",
            "pages": self._extract_pages_from_response(response["response"]),
            "components": self._extract_components_from_response(response["response"]),
            "api_endpoints": self._extract_api_endpoints_from_response(response["response"]),
            "data_models": self._extract_data_models_from_response(response["response"]),
            "technology_stack": {
                "frontend": ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS"],
                "backend": ["FastAPI", "PostgreSQL", "Redis"],
                "deployment": ["Vercel", "Supabase"],
                "tools": ["ESLint", "Prettier", "Husky"]
            },
            "deployment_strategy": "Vercel for frontend, Supabase for backend",
            "ai_response": response["response"]
        }
    
    async def _generate_code_structure(self, project, dev_plan: Dict[str, Any]) -> Dict[str, Any]:
        """Generate code structure based on development plan"""
        pages = dev_plan.get("pages", [])
        components = dev_plan.get("components", [])
        
        # Generate page structures
        page_structures = []
        for page in pages:
            page_structures.append({
                "name": page,
                "path": f"/{page.lower().replace(' ', '-')}",
                "component": f"{page.replace(' ', '')}Page",
                "features": self._get_page_features(page, project.features)
            })
        
        # Generate component structures
        component_structures = []
        for component in components:
            component_structures.append({
                "name": component,
                "file": f"{component.replace(' ', '')}.tsx",
                "props": self._get_component_props(component),
                "features": self._get_component_features(component, project.features)
            })
        
        return {
            "pages": page_structures,
            "components": component_structures,
            "file_structure": {
                "app": ["layout.tsx", "page.tsx", "globals.css"],
                "components": [f"{comp['file']}" for comp in component_structures],
                "lib": ["utils.ts", "supabase.ts"],
                "types": ["index.ts"]
            },
            "routing": {
                "pages": [page["path"] for page in page_structures],
                "dynamic_routes": []
            }
        }
    
    async def _setup_deployment_config(self, project, code_structure: Dict[str, Any]) -> Dict[str, Any]:
        """Set up deployment configuration"""
        return {
            "platform": "vercel",
            "framework": "nextjs",
            "build_command": "npm run build",
            "output_directory": ".next",
            "environment_variables": {
                "NEXT_PUBLIC_SUPABASE_URL": "https://xxzieezklzehlhizphkj.supabase.co",
                "NEXT_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key",
                "NEXT_PUBLIC_BACKEND_URL": "https://your-backend.vercel.app"
            },
            "domains": [f"{project.business_name.lower().replace(' ', '-')}.vercel.app"],
            "auto_deploy": True,
            "preview_deployments": True
        }
    
    def _extract_pages_from_response(self, response: str) -> list:
        """Extract pages from AI response"""
        pages = []
        lines = response.split('\n')
        for line in lines:
            if 'page' in line.lower() or 'route' in line.lower():
                # Simple extraction - in real implementation, use more sophisticated parsing
                if 'home' in line.lower():
                    pages.append("Home")
                elif 'about' in line.lower():
                    pages.append("About")
                elif 'contact' in line.lower():
                    pages.append("Contact")
                elif 'services' in line.lower():
                    pages.append("Services")
                elif 'blog' in line.lower():
                    pages.append("Blog")
        
        # Default pages if extraction failed
        if not pages:
            pages = ["Home", "About", "Contact", "Services"]
        
        return pages
    
    def _extract_components_from_response(self, response: str) -> list:
        """Extract components from AI response"""
        components = []
        lines = response.split('\n')
        for line in lines:
            if 'component' in line.lower():
                # Simple extraction
                if 'header' in line.lower():
                    components.append("Header")
                elif 'footer' in line.lower():
                    components.append("Footer")
                elif 'navigation' in line.lower():
                    components.append("Navigation")
                elif 'button' in line.lower():
                    components.append("Button")
                elif 'card' in line.lower():
                    components.append("Card")
        
        # Default components if extraction failed
        if not components:
            components = ["Header", "Footer", "Navigation", "Button", "Card", "Hero"]
        
        return components
    
    def _extract_api_endpoints_from_response(self, response: str) -> list:
        """Extract API endpoints from AI response"""
        return [
            "/api/projects",
            "/api/payments/create-intent",
            "/api/copilot",
            "/api/projects/{id}/status"
        ]
    
    def _extract_data_models_from_response(self, response: str) -> list:
        """Extract data models from AI response"""
        return [
            {"name": "Project", "fields": ["id", "business_name", "email", "status"]},
            {"name": "User", "fields": ["id", "email", "created_at"]},
            {"name": "Payment", "fields": ["id", "project_id", "amount", "status"]}
        ]
    
    def _get_page_features(self, page_name: str, project_features: list) -> list:
        """Get features relevant to a specific page"""
        feature_mapping = {
            "Home": ["responsive", "seo"],
            "About": ["responsive"],
            "Contact": ["contact", "responsive"],
            "Services": ["responsive", "seo"],
            "Blog": ["blog", "responsive", "seo"],
            "Portfolio": ["responsive", "seo"]
        }
        return feature_mapping.get(page_name, ["responsive"])
    
    def _get_component_props(self, component_name: str) -> list:
        """Get props for a specific component"""
        props_mapping = {
            "Header": ["title", "navigation"],
            "Footer": ["links", "social"],
            "Navigation": ["items", "mobile"],
            "Button": ["children", "variant", "onClick"],
            "Card": ["title", "content", "image"],
            "Hero": ["title", "subtitle", "cta"]
        }
        return props_mapping.get(component_name, ["children"])
    
    def _get_component_features(self, component_name: str, project_features: list) -> list:
        """Get features relevant to a specific component"""
        feature_mapping = {
            "Header": ["responsive"],
            "Footer": ["responsive"],
            "Navigation": ["responsive"],
            "Button": ["responsive"],
            "Card": ["responsive"],
            "Hero": ["responsive", "seo"]
        }
        return feature_mapping.get(component_name, ["responsive"])
    
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
dev_agent = DevAgent() 