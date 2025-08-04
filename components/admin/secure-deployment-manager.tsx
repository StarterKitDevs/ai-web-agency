'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Lock, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Trash2,
  RefreshCw,
  Activity,
  Zap,
  AlertCircle
} from 'lucide-react';
import { showSuccess, showError } from '@/lib/toast';

interface SecurityReport {
  deployment_metrics: {
    total_subdomains: number;
    average_security_score: number;
    ssl_configured_count: number;
    recent_deployments: string[];
    security_alerts: Array<{
      type: string;
      severity: string;
      message: string;
    }>;
  };
  security_metrics: {
    total_events: number;
    critical_events: number;
    high_events: number;
    security_score: number;
    recent_events: any[];
    threat_summary: Record<string, number>;
  };
  overall_security_score: number;
  active_alerts: any[];
}

interface DeploymentStatus {
  exists: boolean;
  subdomain: string;
  full_url: string;
  created_at: string;
  security_score: number;
  ssl_status: any;
  security_headers: Record<string, string>;
  uptime: string;
  last_security_audit: string;
}

export default function SecureDeploymentManager() {
  const [securityReport, setSecurityReport] = useState<SecurityReport | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);
  const [subdomainToCheck, setSubdomainToCheck] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSecurityReport();
  }, []);

  const fetchSecurityReport = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/secure-deployment/security-report');
      if (response.ok) {
        const data = await response.json();
        setSecurityReport(data);
      } else {
        showError('Failed to fetch security report');
      }
    } catch (error) {
      showError('Error fetching security report');
    } finally {
      setIsLoading(false);
    }
  };

  const checkDeploymentStatus = async () => {
    if (!subdomainToCheck.trim()) {
      showError('Please enter a subdomain name');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/secure-deployment/status/${subdomainToCheck}`);
      if (response.ok) {
        const data = await response.json();
        setDeploymentStatus(data);
      } else {
        const errorData = await response.json();
        showError(errorData.detail?.error || 'Subdomain not found');
        setDeploymentStatus(null);
      }
    } catch (error) {
      showError('Error checking deployment status');
    } finally {
      setIsLoading(false);
    }
  };

  const revokeSubdomain = async (subdomain: string) => {
    if (!confirm(`Are you sure you want to revoke subdomain: ${subdomain}?`)) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/secure-deployment/revoke/${subdomain}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showSuccess('Subdomain revoked successfully');
        fetchSecurityReport(); // Refresh report
      } else {
        const errorData = await response.json();
        showError(errorData.detail?.error || 'Failed to revoke subdomain');
      }
    } catch (error) {
      showError('Error revoking subdomain');
    } finally {
      setIsLoading(false);
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getSecurityScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4" />;
    if (score >= 40) return <AlertCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading security data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Secure Deployment Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enterprise-grade subdomain management with wildcard SSL security
          </p>
        </div>
        <Button onClick={fetchSecurityReport} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Security Overview */}
      {securityReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Security</p>
                  <p className={`text-2xl font-bold ${getSecurityScoreColor(securityReport.overall_security_score)}`}>
                    {securityReport.overall_security_score}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Globe className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Subdomains</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {securityReport.deployment_metrics.total_subdomains}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Lock className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">SSL Configured</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {securityReport.deployment_metrics.ssl_configured_count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Activity className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Security Events</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {securityReport.security_metrics.total_events}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Alerts */}
      {securityReport?.deployment_metrics?.security_alerts && securityReport.deployment_metrics.security_alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityReport.deployment_metrics.security_alerts.map((alert, index) => (
                <Alert key={index} className={`border-l-4 border-l-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'yellow'}-500`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getAlertSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="ml-2">{alert.message}</span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deployment Status Checker */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Status Checker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            <Input
              placeholder="Enter subdomain name (e.g., mybusiness)"
              value={subdomainToCheck}
              onChange={(e) => setSubdomainToCheck(e.target.value)}
              className="flex-1"
            />
            <Button onClick={checkDeploymentStatus} disabled={!subdomainToCheck.trim()}>
              <Eye className="mr-2 h-4 w-4" />
              Check Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Status Display */}
      {deploymentStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Deployment Status: {deploymentStatus.subdomain}</span>
              <div className="flex space-x-2">
                <Badge className={getSecurityScoreColor(deploymentStatus.security_score)}>
                  {getSecurityScoreIcon(deploymentStatus.security_score)}
                  <span className="ml-1">Security: {deploymentStatus.security_score}%</span>
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => revokeSubdomain(deploymentStatus.subdomain)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Revoke
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Deployment Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full URL:</span>
                    <span className="font-mono">{deploymentStatus.full_url}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span>{new Date(deploymentStatus.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="text-green-600">{deploymentStatus.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Audit:</span>
                    <span>{new Date(deploymentStatus.last_security_audit).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Security Headers</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(deploymentStatus.security_headers).map(([header, value]) => (
                    <div key={header} className="flex justify-between">
                      <span className="text-gray-600">{header}:</span>
                      <span className="font-mono text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Deployments */}
      {securityReport?.deployment_metrics?.recent_deployments && securityReport.deployment_metrics.recent_deployments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {securityReport.deployment_metrics.recent_deployments.map((subdomain, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{subdomain}</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSubdomainToCheck(subdomain);
                        checkDeploymentStatus();
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeSubdomain(subdomain)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Threat Summary */}
      {securityReport?.security_metrics?.threat_summary && Object.keys(securityReport.security_metrics.threat_summary).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Threat Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(securityReport.security_metrics.threat_summary).map(([threat, count]) => (
                <div key={threat} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">
                    {threat.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 