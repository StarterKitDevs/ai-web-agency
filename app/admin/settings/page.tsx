'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Key, 
  Users, 
  Shield, 
  Database, 
  Bell,
  Globe,
  Save,
  Eye,
  EyeOff,
  Copy,
  RefreshCw
} from 'lucide-react';

interface ApiKey {
  name: string;
  key: string;
  status: 'active' | 'inactive';
  lastUsed: string;
  permissions: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'operator';
  status: 'active' | 'inactive';
  lastLogin: string;
}

export default function AdminSettings() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      name: 'Perplexity API',
      key: 'pplx-1234567890abcdef',
      status: 'active',
      lastUsed: '2 hours ago',
      permissions: ['read', 'write']
    },
    {
      name: 'Supabase API',
      key: 'sb-1234567890abcdef',
      status: 'active',
      lastUsed: '1 hour ago',
      permissions: ['read', 'write', 'admin']
    },
    {
      name: 'Stripe API',
      key: 'sk_test_1234567890abcdef',
      status: 'active',
      lastUsed: '30 minutes ago',
      permissions: ['read', 'write']
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@webai.studio',
      role: 'super-admin',
      status: 'active',
      lastLogin: '2 minutes ago'
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@webai.studio',
      role: 'admin',
      status: 'active',
      lastLogin: '1 hour ago'
    },
    {
      id: '3',
      name: 'Jane Smith',
      email: 'jane@webai.studio',
      role: 'operator',
      status: 'inactive',
      lastLogin: '2 days ago'
    }
  ]);

  const [showApiKeys, setShowApiKeys] = useState(false);
  const [systemSettings, setSystemSettings] = useState({
    autoDeploy: true,
    emailNotifications: true,
    backupEnabled: true,
    maintenanceMode: false,
    debugMode: false
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const regenerateApiKey = (index: number) => {
    const newKey = `key_${Math.random().toString(36).substr(2, 9)}`;
    setApiKeys(prev => prev.map((key, i) => 
      i === index ? { ...key, key: newKey } : key
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            System Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your AI-powered website agency platform
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* API Keys Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" />
            API Keys Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{apiKey.name}</h4>
                    <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                      {apiKey.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {showApiKeys ? apiKey.key : '••••••••••••••••'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKeys(!showApiKeys)}
                    >
                      {showApiKeys ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Last used: {apiKey.lastUsed}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => regenerateApiKey(index)}
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Regenerate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Deploy</Label>
                  <p className="text-sm text-gray-500">Automatically deploy completed projects</p>
                </div>
                <Switch
                  checked={systemSettings.autoDeploy}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoDeploy: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Send email notifications for important events</p>
                </div>
                <Switch
                  checked={systemSettings.emailNotifications}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Backup Enabled</Label>
                  <p className="text-sm text-gray-500">Automatically backup project data</p>
                </div>
                <Switch
                  checked={systemSettings.backupEnabled}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, backupEnabled: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Put system in maintenance mode</p>
                </div>
                <Switch
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-gray-500">Enable debug logging</p>
                </div>
                <Switch
                  checked={systemSettings.debugMode}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, debugMode: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{user.name}</h4>
                      <Badge 
                        variant={user.role === 'super-admin' ? 'destructive' : user.role === 'admin' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">Last login: {user.lastLogin}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Backup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Session Timeout (minutes)</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Two-Factor Authentication</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch />
                  <span className="text-sm text-gray-500">Require 2FA for all users</span>
                </div>
              </div>
              
              <div>
                <Label>Password Policy</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <span className="text-sm">Minimum 8 characters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <span className="text-sm">Require uppercase</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <span className="text-sm">Require numbers</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Backup & Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Backup Schedule</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Retention Period</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Database className="mr-2 h-4 w-4" />
                  Create Manual Backup
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restore from Backup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch defaultChecked />
                <span className="text-sm">Project completion</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch defaultChecked />
                <span className="text-sm">Payment received</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch defaultChecked />
                <span className="text-sm">System errors</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch defaultChecked />
                <span className="text-sm">Agent status changes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch />
                <span className="text-sm">Marketing updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch defaultChecked />
                <span className="text-sm">Security alerts</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 