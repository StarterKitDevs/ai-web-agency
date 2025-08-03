"""
Stripe service for payment processing
"""
import stripe
from typing import Optional, Dict, Any
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = settings.stripe_secret_key


class StripeService:
    """Service for Stripe payment processing"""
    
    async def create_payment_intent(self, amount: int, project_id: int) -> Optional[Dict[str, Any]]:
        """
        Create a Stripe PaymentIntent
        
        Args:
            amount: Amount in cents
            project_id: Associated project ID
            
        Returns:
            PaymentIntent data if successful, None otherwise
        """
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=amount,
                currency="usd",
                metadata={
                    "project_id": str(project_id),
                    "source": "ai_web_agency"
                },
                automatic_payment_methods={
                    "enabled": True,
                }
            )
            
            logger.info(f"Created PaymentIntent {payment_intent.id} for project {project_id}")
            return {
                "client_secret": payment_intent.client_secret,
                "payment_intent_id": payment_intent.id,
                "amount": payment_intent.amount,
                "currency": payment_intent.currency,
                "status": payment_intent.status
            }
            
        except Exception as e:
            logger.error(f"Error creating PaymentIntent: {e}")
            return None
    
    async def get_payment_intent(self, payment_intent_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a PaymentIntent from Stripe
        
        Args:
            payment_intent_id: Stripe PaymentIntent ID
            
        Returns:
            PaymentIntent data if found, None otherwise
        """
        try:
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return {
                "id": payment_intent.id,
                "amount": payment_intent.amount,
                "currency": payment_intent.currency,
                "status": payment_intent.status,
                "metadata": payment_intent.metadata
            }
        except Exception as e:
            logger.error(f"Error retrieving PaymentIntent {payment_intent_id}: {e}")
            return None
    
    async def confirm_payment(self, payment_intent_id: str) -> bool:
        """
        Confirm a payment intent
        
        Args:
            payment_intent_id: Stripe PaymentIntent ID
            
        Returns:
            True if successful, False otherwise
        """
        try:
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            if payment_intent.status == "requires_confirmation":
                payment_intent.confirm()
                logger.info(f"Confirmed PaymentIntent {payment_intent_id}")
                return True
            elif payment_intent.status == "succeeded":
                logger.info(f"PaymentIntent {payment_intent_id} already succeeded")
                return True
            else:
                logger.warning(f"PaymentIntent {payment_intent_id} has status {payment_intent.status}")
                return False
                
        except Exception as e:
            logger.error(f"Error confirming PaymentIntent {payment_intent_id}: {e}")
            return False
    
    def verify_webhook_signature(self, payload: bytes, signature: str) -> Optional[Dict[str, Any]]:
        """
        Verify Stripe webhook signature
        
        Args:
            payload: Raw webhook payload
            signature: Stripe signature header
            
        Returns:
            Webhook event if valid, None otherwise
        """
        try:
            event = stripe.Webhook.construct_event(
                payload, signature, settings.stripe_webhook_secret
            )
            return event
        except ValueError as e:
            logger.error(f"Invalid webhook payload: {e}")
            return None
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid webhook signature: {e}")
            return None


# Create global instance
stripe_service = StripeService() 