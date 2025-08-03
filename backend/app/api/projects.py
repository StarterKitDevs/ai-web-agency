"""
Projects API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db, Project, AgentLog
from app.models import ProjectCreateRequest, ProjectResponse, ProjectStatusResponse, AgentLogResponse
from app.services.supabase_service import supabase_service
from agents.agent_orchestrator import agent_orchestrator

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Create a new project
    
    Args:
        project_data: Project creation data
        db: Database session
        
    Returns:
        Created project information
    """
    try:
        # Create project in database
        project = Project(
            business_name=project_data.business_name,
            email=project_data.email,
            website_type=project_data.website_type.value,
            features=project_data.features,
            design_style=project_data.design_style.value,
            budget=project_data.budget,
            estimated_price=project_data.estimated_price,
            status="pending"
        )
        
        db.add(project)
        db.commit()
        db.refresh(project)
        
        # Create Supabase user
        user_id = await supabase_service.create_user(project_data.email, project.id)
        if user_id:
            project.supabase_user_id = user_id
            db.commit()
        
        return ProjectResponse.from_orm(project)
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating project: {str(e)}"
        )


@router.get("/{project_id}/status", response_model=ProjectStatusResponse)
async def get_project_status(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Get project status and agent logs
    
    Args:
        project_id: Project ID
        db: Database session
        
    Returns:
        Project status with agent logs
    """
    try:
        # Get project
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        # Get agent logs
        agent_logs = db.query(AgentLog).filter(AgentLog.project_id == project_id).order_by(AgentLog.created_at.desc()).all()
        
        # Calculate progress percentage (updated for new agents)
        total_agents = 4  # design, development, deployment, notification
        completed_agents = len([log for log in agent_logs if log.status == "completed"])
        progress_percentage = int((completed_agents / total_agents) * 100)
        
        # Determine current agent
        current_agent = None
        if project.status == "in_progress":
            # Find the last started but not completed agent
            for log in reversed(agent_logs):
                if log.status == "started":
                    current_agent = log.agent_type
                    break
        
        return ProjectStatusResponse(
            project=ProjectResponse.from_orm(project),
            agent_logs=[AgentLogResponse.from_orm(log) for log in agent_logs],
            current_agent=current_agent,
            progress_percentage=progress_percentage
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting project status: {str(e)}"
        )


@router.post("/{project_id}/trigger")
async def trigger_workflow(project_id: int, db: Session = Depends(get_db)):
    """
    Manually trigger the agent workflow for a project
    
    Args:
        project_id: Project ID
        db: Database session
        
    Returns:
        Success message with workflow details
    """
    try:
        # Check if project exists
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        # Check if project is paid
        if project.status == "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project must be paid before starting workflow"
            )
        
        # Trigger agent workflow using orchestrator
        result = await agent_orchestrator.trigger_agent_workflow(project_id)
        
        if "error" in result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
        
        return {
            "message": result["message"],
            "project_id": project_id,
            "status": result["status"],
            "agents": result["agents"]
        }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error triggering workflow: {str(e)}"
        )


@router.get("/", response_model=List[ProjectResponse])
async def list_projects(db: Session = Depends(get_db)):
    """
    List all projects
    
    Args:
        db: Database session
        
    Returns:
        List of projects
    """
    try:
        projects = db.query(Project).order_by(Project.created_at.desc()).all()
        return [ProjectResponse.from_orm(project) for project in projects]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing projects: {str(e)}"
        ) 