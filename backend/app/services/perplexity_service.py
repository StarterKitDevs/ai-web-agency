"""
Perplexity AI service for copilot chatbot
"""
import httpx
from typing import Optional, List, Dict, Any
import logging
import json

from app.config import settings

logger = logging.getLogger(__name__)


class PerplexityService:
    """Service for interacting with Perplexity AI API"""
    
    def __init__(self):
        """Initialize Perplexity service"""
        self.api_key = settings.perplexity_api_key
        self.base_url = "https://api.perplexity.ai"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def chat_completion(self, message: str, context: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        """
        Send a chat message to Perplexity AI
        
        Args:
            message: User's message
            context: Optional context information
            
        Returns:
            AI response with suggestions if successful, None otherwise
        """
        try:
            # Build the prompt with context
            prompt = self._build_prompt(message, context)
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json={
                        "model": "llama-3.1-sonar-small-128k-online",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are an AI assistant for a web development agency. Help users with questions about web development, project status, and general inquiries. Be helpful, professional, and concise."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "max_tokens": 500,
                        "temperature": 0.7
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    ai_response = data["choices"][0]["message"]["content"]
                    
                    # Generate suggestions based on the response
                    suggestions = await self._generate_suggestions(message, ai_response)
                    
                    return {
                        "response": ai_response,
                        "suggestions": suggestions
                    }
                else:
                    logger.error(f"Perplexity API error: {response.status_code} - {response.text}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error calling Perplexity API: {e}")
            return None
    
    def _build_prompt(self, message: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Build a contextual prompt for the AI
        
        Args:
            message: User's message
            context: Optional context information
            
        Returns:
            Formatted prompt string
        """
        prompt = f"User message: {message}\n\n"
        
        if context:
            if "project_status" in context:
                prompt += f"Project Status: {context['project_status']}\n"
            if "website_type" in context:
                prompt += f"Website Type: {context['website_type']}\n"
            if "features" in context:
                prompt += f"Selected Features: {', '.join(context['features'])}\n"
            if "design_style" in context:
                prompt += f"Design Style: {context['design_style']}\n"
        
        prompt += "\nPlease provide a helpful response and consider the context if provided."
        return prompt
    
    async def _generate_suggestions(self, original_message: str, ai_response: str) -> List[str]:
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
    
    async def get_project_specific_response(self, message: str, project_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Get a response specific to a project context
        
        Args:
            message: User's message
            project_data: Project information
            
        Returns:
            Contextual AI response if successful, None otherwise
        """
        context = {
            "project_status": project_data.get("status", "unknown"),
            "website_type": project_data.get("website_type", "unknown"),
            "features": project_data.get("features", []),
            "design_style": project_data.get("design_style", "unknown"),
            "business_name": project_data.get("business_name", "unknown")
        }
        
        return await self.chat_completion(message, context)


# Create global instance
perplexity_service = PerplexityService() 