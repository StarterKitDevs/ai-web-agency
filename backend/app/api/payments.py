"""
Payments API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db, Project, Payment
from app.models import PaymentIntentRequest, PaymentIntentResponse
from app.services.stripe_service import stripe_service
from app.services.langchain_agents import workflow_orchestrator

router = APIRouter(prefix="/api/payments", tags=["payments"])


@router.post("/create-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    payment_data: PaymentIntentRequest,
    db: Session = Depends(get_db)
):
    """
    Create a Stripe PaymentIntent
    
    Args:
        payment_data: Payment intent data
        db: Database session
        
    Returns:
        PaymentIntent information
    """
    try:
        # Verify project exists
        project = db.query(Project).filter(Project.id == payment_data.project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        # Create PaymentIntent
        payment_intent_data = await stripe_service.create_payment_intent(
            payment_data.amount, 
            payment_data.project_id
        )
        
        if not payment_intent_data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create payment intent"
            )
        
        # Update project with payment intent ID
        project.stripe_payment_intent_id = payment_intent_data["payment_intent_id"]
        db.commit()
        
        return PaymentIntentResponse(
            client_secret=payment_intent_data["client_secret"],
            payment_intent_id=payment_intent_data["payment_intent_id"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating payment intent: {str(e)}"
        )


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Handle Stripe webhook events
    
    Args:
        request: FastAPI request object
        db: Database session
        
    Returns:
        Success response
    """
    try:
        # Get the raw body
        body = await request.body()
        signature = request.headers.get("stripe-signature")
        
        if not signature:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing stripe-signature header"
            )
        
        # Verify webhook signature
        event = stripe_service.verify_webhook_signature(body, signature)
        if not event:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid webhook signature"
            )
        
        # Handle different event types
        event_type = event["type"]
        
        if event_type == "payment_intent.succeeded":
            await _handle_payment_succeeded(event["data"]["object"], db)
        elif event_type == "payment_intent.payment_failed":
            await _handle_payment_failed(event["data"]["object"], db)
        else:
            # Log unhandled events
            print(f"Unhandled event type: {event_type}")
        
        return {"status": "success"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing webhook: {str(e)}"
        )


async def _handle_payment_succeeded(payment_intent: Dict[str, Any], db: Session):
    """
    Handle successful payment
    
    Args:
        payment_intent: Stripe PaymentIntent object
        db: Database session
    """
    try:
        payment_intent_id = payment_intent["id"]
        project_id = int(payment_intent["metadata"]["project_id"])
        
        # Update project status
        project = db.query(Project).filter(Project.id == project_id).first()
        if project:
            project.status = "paid"
            db.commit()
            
            # Create payment record
            payment = Payment(
                project_id=project_id,
                stripe_payment_intent_id=payment_intent_id,
                amount=payment_intent["amount"],
                currency=payment_intent["currency"],
                status="succeeded"
            )
            db.add(payment)
            db.commit()
            
            # Start LangGraph workflow
            import asyncio
            asyncio.create_task(workflow_orchestrator.run_workflow(project_id))
            
            print(f"Payment succeeded for project {project_id}, LangGraph workflow started")
        
    except Exception as e:
        print(f"Error handling payment succeeded: {e}")


async def _handle_payment_failed(payment_intent: Dict[str, Any], db: Session):
    """
    Handle failed payment
    
    Args:
        payment_intent: Stripe PaymentIntent object
        db: Database session
    """
    try:
        payment_intent_id = payment_intent["id"]
        project_id = int(payment_intent["metadata"]["project_id"])
        
        # Create payment record
        payment = Payment(
            project_id=project_id,
            stripe_payment_intent_id=payment_intent_id,
            amount=payment_intent["amount"],
            currency=payment_intent["currency"],
            status="failed"
        )
        db.add(payment)
        db.commit()
        
        print(f"Payment failed for project {project_id}")
        
    except Exception as e:
        print(f"Error handling payment failed: {e}")


@router.get("/{payment_intent_id}")
async def get_payment_status(payment_intent_id: str):
    """
    Get payment status from Stripe
    
    Args:
        payment_intent_id: Stripe PaymentIntent ID
        
    Returns:
        Payment status information
    """
    try:
        payment_data = await stripe_service.get_payment_intent(payment_intent_id)
        
        if not payment_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment intent not found"
            )
        
        return payment_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting payment status: {str(e)}"
        ) 