"""
Notification Agent - Sends client updates and triggers dashboard push
"""
import asyncio
import logging
import httpx
from typing import Dict, Any, Optional
from datetime import datetime

from app.services.perplexity_service import perplexity_service
from app.services.supabase_service import supabase_service
from app.database import get_db, Project, AgentLog

logger = logging.getLogger(__name__)


class NotifyAgent:
    """Agent responsible for sending notifications and triggering dashboard updates"""
    
    def __init__(self):
        self.agent_name = "notification"
    
    async def execute(self, project_id: int, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute notification phase
        
        Args:
            project_id: Project ID
            state: Current project state
            
        Returns:
            Updated state with notification outputs
        """
        try:
            # Log agent start
            await self._log_agent_action(project_id, "started", "Notification agent started")
            
            # Get project details
            project = await self._get_project(project_id)
            if not project:
                raise Exception("Project not found")
            
            # Generate notification content using Perplexity
            notification_content = await self._generate_notification_content(project, state)
            
            # Send email notification
            email_sent = await self._send_email_notification(project, notification_content)
            
            # Update Supabase user metadata
            supabase_updated = await self._update_supabase_metadata(project, state)
            
            # Trigger dashboard push notification
            dashboard_notification = await self._trigger_dashboard_notification(project, state)
            
            # Send SMS notification (optional)
            sms_sent = await self._send_sms_notification(project, notification_content)
            
            # Simulate notification work
            await asyncio.sleep(2)  # Simulate processing time
            
            # Update state with notification outputs
            state.update({
                "notification_completed": True,
                "notification_content": notification_content,
                "notification_timestamp": datetime.utcnow().isoformat(),
                "email_sent": email_sent,
                "sms_sent": sms_sent,
                "supabase_updated": supabase_updated,
                "dashboard_notification": dashboard_notification,
                "notifications_sent": {
                    "email": email_sent,
                    "sms": sms_sent,
                    "dashboard": dashboard_notification,
                    "supabase": supabase_updated
                }
            })
            
            # Log success
            await self._log_agent_action(
                project_id, 
                "completed", 
                f"Notifications sent successfully - Email: {email_sent}, SMS: {sms_sent}, Dashboard: {dashboard_notification}",
                {
                    "email_sent": email_sent,
                    "sms_sent": sms_sent,
                    "dashboard_notification": dashboard_notification,
                    "supabase_updated": supabase_updated,
                    "recipient": project.email
                }
            )
            
            return state
            
        except Exception as e:
            error_msg = f"Notification agent failed: {str(e)}"
            logger.error(error_msg)
            await self._log_agent_action(project_id, "failed", error_msg, {"error": str(e)})
            state["notification_error"] = str(e)
            return state
    
    async def _generate_notification_content(self, project, state: Dict[str, Any]) -> Dict[str, Any]:
        """Generate notification content using Perplexity"""
        deployment_result = state.get("deployment_result", {})
        live_url = deployment_result.get("url", "https://your-project.vercel.app")
        
        prompt = f"""
        Create a professional notification message for a completed website project.
        
        Project Details:
        - Business: {project.business_name}
        - Website Type: {project.website_type}
        - Features: {', '.join(project.features)}
        - Live URL: {live_url}
        
        Notification Requirements:
        1. Professional email subject line
        2. Email body with project completion details
        3. SMS notification message (short and concise)
        4. Dashboard notification message
        5. Include live URL and next steps
        6. Professional tone, excited but not overly promotional
        
        Output Format:
        - Email Subject: [Professional subject line]
        - Email Body: [Detailed email content]
        - SMS Message: [Short SMS notification]
        - Dashboard Message: [Dashboard notification]
        - Next Steps: [What the client should do next]
        
        Make it personal and professional, highlighting the successful completion.
        """
        
        response = await perplexity_service.chat_completion(prompt)
        if not response:
            raise Exception("Failed to generate notification content")
        
        return {
            "email_subject": self._extract_email_subject_from_response(response["response"]),
            "email_body": self._extract_email_body_from_response(response["response"]),
            "sms_message": self._extract_sms_message_from_response(response["response"]),
            "dashboard_message": self._extract_dashboard_message_from_response(response["response"]),
            "next_steps": self._extract_next_steps_from_response(response["response"]),
            "ai_response": response["response"]
        }
    
    async def _send_email_notification(self, project, notification_content: Dict[str, Any]) -> bool:
        """Send email notification to client"""
        try:
            # In real implementation, this would use an email service like SendGrid
            # For now, simulate email sending
            
            email_data = {
                "to": project.email,
                "subject": notification_content.get("email_subject", "Your website is ready!"),
                "body": notification_content.get("email_body", "Your website has been completed successfully."),
                "from": "noreply@aiwebagency.com",
                "sent_at": datetime.utcnow().isoformat()
            }
            
            # Simulate email sending
            await asyncio.sleep(1)
            
            logger.info(f"Email notification sent to {project.email}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending email notification: {e}")
            return False
    
    async def _update_supabase_metadata(self, project, state: Dict[str, Any]) -> bool:
        """Update Supabase user metadata"""
        try:
            if project.supabase_user_id:
                metadata = {
                    "project_status": "completed",
                    "download_ready": True,
                    "live_url": state.get("live_url"),
                    "completed_at": datetime.utcnow().isoformat(),
                    "project_id": project.id,
                    "website_type": project.website_type,
                    "features": project.features
                }
                
                await supabase_service.update_user_metadata(project.supabase_user_id, metadata)
                logger.info(f"Updated Supabase metadata for user {project.supabase_user_id}")
                return True
            else:
                logger.warning(f"No Supabase user ID for project {project.id}")
                return False
                
        except Exception as e:
            logger.error(f"Error updating Supabase metadata: {e}")
            return False
    
    async def _trigger_dashboard_notification(self, project, state: Dict[str, Any]) -> bool:
        """Trigger dashboard push notification"""
        try:
            # In real implementation, this would trigger a WebSocket event
            # For now, simulate dashboard notification
            
            notification_data = {
                "type": "project_completed",
                "project_id": project.id,
                "message": "Your website has been completed successfully!",
                "live_url": state.get("live_url"),
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Simulate WebSocket broadcast
            await asyncio.sleep(0.5)
            
            logger.info(f"Dashboard notification triggered for project {project.id}")
            return True
            
        except Exception as e:
            logger.error(f"Error triggering dashboard notification: {e}")
            return False
    
    async def _send_sms_notification(self, project, notification_content: Dict[str, Any]) -> bool:
        """Send SMS notification (optional)"""
        try:
            # In real implementation, this would use an SMS service like Twilio
            # For now, simulate SMS sending
            
            sms_data = {
                "to": project.phone if hasattr(project, 'phone') else None,
                "message": notification_content.get("sms_message", "Your website is ready! Check your email for details."),
                "sent_at": datetime.utcnow().isoformat()
            }
            
            # Only send SMS if phone number is available
            if sms_data["to"]:
                await asyncio.sleep(0.5)
                logger.info(f"SMS notification sent to {sms_data['to']}")
                return True
            else:
                logger.info("No phone number available for SMS notification")
                return False
                
        except Exception as e:
            logger.error(f"Error sending SMS notification: {e}")
            return False
    
    def _extract_email_subject_from_response(self, response: str) -> str:
        """Extract email subject from AI response"""
        lines = response.split('\n')
        for line in lines:
            if 'subject' in line.lower() and ':' in line:
                return line.split(':', 1)[1].strip()
        return "Your website is ready! 🎉"
    
    def _extract_email_body_from_response(self, response: str) -> str:
        """Extract email body from AI response"""
        lines = response.split('\n')
        body_lines = []
        in_body = False
        
        for line in lines:
            if 'email body' in line.lower() and ':' in line:
                in_body = True
                continue
            elif in_body and ('sms message' in line.lower() or 'dashboard message' in line.lower()):
                break
            elif in_body and line.strip():
                body_lines.append(line)
        
        if body_lines:
            return '\n'.join(body_lines)
        else:
            return """
            Dear {client_name},
            
            Great news! Your website has been completed successfully and is now live.
            
            You can view your new website at: {live_url}
            
            We've implemented all the features you requested:
            - {features}
            
            Your website is fully responsive, optimized for search engines, and ready to help grow your business.
            
            If you have any questions or need any adjustments, please don't hesitate to reach out.
            
            Best regards,
            The AI Web Agency Team
            """
    
    def _extract_sms_message_from_response(self, response: str) -> str:
        """Extract SMS message from AI response"""
        lines = response.split('\n')
        for line in lines:
            if 'sms message' in line.lower() and ':' in line:
                return line.split(':', 1)[1].strip()
        return "Your website is ready! Check your email for details. 🎉"
    
    def _extract_dashboard_message_from_response(self, response: str) -> str:
        """Extract dashboard message from AI response"""
        lines = response.split('\n')
        for line in lines:
            if 'dashboard message' in line.lower() and ':' in line:
                return line.split(':', 1)[1].strip()
        return "Project completed successfully! Your website is now live."
    
    def _extract_next_steps_from_response(self, response: str) -> list:
        """Extract next steps from AI response"""
        steps = [
            "Review your live website",
            "Test all features and functionality",
            "Update your business information if needed",
            "Share your new website with your network",
            "Contact us if you need any adjustments"
        ]
        return steps
    
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
notify_agent = NotifyAgent() 