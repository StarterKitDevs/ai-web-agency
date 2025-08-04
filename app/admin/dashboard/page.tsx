'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Zap
} from 'lucide-react';
import { showError } from '@/lib/toast';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface Project {
  id: string;
  businessName: string;
  status: string;
  progress: number;
  agent: string;
  estimatedPrice: number;
  createdAt: string;
}

interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  currentTask: string;
  performance: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/projects?admin=true');
      const data = await response.json();
      
      if (data.success) {
        const projects = data.projects;
        
        // Calculate metrics from real data
        const activeProjects = projects.filter((p: any) => p.status !== 'completed' && p.status !== 'failed').length;
        const completedToday = projects.filter((p: any) => p.status === 'completed').length;
        const totalRevenue = projects.reduce((sum: number, p: any) => sum + p.estimatedPrice, 0);
        const todayRevenue = projects.filter((p: any) => p.status === 'completed').reduce((sum: number, p: any) => sum + p.estimatedPrice, 0);
        
        setMetrics([
          {
            title: 'Active Projects',
            value: activeProjects.toString(),
            change: `+${activeProjects - 8}`,
            changeType: 'positive',
            icon: Activity,
            color: 'text-blue-600'
          },
          {
            title: 'Revenue Today',
            value: `$${todayRevenue.toLocaleString()}`,
            change: '+12%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'text-green-600'
          },
          {
            title: 'Completed Today',
            value: completedToday.toString(),
            change: '+2',
            changeType: 'positive',
            icon: CheckCircle,
            color: 'text-purple-600'
          },
          {
            title: 'System Uptime',
            value: '99.9%',
            change: '0.1%',
            changeType: 'neutral',
            icon: TrendingUp,
            color: 'text-orange-600'
          }
        ]);

        // Set recent projects (latest 3)
        const recent = projects.slice(0, 3).map((p: any) => ({
          id: p.id,
          businessName: p.businessName,
          status: p.status,
          progress: p.progress,
          agent: p.agent,
          estimatedPrice: p.estimatedPrice,
          createdAt: p.createdAt
        }));
        setRecentProjects(recent);

        // Set agent status based on active projects
        const activeAgents = projects.filter((p: any) => p.status !== 'completed' && p.status !== 'failed');
        const agentStatus: Agent[] = [
          {
            id: '1',
            name: 'Project Manager',
            status: activeAgents.length > 0 ? 'busy' as const : 'online' as const,
            currentTask: activeAgents.length > 0 ? `Managing ${activeAgents[0]?.businessName} project` : 'Idle',
            performance: 95
          },
          {
            id: '2',
            name: 'Design Agent',
            status: activeAgents.filter((p: any) => p.agent === 'Design Agent').length > 0 ? 'busy' as const : 'online' as const,
            currentTask: activeAgents.filter((p: any) => p.agent === 'Design Agent').length > 0 
              ? `Creating UI for ${activeAgents.find((p: any) => p.agent === 'Design Agent')?.businessName}` 
              : 'Idle',
            performance: 88
          },
          {
            id: '3',
            name: 'Development Agent',
            status: activeAgents.filter((p: any) => p.agent === 'Development Agent').length > 0 ? 'busy' as const : 'online' as const,
            currentTask: activeAgents.filter((p: any) => p.agent === 'Development Agent').length > 0 
              ? `Building features for ${activeAgents.find((p: any) => p.agent === 'Development Agent')?.businessName}` 
              : 'Idle',
            performance: 92
          },
          {
            id: '4',
            name: 'Deploy Agent',
            status: activeAgents.filter((p: any) => p.agent === 'Deploy Agent').length > 0 ? 'busy' as const : 'offline' as const,
            currentTask: activeAgents.filter((p: any) => p.agent === 'Deploy Agent').length > 0 
              ? `Deploying ${activeAgents.find((p: any) => p.agent === 'Deploy Agent')?.businessName}` 
              : 'Idle',
            performance: 90
          }
        ];
        setAgents(agentStatus);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showError('Failed to load dashboard', 'Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your AI-powered website agency
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Pause className="mr-2 h-4 w-4" />
            Pause All
          </Button>
          <Button size="sm">
            <Play className="mr-2 h-4 w-4" />
            Resume All
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${
                metric.changeType === 'positive' ? 'text-green-600' : 
                metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change} from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Projects
              <Badge variant="secondary">12 Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{project.businessName}</h4>
                      <Badge 
                        variant={project.status === 'Completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span>{project.agent}</span>
                      <span>${project.estimatedPrice}</span>
                      <span>{project.createdAt}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Agents Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              AI Agents Status
              <Badge variant="secondary">15 Total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`h-3 w-3 rounded-full ${
                      agent.status === 'online' ? 'bg-green-500' :
                      agent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <h4 className="font-medium">{agent.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {agent.currentTask}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{agent.performance}%</div>
                    <div className="text-xs text-gray-500">Performance</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Zap className="h-6 w-6 mb-2" />
              <span className="text-sm">Create Project</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Manage Clients</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              <span className="text-sm">System Monitor</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              <span className="text-sm">View Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 