"""
Secure Deployment API Endpoints
Enterprise-grade deployment with wildcard SSL and security controls
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer
from typing import Dict, List, Optional
import logging

from ..services.secure_deployment_service import secure_deployment_service
from ..services.security_service import security_service, SecurityLevel
from ..models import SecureDeploymentRequest, DeploymentStatus, SecurityReport

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/secure-deployment", tags=["Secure Deployment"])
security = HTTPBearer()

@router.post("/create-subdomain")
async def create_secure_subdomain(
    request: SecureDeploymentRequest,
    req: Request
):
    """
    Create secure subdomain with comprehensive security validation
    
    Args:
        request: Deployment request with project details
        req: FastAPI request object for client IP
        
    Returns:
        Deployment information with security status
    """
    try:
        # Get client IP
        client_ip = req.client.host
        
        # Create secure subdomain
        deployment_result = await secure_deployment_service.create_secure_subdomain(
            project_id=request.project_id,
            business_name=request.business_name,
            client_ip=client_ip
        )
        
        if not deployment_result['success']:
            raise HTTPException(
                status_code=400,
                detail={
                    'error': deployment_result['error'],
                    'security_level': deployment_result.get('security_level', SecurityLevel.CRITICAL).value,
                    'threat_detected': deployment_result.get('threat_detected', False)
                }
            )
        
        return {
            'success': True,
            'subdomain': deployment_result['subdomain'],
            'full_url': deployment_result['full_url'],
            'security_score': deployment_result['security_score'],
            'ssl_configured': deployment_result['ssl_configured'],
            'security_headers': deployment_result['security_headers'],
            'deployment_info': deployment_result['deployment_info'],
            'recommendations': deployment_result.get('recommendations', [])
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Secure deployment error: {e}")
        raise HTTPException(
            status_code=500,
            detail={'error': 'Internal server error during deployment'}
        )

@router.get("/status/{subdomain_name}")
async def get_deployment_status(subdomain_name: str):
    """
    Get deployment status and security information
    
    Args:
        subdomain_name: Subdomain to check
        
    Returns:
        Deployment status with security information
    """
    try:
        status = await secure_deployment_service.get_deployment_status(subdomain_name)
        
        if not status['exists']:
            raise HTTPException(
                status_code=404,
                detail={'error': status['error']}
            )
        
        return status
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Status check error: {e}")
        raise HTTPException(
            status_code=500,
            detail={'error': 'Internal server error during status check'}
        )

@router.delete("/revoke/{subdomain_name}")
async def revoke_subdomain(subdomain_name: str, req: Request):
    """
    Securely revoke subdomain access
    
    Args:
        subdomain_name: Subdomain to revoke
        req: FastAPI request object for client IP
        
    Returns:
        Revocation status
    """
    try:
        client_ip = req.client.host
        
        result = await secure_deployment_service.revoke_subdomain(
            subdomain_name, client_ip
        )
        
        if not result['success']:
            raise HTTPException(
                status_code=404,
                detail={'error': result['error']}
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Revocation error: {e}")
        raise HTTPException(
            status_code=500,
            detail={'error': 'Internal server error during revocation'}
        )

@router.get("/security-report")
async def get_security_report():
    """
    Get comprehensive security report for all deployments
    
    Returns:
        Security report with metrics and alerts
    """
    try:
        deployment_report = await secure_deployment_service.get_security_report()
        security_report = await security_service.get_security_report()
        
        return {
            'deployment_metrics': deployment_report,
            'security_metrics': security_report,
            'overall_security_score': min(
                deployment_report.get('average_security_score', 0),
                security_report.get('security_score', 0)
            ),
            'active_alerts': deployment_report.get('security_alerts', [])
        }
        
    except Exception as e:
        logger.error(f"Security report error: {e}")
        raise HTTPException(
            status_code=500,
            detail={'error': 'Internal server error during report generation'}
        )

@router.post("/validate-subdomain")
async def validate_subdomain_security(
    request: Dict[str, str],
    req: Request
):
    """
    Validate subdomain name for security compliance
    
    Args:
        request: Dict with subdomain_name
        req: FastAPI request object for client IP
        
    Returns:
        Validation results with security assessment
    """
    try:
        subdomain_name = request.get('subdomain_name')
        client_ip = req.client.host
        
        if not subdomain_name:
            raise HTTPException(
                status_code=400,
                detail={'error': 'Subdomain name is required'}
            )
        
        validation_result = await security_service.validate_subdomain_security(
            subdomain_name, client_ip
        )
        
        return {
            'valid': validation_result['valid'],
            'security_score': validation_result.get('security_score', 0),
            'security_level': validation_result.get('security_level', SecurityLevel.CRITICAL).value,
            'recommendations': validation_result.get('recommendations', []),
            'threat_detected': validation_result.get('threat_detected', False)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(
            status_code=500,
            detail={'error': 'Internal server error during validation'}
        )

@router.get("/ssl-status/{domain}")
async def get_ssl_status(domain: str):
    """
    Get SSL certificate status for domain
    
    Args:
        domain: Domain to check SSL status
        
    Returns:
        SSL certificate information and security status
    """
    try:
        ssl_status = await security_service.verify_wildcard_ssl_security(domain)
        
        return {
            'domain': domain,
            'secure': ssl_status['secure'],
            'security_score': ssl_status.get('security_score', 0),
            'certificate_info': ssl_status.get('certificate_info', {}),
            'security_checks': ssl_status.get('security_checks', {}),
            'recommendations': ssl_status.get('recommendations', [])
        }
        
    except Exception as e:
        logger.error(f"SSL status check error: {e}")
        raise HTTPException(
            status_code=500,
            detail={'error': 'Internal server error during SSL check'}
        )

@router.get("/audit-log")
async def get_security_audit_log():
    """
    Get security audit log (admin only)
    
    Returns:
        Recent security audit events
    """
    try:
        # In production, add admin authentication here
        audit_log = security_service.security_audit_log[-50:]  # Last 50 events
        
        return {
            'total_events': len(security_service.security_audit_log),
            'recent_events': audit_log,
            'threat_summary': await security_service._get_threat_summary()
        }
        
    except Exception as e:
        logger.error(f"Audit log error: {e}")
        raise HTTPException(
            status_code=500,
            detail={'error': 'Internal server error during audit log retrieval'}
        )

# Include router in main app
def include_secure_deployment_router(app):
    """Include secure deployment router in main FastAPI app"""
    app.include_router(router) 