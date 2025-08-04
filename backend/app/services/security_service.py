"""
Enhanced Security Service for Wildcard SSL & Subdomain Management
Enterprise-grade security with comprehensive threat protection
"""
import asyncio
import re
import hashlib
import secrets
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import logging
from dataclasses import dataclass
from enum import Enum

import aiohttp
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa

logger = logging.getLogger(__name__)

class SecurityLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ThreatType(Enum):
    SUBDOMAIN_TAKEOVER = "subdomain_takeover"
    XSS_ATTEMPT = "xss_attempt"
    SQL_INJECTION = "sql_injection"
    PHISHING_ATTEMPT = "phishing_attempt"
    RATE_LIMIT_VIOLATION = "rate_limit_violation"
    SUSPICIOUS_ACTIVITY = "suspicious_activity"

@dataclass
class SecurityAudit:
    event_type: str
    description: str
    severity: SecurityLevel
    client_ip: str
    subdomain: Optional[str] = None
    threat_type: Optional[ThreatType] = None
    metadata: Optional[Dict] = None

class SecurityService:
    """Enterprise-grade security service for subdomain and SSL management"""
    
    def __init__(self):
        self.blocked_patterns = [
            r'admin', r'api', r'www', r'mail', r'ftp', r'ssh', r'telnet',
            r'root', r'system', r'config', r'backup', r'test', r'dev',
            r'staging', r'beta', r'alpha', r'local', r'localhost',
            r'secure', r'login', r'auth', r'oauth', r'payment',
            r'bank', r'paypal', r'stripe', r'credit', r'card'
        ]
        
        self.suspicious_chars = [
            '--', '/*', '*/', 'union', 'select', 'insert', 'update',
            'delete', 'drop', 'create', 'alter', 'exec', 'eval',
            'script', 'javascript', 'vbscript', 'onload', 'onerror'
        ]
        
        self.rate_limit_store = {}
        self.security_audit_log = []
        
    async def validate_subdomain_security(self, subdomain_name: str, client_ip: str) -> Dict[str, any]:
        """
        Comprehensive subdomain validation with security checks
        
        Args:
            subdomain_name: Proposed subdomain name
            client_ip: Client IP address for rate limiting
            
        Returns:
            Dict with validation results and security assessment
        """
        try:
            # Rate limiting check
            if not await self._check_rate_limit(client_ip):
                return {
                    'valid': False,
                    'error': 'Rate limit exceeded. Please try again later.',
                    'security_level': SecurityLevel.CRITICAL,
                    'threat_detected': True
                }
            
            # Input validation and sanitization
            validation_result = await self._validate_input(subdomain_name)
            if not validation_result['valid']:
                return validation_result
            
            # Blocked pattern check
            if await self._check_blocked_patterns(subdomain_name):
                return {
                    'valid': False,
                    'error': 'Subdomain name contains blocked patterns.',
                    'security_level': SecurityLevel.HIGH,
                    'threat_detected': True
                }
            
            # Homograph attack prevention
            if await self._detect_homograph_attack(subdomain_name):
                return {
                    'valid': False,
                    'error': 'Subdomain name contains suspicious characters.',
                    'security_level': SecurityLevel.HIGH,
                    'threat_detected': True
                }
            
            # Security score calculation
            security_score = await self._calculate_security_score(subdomain_name)
            
            # Log security audit
            await self._log_security_audit(
                SecurityAudit(
                    event_type="subdomain_validation",
                    description=f"Subdomain validation for: {subdomain_name}",
                    severity=SecurityLevel.LOW,
                    client_ip=client_ip,
                    subdomain=subdomain_name,
                    metadata={'security_score': security_score}
                )
            )
            
            return {
                'valid': True,
                'security_score': security_score,
                'security_level': self._get_security_level(security_score),
                'recommendations': await self._get_security_recommendations(security_score)
            }
            
        except Exception as e:
            logger.error(f"Security validation error: {e}")
            return {
                'valid': False,
                'error': 'Security validation failed.',
                'security_level': SecurityLevel.CRITICAL,
                'threat_detected': True
            }
    
    async def _check_rate_limit(self, client_ip: str) -> bool:
        """Rate limiting: 5 attempts per hour per IP"""
        current_time = datetime.now()
        if client_ip not in self.rate_limit_store:
            self.rate_limit_store[client_ip] = []
        
        # Clean old entries
        self.rate_limit_store[client_ip] = [
            time for time in self.rate_limit_store[client_ip]
            if current_time - time < timedelta(hours=1)
        ]
        
        if len(self.rate_limit_store[client_ip]) >= 5:
            await self._log_security_audit(
                SecurityAudit(
                    event_type="rate_limit_violation",
                    description=f"Rate limit exceeded for IP: {client_ip}",
                    severity=SecurityLevel.HIGH,
                    client_ip=client_ip,
                    threat_type=ThreatType.RATE_LIMIT_VIOLATION
                )
            )
            return False
        
        self.rate_limit_store[client_ip].append(current_time)
        return True
    
    async def _validate_input(self, subdomain_name: str) -> Dict[str, any]:
        """Comprehensive input validation and sanitization"""
        # Length validation
        if len(subdomain_name) < 3 or len(subdomain_name) > 63:
            return {
                'valid': False,
                'error': 'Subdomain must be between 3 and 63 characters.',
                'security_level': SecurityLevel.MEDIUM
            }
        
        # Format validation (RFC compliant)
        if not re.match(r'^[a-z0-9]([a-z0-9-]*[a-z0-9])?$', subdomain_name):
            return {
                'valid': False,
                'error': 'Subdomain must contain only lowercase letters, numbers, and hyphens.',
                'security_level': SecurityLevel.MEDIUM
            }
        
        # Suspicious character detection
        for suspicious in self.suspicious_chars:
            if suspicious in subdomain_name.lower():
                await self._log_security_audit(
                    SecurityAudit(
                        event_type="suspicious_input",
                        description=f"Suspicious characters detected: {suspicious}",
                        severity=SecurityLevel.HIGH,
                        subdomain=subdomain_name,
                        threat_type=ThreatType.XSS_ATTEMPT
                    )
                )
                return {
                    'valid': False,
                    'error': 'Subdomain contains suspicious characters.',
                    'security_level': SecurityLevel.HIGH,
                    'threat_detected': True
                }
        
        return {'valid': True}
    
    async def _check_blocked_patterns(self, subdomain_name: str) -> bool:
        """Check for blocked subdomain patterns"""
        for pattern in self.blocked_patterns:
            if re.search(pattern, subdomain_name.lower()):
                await self._log_security_audit(
                    SecurityAudit(
                        event_type="blocked_pattern",
                        description=f"Blocked pattern detected: {pattern}",
                        severity=SecurityLevel.MEDIUM,
                        subdomain=subdomain_name
                    )
                )
                return True
        return False
    
    async def _detect_homograph_attack(self, subdomain_name: str) -> bool:
        """Detect potential homograph attacks"""
        # Check for mixed scripts and suspicious Unicode
        suspicious_unicode = [
            '\u0430', '\u0435', '\u043e', '\u0440', '\u0441', '\u0443',
            '\u0445', '\u0454', '\u0456', '\u0457', '\u0491', '\u04cf'
        ]
        
        for char in suspicious_unicode:
            if char in subdomain_name:
                await self._log_security_audit(
                    SecurityAudit(
                        event_type="homograph_attack",
                        description="Potential homograph attack detected",
                        severity=SecurityLevel.HIGH,
                        subdomain=subdomain_name,
                        threat_type=ThreatType.PHISHING_ATTEMPT
                    )
                )
                return True
        return False
    
    async def _calculate_security_score(self, subdomain_name: str) -> int:
        """Calculate security score (0-100)"""
        score = 100
        
        # Length penalty
        if len(subdomain_name) < 5:
            score -= 10
        
        # Complexity penalty
        if not re.search(r'[0-9]', subdomain_name):
            score -= 5
        
        # Hyphen penalty
        if subdomain_name.count('-') > 2:
            score -= 15
        
        # Suspicious patterns
        for pattern in ['test', 'demo', 'temp', 'tmp']:
            if pattern in subdomain_name:
                score -= 20
        
        return max(0, score)
    
    def _get_security_level(self, score: int) -> SecurityLevel:
        """Convert security score to security level"""
        if score >= 80:
            return SecurityLevel.LOW
        elif score >= 60:
            return SecurityLevel.MEDIUM
        elif score >= 40:
            return SecurityLevel.HIGH
        else:
            return SecurityLevel.CRITICAL
    
    async def _get_security_recommendations(self, score: int) -> List[str]:
        """Get security recommendations based on score"""
        recommendations = []
        
        if score < 80:
            recommendations.append("Consider using a more complex subdomain name")
        if score < 60:
            recommendations.append("Avoid using common words or patterns")
        if score < 40:
            recommendations.append("Security review recommended before deployment")
        
        return recommendations
    
    async def create_isolated_environment(self, deployment_path: str, project_id: str) -> Dict[str, any]:
        """Create isolated deployment environment with security controls"""
        try:
            # Generate security token
            security_token = secrets.token_urlsafe(32)
            
            # Create isolated directory structure
            isolated_path = f"{deployment_path}/isolated/{project_id}"
            
            # Security headers configuration
            security_headers = {
                'X-Frame-Options': 'DENY',
                'X-Content-Type-Options': 'nosniff',
                'X-XSS-Protection': '1; mode=block',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
                'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
            }
            
            # Resource restrictions
            resource_limits = {
                'max_memory': '512MB',
                'max_cpu': '50%',
                'max_connections': 100,
                'timeout': 30
            }
            
            await self._log_security_audit(
                SecurityAudit(
                    event_type="environment_creation",
                    description=f"Isolated environment created for project: {project_id}",
                    severity=SecurityLevel.LOW,
                    metadata={
                        'isolated_path': isolated_path,
                        'security_token': security_token[:8] + '...',
                        'resource_limits': resource_limits
                    }
                )
            )
            
            return {
                'success': True,
                'isolated_path': isolated_path,
                'security_token': security_token,
                'security_headers': security_headers,
                'resource_limits': resource_limits
            }
            
        except Exception as e:
            logger.error(f"Environment creation error: {e}")
            return {'success': False, 'error': str(e)}
    
    async def verify_wildcard_ssl_security(self, domain: str) -> Dict[str, any]:
        """Verify wildcard SSL certificate security"""
        try:
            # Certificate validation
            cert_info = await self._get_certificate_info(domain)
            
            # Security checks
            security_checks = {
                'certificate_valid': cert_info.get('valid', False),
                'expires_soon': cert_info.get('days_until_expiry', 0) < 30,
                'strong_cipher': cert_info.get('cipher_strength', 0) >= 128,
                'proper_san': cert_info.get('san_valid', False),
                'no_weak_protocols': cert_info.get('weak_protocols', []) == []
            }
            
            # Overall security score
            security_score = sum(security_checks.values()) / len(security_checks) * 100
            
            await self._log_security_audit(
                SecurityAudit(
                    event_type="ssl_verification",
                    description=f"SSL verification for domain: {domain}",
                    severity=self._get_security_level(security_score),
                    metadata={
                        'certificate_info': cert_info,
                        'security_checks': security_checks,
                        'security_score': security_score
                    }
                )
            )
            
            return {
                'secure': security_score >= 80,
                'security_score': security_score,
                'certificate_info': cert_info,
                'security_checks': security_checks,
                'recommendations': await self._get_ssl_recommendations(security_checks)
            }
            
        except Exception as e:
            logger.error(f"SSL verification error: {e}")
            return {'secure': False, 'error': str(e)}
    
    async def _get_certificate_info(self, domain: str) -> Dict[str, any]:
        """Get SSL certificate information"""
        # Simulated certificate info (replace with actual SSL verification)
        return {
            'valid': True,
            'days_until_expiry': 45,
            'cipher_strength': 256,
            'san_valid': True,
            'weak_protocols': [],
            'issuer': 'Let\'s Encrypt',
            'subject': f'*.{domain}'
        }
    
    async def _get_ssl_recommendations(self, security_checks: Dict[str, bool]) -> List[str]:
        """Get SSL security recommendations"""
        recommendations = []
        
        if not security_checks['certificate_valid']:
            recommendations.append("SSL certificate is invalid or expired")
        if security_checks['expires_soon']:
            recommendations.append("SSL certificate expires soon - renewal needed")
        if not security_checks['strong_cipher']:
            recommendations.append("Weak cipher suite detected")
        if not security_checks['proper_san']:
            recommendations.append("Subject Alternative Name validation failed")
        if security_checks['no_weak_protocols']:
            recommendations.append("Weak SSL/TLS protocols detected")
        
        return recommendations
    
    async def _log_security_audit(self, audit: SecurityAudit):
        """Log security audit event"""
        self.security_audit_log.append({
            'timestamp': datetime.now().isoformat(),
            'event_type': audit.event_type,
            'description': audit.description,
            'severity': audit.severity.value,
            'client_ip': audit.client_ip,
            'subdomain': audit.subdomain,
            'threat_type': audit.threat_type.value if audit.threat_type else None,
            'metadata': audit.metadata
        })
        
        # Log to database (implement with your database)
        logger.info(f"Security Audit: {audit.event_type} - {audit.description}")
    
    async def get_security_report(self) -> Dict[str, any]:
        """Generate comprehensive security report"""
        total_events = len(self.security_audit_log)
        critical_events = len([e for e in self.security_audit_log if e['severity'] == 'critical'])
        high_events = len([e for e in self.security_audit_log if e['severity'] == 'high'])
        
        return {
            'total_events': total_events,
            'critical_events': critical_events,
            'high_events': high_events,
            'security_score': max(0, 100 - (critical_events * 20) - (high_events * 10)),
            'recent_events': self.security_audit_log[-10:],
            'threat_summary': await self._get_threat_summary()
        }
    
    async def _get_threat_summary(self) -> Dict[str, int]:
        """Get threat type summary"""
        threat_counts = {}
        for event in self.security_audit_log:
            if event.get('threat_type'):
                threat_type = event['threat_type']
                threat_counts[threat_type] = threat_counts.get(threat_type, 0) + 1
        return threat_counts

# Global security service instance
security_service = SecurityService() 