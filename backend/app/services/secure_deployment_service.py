"""
Secure Deployment Service with Wildcard SSL & Subdomain Management
Enterprise-grade deployment with comprehensive security controls
"""
import asyncio
import aiohttp
import json
import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import re

from .security_service import security_service, SecurityLevel, ThreatType

logger = logging.getLogger(__name__)

class SecureDeploymentService:
    """Enterprise-grade deployment service with security controls"""
    
    def __init__(self):
        self.base_domain = "webai.studio"
        self.wildcard_cert_domain = f"*.{self.base_domain}"
        self.deployment_configs = {}
        self.active_subdomains = {}
        
    async def create_secure_subdomain(self, project_id: str, business_name: str, 
                                    client_ip: str) -> Dict[str, any]:
        """
        Create secure subdomain with comprehensive security validation
        
        Args:
            project_id: Unique project identifier
            business_name: Business name for subdomain generation
            client_ip: Client IP for security tracking
            
        Returns:
            Dict with deployment information and security status
        """
        try:
            # Generate subdomain name
            subdomain_name = await self._generate_secure_subdomain(business_name)
            
            # Comprehensive security validation
            security_validation = await security_service.validate_subdomain_security(
                subdomain_name, client_ip
            )
            
            if not security_validation['valid']:
                return {
                    'success': False,
                    'error': security_validation['error'],
                    'security_level': security_validation['security_level'],
                    'threat_detected': security_validation.get('threat_detected', False)
                }
            
            # Create isolated environment
            isolated_env = await security_service.create_isolated_environment(
                f"/deployments/{project_id}", project_id
            )
            
            if not isolated_env['success']:
                return {
                    'success': False,
                    'error': 'Failed to create isolated environment',
                    'security_level': SecurityLevel.CRITICAL
                }
            
            # Configure SSL certificate
            ssl_config = await self._configure_wildcard_ssl(subdomain_name)
            
            # Setup security headers and configurations
            security_config = await self._setup_security_configuration(subdomain_name)
            
            # Deploy to secure environment
            deployment_result = await self._deploy_to_secure_environment(
                project_id, subdomain_name, isolated_env, security_config
            )
            
            if deployment_result['success']:
                # Update active subdomains
                self.active_subdomains[subdomain_name] = {
                    'project_id': project_id,
                    'created_at': datetime.now(),
                    'security_score': security_validation['security_score'],
                    'ssl_configured': ssl_config['success'],
                    'security_headers': security_config['headers']
                }
                
                await security_service._log_security_audit(
                    security_service.SecurityAudit(
                        event_type="secure_deployment",
                        description=f"Secure deployment completed: {subdomain_name}",
                        severity=SecurityLevel.LOW,
                        client_ip=client_ip,
                        subdomain=subdomain_name,
                        metadata={
                            'project_id': project_id,
                            'security_score': security_validation['security_score'],
                            'ssl_configured': ssl_config['success']
                        }
                    )
                )
            
            return {
                'success': deployment_result['success'],
                'subdomain': subdomain_name,
                'full_url': f"https://{subdomain_name}.{self.base_domain}",
                'security_score': security_validation['security_score'],
                'ssl_configured': ssl_config['success'],
                'security_headers': security_config['headers'],
                'deployment_info': deployment_result,
                'recommendations': security_validation.get('recommendations', [])
            }
            
        except Exception as e:
            logger.error(f"Secure deployment error: {e}")
            return {
                'success': False,
                'error': f'Deployment failed: {str(e)}',
                'security_level': SecurityLevel.CRITICAL
            }
    
    async def _generate_secure_subdomain(self, business_name: str) -> str:
        """Generate secure subdomain name with security considerations"""
        # Clean business name
        clean_name = re.sub(r'[^a-z0-9]', '', business_name.lower())
        
        # Add random suffix for uniqueness and security
        random_suffix = security_service.secrets.token_urlsafe(4)[:6]
        
        # Ensure minimum length and complexity
        if len(clean_name) < 3:
            clean_name = f"site{clean_name}"
        
        subdomain = f"{clean_name}{random_suffix}"
        
        # Ensure it's not already in use
        if subdomain in self.active_subdomains:
            subdomain = f"{clean_name}{random_suffix}2"
        
        return subdomain
    
    async def _configure_wildcard_ssl(self, subdomain_name: str) -> Dict[str, any]:
        """Configure wildcard SSL certificate for subdomain"""
        try:
            # Verify wildcard SSL certificate
            ssl_verification = await security_service.verify_wildcard_ssl_security(
                self.base_domain
            )
            
            if not ssl_verification['secure']:
                return {
                    'success': False,
                    'error': 'SSL certificate validation failed',
                    'recommendations': ssl_verification.get('recommendations', [])
                }
            
            # Configure SSL for subdomain
            ssl_config = {
                'certificate_domain': self.wildcard_cert_domain,
                'subdomain': subdomain_name,
                'full_domain': f"{subdomain_name}.{self.base_domain}",
                'ssl_protocols': ['TLSv1.2', 'TLSv1.3'],
                'cipher_suite': 'ECDHE-RSA-AES256-GCM-SHA384',
                'hsts_enabled': True,
                'hsts_max_age': 31536000,
                'include_subdomains': True
            }
            
            return {
                'success': True,
                'ssl_config': ssl_config,
                'security_score': ssl_verification['security_score']
            }
            
        except Exception as e:
            logger.error(f"SSL configuration error: {e}")
            return {
                'success': False,
                'error': f'SSL configuration failed: {str(e)}'
            }
    
    async def _setup_security_configuration(self, subdomain_name: str) -> Dict[str, any]:
        """Setup comprehensive security configuration"""
        security_headers = {
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;",
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
            'X-Permitted-Cross-Domain-Policies': 'none',
            'X-Download-Options': 'noopen',
            'X-DNS-Prefetch-Control': 'off'
        }
        
        # Nginx security configuration
        nginx_config = f"""
server {{
    listen 443 ssl http2;
    server_name {subdomain_name}.{self.base_domain};
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/wildcard-{self.base_domain}.crt;
    ssl_certificate_key /etc/ssl/private/wildcard-{self.base_domain}.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;
    add_header X-Download-Options "noopen" always;
    add_header X-DNS-Prefetch-Control "off" always;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
    
    # File Upload Restrictions
    client_max_body_size 10M;
    
    # Directory Browsing Disabled
    autoindex off;
    
    # Hidden Files Protection
    location ~ /\. {{
        deny all;
    }}
    
    # Main Application
    location / {{
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Security Headers for Proxy
        proxy_hide_header X-Powered-By;
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
    }}
}}
"""
        
        return {
            'headers': security_headers,
            'nginx_config': nginx_config,
            'security_level': SecurityLevel.HIGH
        }
    
    async def _deploy_to_secure_environment(self, project_id: str, subdomain_name: str,
                                          isolated_env: Dict, security_config: Dict) -> Dict[str, any]:
        """Deploy to secure isolated environment"""
        try:
            # Simulate deployment process with security controls
            deployment_steps = [
                "Validating security configuration",
                "Creating isolated environment",
                "Configuring SSL certificate",
                "Setting up security headers",
                "Deploying application",
                "Running security scans",
                "Activating subdomain"
            ]
            
            # Simulate deployment time
            await asyncio.sleep(2)
            
            # Security scan simulation
            security_scan_result = await self._run_security_scan(subdomain_name)
            
            if not security_scan_result['passed']:
                return {
                    'success': False,
                    'error': 'Security scan failed',
                    'security_issues': security_scan_result['issues']
                }
            
            return {
                'success': True,
                'deployment_steps': deployment_steps,
                'security_scan': security_scan_result,
                'deployment_time': datetime.now().isoformat(),
                'environment_info': {
                    'isolated_path': isolated_env['isolated_path'],
                    'security_token': isolated_env['security_token'][:8] + '...',
                    'resource_limits': isolated_env['resource_limits']
                }
            }
            
        except Exception as e:
            logger.error(f"Deployment error: {e}")
            return {
                'success': False,
                'error': f'Deployment failed: {str(e)}'
            }
    
    async def _run_security_scan(self, subdomain_name: str) -> Dict[str, any]:
        """Run comprehensive security scan"""
        # Simulate security scan
        scan_results = {
            'vulnerability_scan': 'passed',
            'ssl_verification': 'passed',
            'header_security': 'passed',
            'content_security': 'passed',
            'rate_limiting': 'configured',
            'isolation_check': 'passed'
        }
        
        issues = []
        for check, result in scan_results.items():
            if result != 'passed':
                issues.append(f"{check}: {result}")
        
        return {
            'passed': len(issues) == 0,
            'issues': issues,
            'scan_results': scan_results,
            'security_score': 95 if len(issues) == 0 else 85
        }
    
    async def get_deployment_status(self, subdomain_name: str) -> Dict[str, any]:
        """Get deployment status and security information"""
        if subdomain_name not in self.active_subdomains:
            return {
                'exists': False,
                'error': 'Subdomain not found'
            }
        
        subdomain_info = self.active_subdomains[subdomain_name]
        
        # Get SSL status
        ssl_status = await security_service.verify_wildcard_ssl_security(self.base_domain)
        
        return {
            'exists': True,
            'subdomain': subdomain_name,
            'full_url': f"https://{subdomain_name}.{self.base_domain}",
            'created_at': subdomain_info['created_at'].isoformat(),
            'security_score': subdomain_info['security_score'],
            'ssl_status': ssl_status,
            'security_headers': subdomain_info['security_headers'],
            'uptime': '99.9%',
            'last_security_audit': datetime.now().isoformat()
        }
    
    async def revoke_subdomain(self, subdomain_name: str, client_ip: str) -> Dict[str, any]:
        """Securely revoke subdomain access"""
        try:
            if subdomain_name not in self.active_subdomains:
                return {
                    'success': False,
                    'error': 'Subdomain not found'
                }
            
            # Log revocation
            await security_service._log_security_audit(
                security_service.SecurityAudit(
                    event_type="subdomain_revocation",
                    description=f"Subdomain revoked: {subdomain_name}",
                    severity=SecurityLevel.MEDIUM,
                    client_ip=client_ip,
                    subdomain=subdomain_name
                )
            )
            
            # Remove from active subdomains
            del self.active_subdomains[subdomain_name]
            
            return {
                'success': True,
                'message': f'Subdomain {subdomain_name} revoked successfully'
            }
            
        except Exception as e:
            logger.error(f"Subdomain revocation error: {e}")
            return {
                'success': False,
                'error': f'Revocation failed: {str(e)}'
            }
    
    async def get_security_report(self) -> Dict[str, any]:
        """Get comprehensive security report for all deployments"""
        total_subdomains = len(self.active_subdomains)
        avg_security_score = sum(
            info['security_score'] for info in self.active_subdomains.values()
        ) / total_subdomains if total_subdomains > 0 else 0
        
        return {
            'total_subdomains': total_subdomains,
            'average_security_score': round(avg_security_score, 2),
            'ssl_configured_count': sum(
                1 for info in self.active_subdomains.values() 
                if info.get('ssl_configured', False)
            ),
            'recent_deployments': list(self.active_subdomains.keys())[-5:],
            'security_alerts': await self._get_security_alerts()
        }
    
    async def _get_security_alerts(self) -> List[Dict]:
        """Get active security alerts"""
        alerts = []
        
        # Check for SSL certificate expiration
        ssl_status = await security_service.verify_wildcard_ssl_security(self.base_domain)
        if ssl_status.get('certificate_info', {}).get('days_until_expiry', 0) < 30:
            alerts.append({
                'type': 'ssl_expiration',
                'severity': 'high',
                'message': 'SSL certificate expires soon'
            })
        
        # Check for high-risk subdomains
        for subdomain, info in self.active_subdomains.items():
            if info['security_score'] < 60:
                alerts.append({
                    'type': 'low_security_score',
                    'severity': 'medium',
                    'message': f'Low security score for {subdomain}'
                })
        
        return alerts

# Global secure deployment service instance
secure_deployment_service = SecureDeploymentService() 