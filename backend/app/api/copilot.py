"""
Copilot API endpoints for AI chatbot
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db, Project
from app.models import CopilotRequest, CopilotResponse
from app.services.langchain_agents import PerplexityTool

router = APIRouter(prefix="/api/copilot", tags=["copilot"])


@router.post("/", response_model=CopilotResponse)
async def chat_with_copilot(
    request: CopilotRequest,
    db: Session = Depends(get_db)
):
    """
    Chat with the AI copilot using LangChain PerplexityTool
    
    Args:
        request: Chat request data
        db: Database session
        
    Returns:
        AI response with suggestions
    """
    try:
        # Get project context if project_id is provided
        project_data = None
        if request.project_id:
            project = db.query(Project).filter(Project.id == request.project_id).first()
            if project:
                project_data = {
                    "project_status": project.status,
                    "website_type": project.website_type,
                    "features": project.features,
                    "design_style": project.design_style,
                    "business_name": project.business_name
                }
        
        # Use LangChain PerplexityTool
        perplexity_tool = PerplexityTool()
        
        # Get AI response
        if project_data:
            # Create context-aware prompt
            context_prompt = f"""
            Context: Project for {project_data['business_name']}
            Website Type: {project_data['website_type']}
            Design Style: {project_data['design_style']}
            Features: {', '.join(project_data['features'])}
            Status: {project_data['project_status']}
            
            User Question: {request.message}
            
            Please provide a helpful response considering the project context.
            """
            ai_response = await perplexity_tool._arun(context_prompt, project_data)
        else:
            ai_response = await perplexity_tool._arun(request.message, request.context)
        
        if not ai_response:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get AI response"
            )
        
        # Generate suggestions based on the response
        suggestions = await _generate_suggestions(request.message, ai_response)
        
        return CopilotResponse(
            response=ai_response,
            suggestions=suggestions
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat request: {str(e)}"
        )


async def _generate_suggestions(original_message: str, ai_response: str) -> List[str]:
    """
    Generate follow-up suggestions based on the conversation
    
    Args:
        original_message: Original user message
        ai_response: AI's response
        
    Returns:
        List of suggested follow-up questions
    """
    suggestions = []
    
    # Common suggestions based on message content
    message_lower = original_message.lower()
    
    if "status" in message_lower or "progress" in message_lower:
        suggestions.extend([
            "What's the current timeline for my project?",
            "Can you show me the latest updates?",
            "When will my website be ready?"
        ])
    elif "payment" in message_lower or "billing" in message_lower:
        suggestions.extend([
            "How do I update my payment method?",
            "Can I get an invoice for my project?",
            "What payment options do you accept?"
        ])
    elif "feature" in message_lower or "functionality" in message_lower:
        suggestions.extend([
            "Can I add more features to my project?",
            "What features are included in my package?",
            "How do I request custom functionality?"
        ])
    elif "design" in message_lower or "style" in message_lower:
        suggestions.extend([
            "Can I see design mockups?",
            "How do I request design changes?",
            "What design options are available?"
        ])
    else:
        # Generic helpful suggestions
        suggestions.extend([
            "How can I track my project progress?",
            "What's included in my web development package?",
            "How do I contact the development team?"
        ])
    
    # Return up to 3 suggestions
    return suggestions[:3] 