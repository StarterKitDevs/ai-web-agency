"""
Enhanced Deployment Agent with Security Integration
Integrates with security service for secure subdomain deployment
"""
import asyncio
import logging
from typing import Dict, Any, Optional
from datetime import datetime

from .security_service import security_service, SecurityLevel
from .secure_deployment_service import secure_deployment_service

logger = logging.getLogger(__name__)

class EnhancedDeploymentAgent:
    """Enhanced deployment agent with comprehensive security controls"""
    
    def __init__(self):
        self.deployment_queue = []
        self.active_deployments = {}
        
    async def deploy_project(self, project_data: Dict[str, Any], client_ip: str) -> Dict[str, Any]:
        """
        Deploy project with enhanced security controls
        
        Args:
            project_data: Project information
            client_ip: Client IP for security tracking
            
        Returns:
            Deployment result with security status
        """
        try:
            project_id = project_data.get('id')
            business_name = project_data.get('businessName', 'Unknown Business')
            
            logger.info(f"Starting enhanced deployment for project: {project_id}")
            
            # Step 1: Pre-deployment security validation
            security_validation = await self._pre_deployment_security_check(
                project_data, client_ip
            )
            
            if not security_validation['passed']:
                return {
                    'success': False,
                    'error': 'Security validation failed',
                    'security_issues': security_validation['issues'],
                    'security_level': SecurityLevel.CRITICAL
                }
            
            # Step 2: Create secure subdomain
            deployment_result = await secure_deployment_service.create_secure_subdomain(
                project_id=project_id,
                business_name=business_name,
                client_ip=client_ip
            )
            
            if not deployment_result['success']:
                return {
                    'success': False,
                    'error': deployment_result['error'],
                    'security_level': deployment_result.get('security_level', SecurityLevel.CRITICAL)
                }
            
            # Step 3: Post-deployment security verification
            security_verification = await self._post_deployment_security_verification(
                deployment_result, client_ip
            )
            
            # Step 4: Update project with deployment information
            await self._update_project_deployment_info(project_id, deployment_result)
            
            # Log successful deployment
            await security_service._log_security_audit(
                security_service.SecurityAudit(
                    event_type="enhanced_deployment_completed",
                    description=f"Enhanced deployment completed for project: {project_id}",
                    severity=SecurityLevel.LOW,
                    client_ip=client_ip,
                    subdomain=deployment_result['subdomain'],
                    metadata={
                        'project_id': project_id,
                        'security_score': deployment_result['security_score'],
                        'ssl_configured': deployment_result['ssl_configured'],
                        'deployment_time': datetime.now().isoformat()
                    }
                )
            )
            
            return {
                'success': True,
                'deployment_info': deployment_result,
                'security_verification': security_verification,
                'recommendations': deployment_result.get('recommendations', [])
            }
            
        except Exception as e:
            logger.error(f"Enhanced deployment error: {e}")
            return {
                'success': False,
                'error': f'Deployment failed: {str(e)}',
                'security_level': SecurityLevel.CRITICAL
            }
    
    async def _pre_deployment_security_check(self, project_data: Dict[str, Any], 
                                           client_ip: str) -> Dict[str, Any]:
        """Pre-deployment security validation"""
        issues = []
        
        # Check for suspicious project data
        if self._contains_suspicious_content(project_data):
            issues.append("Suspicious content detected in project data")
        
        # Validate business name
        business_name = project_data.get('businessName', '')
        if len(business_name) < 2:
            issues.append("Business name too short")
        
        # Check for rate limiting violations
        if not await self._check_deployment_rate_limit(client_ip):
            issues.append("Deployment rate limit exceeded")
        
        # Validate project requirements
        if not self._validate_project_requirements(project_data):
            issues.append("Invalid project requirements")
        
        return {
            'passed': len(issues) == 0,
            'issues': issues,
            'security_score': 100 - (len(issues) * 20)
        }
    
    async def _post_deployment_security_verification(self, deployment_result: Dict[str, Any], 
                                                   client_ip: str) -> Dict[str, Any]:
        """Post-deployment security verification"""
        verification_results = {
            'ssl_verification': await self._verify_ssl_configuration(deployment_result),
            'security_headers': await self._verify_security_headers(deployment_result),
            'isolation_check': await self._verify_environment_isolation(deployment_result),
            'access_control': await self._verify_access_controls(deployment_result)
        }
        
        passed_checks = sum(1 for result in verification_results.values() if result['passed'])
        total_checks = len(verification_results)
        
        return {
            'passed': passed_checks == total_checks,
            'verification_results': verification_results,
            'security_score': (passed_checks / total_checks) * 100
        }
    
    def _contains_suspicious_content(self, project_data: Dict[str, Any]) -> bool:
        """Check for suspicious content in project data"""
        suspicious_patterns = [
            'script', 'javascript', 'eval', 'exec', 'system',
            'admin', 'root', 'password', 'secret'
        ]
        
        project_string = str(project_data).lower()
        return any(pattern in project_string for pattern in suspicious_patterns)
    
    async def _check_deployment_rate_limit(self, client_ip: str) -> bool:
        """Check deployment rate limiting"""
        # Simulate rate limiting check
        # In production, implement proper rate limiting
        return True
    
    def _validate_project_requirements(self, project_data: Dict[str, Any]) -> bool:
        """Validate project requirements"""
        required_fields = ['businessName', 'email']
        return all(field in project_data for field in required_fields)
    
    async def _verify_ssl_configuration(self, deployment_result: Dict[str, Any]) -> Dict[str, Any]:
        """Verify SSL configuration"""
        ssl_configured = deployment_result.get('ssl_configured', False)
        
        return {
            'passed': ssl_configured,
            'details': {
                'ssl_enabled': ssl_configured,
                'certificate_valid': ssl_configured,
                'protocols_supported': ['TLSv1.2', 'TLSv1.3'] if ssl_configured else []
            }
        }
    
    async def _verify_security_headers(self, deployment_result: Dict[str, Any]) -> Dict[str, Any]:
        """Verify security headers configuration"""
        headers = deployment_result.get('security_headers', {})
        required_headers = [
            'X-Frame-Options',
            'X-Content-Type-Options',
            'X-XSS-Protection',
            'Strict-Transport-Security'
        ]
        
        missing_headers = [header for header in required_headers if header not in headers]
        
        return {
            'passed': len(missing_headers) == 0,
            'details': {
                'configured_headers': list(headers.keys()),
                'missing_headers': missing_headers,
                'total_headers': len(headers)
            }
        }
    
    async def _verify_environment_isolation(self, deployment_result: Dict[str, Any]) -> Dict[str, Any]:
        """Verify environment isolation"""
        deployment_info = deployment_result.get('deployment_info', {})
        environment_info = deployment_info.get('environment_info', {})
        
        isolation_configured = 'isolated_path' in environment_info
        
        return {
            'passed': isolation_configured,
            'details': {
                'isolation_enabled': isolation_configured,
                'isolated_path': environment_info.get('isolated_path', 'Not configured'),
                'resource_limits': environment_info.get('resource_limits', {})
            }
        }
    
    async def _verify_access_controls(self, deployment_result: Dict[str, Any]) -> Dict[str, Any]:
        """Verify access controls"""
        deployment_info = deployment_result.get('deployment_info', {})
        environment_info = deployment_info.get('environment_info', {})
        
        security_token = environment_info.get('security_token', 'Not configured')
        access_controls_enabled = security_token != 'Not configured'
        
        return {
            'passed': access_controls_enabled,
            'details': {
                'access_controls_enabled': access_controls_enabled,
                'security_token_configured': access_controls_enabled,
                'permission_level': 'restricted' if access_controls_enabled else 'open'
            }
        }
    
    async def _update_project_deployment_info(self, project_id: str, 
                                            deployment_result: Dict[str, Any]):
        """Update project with deployment information"""
        # In production, update the database with deployment information
        logger.info(f"Updating project {project_id} with deployment info")
        
        # Simulate database update
        deployment_info = {
            'subdomain': deployment_result['subdomain'],
            'full_url': deployment_result['full_url'],
            'security_score': deployment_result['security_score'],
            'ssl_configured': deployment_result['ssl_configured'],
            'deployment_time': datetime.now().isoformat(),
            'status': 'deployed'
        }
        
        logger.info(f"Project {project_id} deployment info: {deployment_info}")
    
    async def get_deployment_status(self, project_id: str) -> Dict[str, Any]:
        """Get deployment status for a project"""
        try:
            # In production, fetch from database
            # For now, return simulated status
            return {
                'project_id': project_id,
                'status': 'deployed',
                'security_score': 95,
                'ssl_configured': True,
                'last_audit': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting deployment status: {e}")
            return {
                'project_id': project_id,
                'status': 'unknown',
                'error': str(e)
            }
    
    async def revoke_deployment(self, project_id: str, client_ip: str) -> Dict[str, Any]:
        """Revoke deployment for a project"""
        try:
            # Get project deployment info
            deployment_status = await self.get_deployment_status(project_id)
            
            if deployment_status.get('status') != 'deployed':
                return {
                    'success': False,
                    'error': 'Project not deployed'
                }
            
            # Revoke subdomain (this would be implemented based on your subdomain management)
            # For now, simulate revocation
            
            # Log revocation
            await security_service._log_security_audit(
                security_service.SecurityAudit(
                    event_type="deployment_revoked",
                    description=f"Deployment revoked for project: {project_id}",
                    severity=SecurityLevel.MEDIUM,
                    client_ip=client_ip,
                    metadata={
                        'project_id': project_id,
                        'revocation_time': datetime.now().isoformat()
                    }
                )
            )
            
            return {
                'success': True,
                'message': f'Deployment revoked for project {project_id}',
                'revocation_time': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error revoking deployment: {e}")
            return {
                'success': False,
                'error': f'Revocation failed: {str(e)}'
            }

# Global enhanced deployment agent instance
enhanced_deployment_agent = EnhancedDeploymentAgent() 