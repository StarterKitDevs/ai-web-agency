'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  AlertCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Server,
  Database,
  Network,
  FileText,
  Settings
} from 'lucide-react';
import { showSuccess, showError } from '@/lib/toast';

interface SecurityMetrics {
  overall_security_score: number;
  total_subdomains: number;
  ssl_configured_count: number;
  total_events: number;
  critical_events: number;
  high_events: number;
  average_security_score: number;
  recent_deployments: string[];
  security_alerts: Array<{
    type: string;
    severity: string;
    message: string;
  }>;
  threat_summary: Record<string, number>;
}

interface SecurityEvent {
  timestamp: string;
  event_type: string;
  description: string;
  severity: string;
  client_ip: string;
  subdomain?: string;
  threat_type?: string;
}

export default function SecurityMonitoring() {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch security report
      const reportResponse = await fetch('/api/secure-deployment/security-report');
      if (reportResponse.ok) {
        const reportData = await reportResponse.json();
        setSecurityMetrics({
          overall_security_score: reportData.overall_security_score,
          total_subdomains: reportData.deployment_metrics.total_subdomains,
          ssl_configured_count: reportData.deployment_metrics.ssl_configured_count,
          total_events: reportData.security_metrics.total_events,
          critical_events: reportData.security_metrics.critical_events,
          high_events: reportData.security_metrics.high_events,
          average_security_score: reportData.deployment_metrics.average_security_score,
          recent_deployments: reportData.deployment_metrics.recent_deployments,
          security_alerts: reportData.active_alerts,
          threat_summary: reportData.security_metrics.threat_summary
        });
      }

      // Fetch recent security events
      const eventsResponse = await fetch('/api/secure-deployment/audit-log');
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setRecentEvents(eventsData.recent_events || []);
      }
    } catch (error) {
      showError('Error fetching security data');
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-500';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-500';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-500';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-500';
      default: return 'text-gray-600 bg-gray-100 border-gray-500';
    }
  };

  const getThreatIcon = (threatType: string) => {
    switch (threatType) {
      case 'subdomain_takeover': return <Globe className="h-4 w-4" />;
      case 'xss_attempt': return <AlertTriangle className="h-4 w-4" />;
      case 'sql_injection': return <Database className="h-4 w-4" />;
      case 'phishing_attempt': return <Users className="h-4 w-4" />;
      case 'rate_limit_violation': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading security monitoring data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Security Monitoring Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time security monitoring and threat detection
          </p>
        </div>
        <Button onClick={fetchSecurityData} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Security Overview Cards */}
      {securityMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Security</p>
                  <p className={`text-2xl font-bold ${getSecurityScoreColor(securityMetrics.overall_security_score)}`}>
                    {securityMetrics.overall_security_score}%
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
                    {securityMetrics.total_subdomains}
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
                  <p className="text-sm font-medium text-gray-600">SSL Protected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {securityMetrics.ssl_configured_count}
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
                    {securityMetrics.total_events}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Threat Analysis */}
      {securityMetrics?.threat_summary && Object.keys(securityMetrics.threat_summary).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
              Threat Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(securityMetrics.threat_summary).map(([threat, count]) => (
                <div key={threat} className="text-center p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    {getThreatIcon(threat)}
                  </div>
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

      {/* Security Alerts */}
      {securityMetrics?.security_alerts && securityMetrics.security_alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
              Active Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityMetrics.security_alerts.map((alert, index) => (
                <Alert key={index} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="ml-2">{alert.message}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Security Events */}
      {recentEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-600" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentEvents.map((event, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(event.severity)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getThreatIcon(event.threat_type || 'unknown')}
                      <div>
                        <div className="font-medium">{event.event_type}</div>
                        <div className="text-sm text-gray-600">{event.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{event.client_ip}</div>
                    </div>
                  </div>
                  {event.subdomain && (
                    <div className="mt-2 text-xs text-gray-500">
                      Subdomain: {event.subdomain}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Metrics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Severity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
              Event Severity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityMetrics && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical Events</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${(securityMetrics.critical_events / securityMetrics.total_events) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{securityMetrics.critical_events}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Events</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{ width: `${(securityMetrics.high_events / securityMetrics.total_events) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{securityMetrics.high_events}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Score Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
              Security Score Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityMetrics && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getSecurityScoreColor(securityMetrics.overall_security_score).includes('green') ? 'bg-green-600' : 'bg-yellow-600'}`}
                          style={{ width: `${securityMetrics.overall_security_score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{securityMetrics.overall_security_score}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Subdomain Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getSecurityScoreColor(securityMetrics.average_security_score).includes('green') ? 'bg-green-600' : 'bg-yellow-600'}`}
                          style={{ width: `${securityMetrics.average_security_score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{securityMetrics.average_security_score}%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deployments */}
      {securityMetrics?.recent_deployments && securityMetrics.recent_deployments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5 text-purple-600" />
              Recent Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {securityMetrics.recent_deployments.map((subdomain, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{subdomain}</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Deployed recently
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-gray-600" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityMetrics && securityMetrics.critical_events > 0 && (
              <Alert className="border-red-500">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <strong>Critical:</strong> {securityMetrics.critical_events} critical security events detected. 
                  Immediate attention required.
                </AlertDescription>
              </Alert>
            )}
            
            {securityMetrics && securityMetrics.high_events > 5 && (
              <Alert className="border-orange-500">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription>
                  <strong>High:</strong> {securityMetrics.high_events} high-severity events detected. 
                  Review security configurations.
                </AlertDescription>
              </Alert>
            )}
            
            {securityMetrics && securityMetrics.overall_security_score < 80 && (
              <Alert className="border-yellow-500">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  <strong>Warning:</strong> Overall security score is {securityMetrics.overall_security_score}%. 
                  Consider implementing additional security measures.
                </AlertDescription>
              </Alert>
            )}
            
            {securityMetrics && securityMetrics.ssl_configured_count < securityMetrics.total_subdomains && (
              <Alert className="border-blue-500">
                <Lock className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>SSL:</strong> {securityMetrics.total_subdomains - securityMetrics.ssl_configured_count} subdomains 
                  without SSL configuration. Enable SSL for all subdomains.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 