'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity,
  BarChart3,
  Calendar,
  Download,
  Eye
} from 'lucide-react';

interface MetricData {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
}

interface ChartData {
  date: string;
  revenue: number;
  projects: number;
  conversions: number;
}

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      label: 'Total Revenue',
      value: '$12,450',
      change: '+15.3%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      label: 'Active Projects',
      value: '24',
      change: '+8.2%',
      changeType: 'positive',
      icon: Activity
    },
    {
      label: 'Conversion Rate',
      value: '68.5%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      label: 'Avg. Project Value',
      value: '$518',
      change: '+12.4%',
      changeType: 'positive',
      icon: BarChart3
    }
  ]);

  const [chartData, setChartData] = useState<ChartData[]>([
    { date: 'Jan 1', revenue: 1200, projects: 8, conversions: 65 },
    { date: 'Jan 2', revenue: 1800, projects: 12, conversions: 72 },
    { date: 'Jan 3', revenue: 2100, projects: 15, conversions: 78 },
    { date: 'Jan 4', revenue: 1600, projects: 11, conversions: 68 },
    { date: 'Jan 5', revenue: 2400, projects: 18, conversions: 82 },
    { date: 'Jan 6', revenue: 2800, projects: 22, conversions: 85 },
    { date: 'Jan 7', revenue: 3200, projects: 24, conversions: 88 }
  ]);

  const [topProjects, setTopProjects] = useState([
    { name: 'TechStart Inc', revenue: 1500, status: 'completed' },
    { name: 'Coffee Corner', revenue: 1250, status: 'completed' },
    { name: 'Fitness Studio', revenue: 2000, status: 'in-development' },
    { name: 'Digital Agency', revenue: 3000, status: 'pending' },
    { name: 'Local Restaurant', revenue: 800, status: 'completed' }
  ]);

  const [agentPerformance, setAgentPerformance] = useState([
    { name: 'Project Manager', efficiency: 95, tasks: 12, errors: 0 },
    { name: 'Design Agent', efficiency: 88, tasks: 8, errors: 2 },
    { name: 'Development Agent', efficiency: 92, tasks: 15, errors: 1 },
    { name: 'Deploy Agent', efficiency: 100, tasks: 6, errors: 0 },
    { name: 'QA Agent', efficiency: 97, tasks: 10, errors: 0 }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics & Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor business performance and agent efficiency
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.label}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${
                metric.changeType === 'positive' ? 'text-green-600' : 
                metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Revenue Trend
              <Badge variant="secondary">{timeRange}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className="w-8 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${(data.revenue / 3200) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500">{data.date}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Revenue over time</p>
            </div>
          </CardContent>
        </Card>

        {/* Projects Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Projects & Conversions
              <Badge variant="secondary">{timeRange}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="flex space-x-1">
                    <div 
                      className="w-3 bg-green-500 rounded-t transition-all duration-300"
                      style={{ height: `${(data.projects / 24) * 150}px` }}
                    ></div>
                    <div 
                      className="w-3 bg-purple-500 rounded-t transition-all duration-300"
                      style={{ height: `${(data.conversions / 88) * 150}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{data.date}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs">Projects</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-xs">Conversions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Top Revenue Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProjects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <Badge 
                        variant={project.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${project.revenue}</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentPerformance.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-gray-500">
                        {agent.tasks} tasks • {agent.errors} errors
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{agent.efficiency}%</div>
                    <div className="text-xs text-gray-500">Efficiency</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Peak Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>9:00 AM - 11:00 AM</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>2:00 PM - 4:00 PM</span>
                <span className="font-medium">32%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>7:00 PM - 9:00 PM</span>
                <span className="font-medium">23%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">4.8/5</div>
              <div className="text-sm text-gray-500 mt-1">Average Rating</div>
              <div className="mt-2 text-xs text-gray-400">
                Based on 127 reviews
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Growth</span>
                <span className="font-medium text-green-600">+23%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Customer Retention</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Agent Utilization</span>
                <span className="font-medium text-blue-600">87%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 