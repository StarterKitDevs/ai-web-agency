'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Activity,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  MessageSquare,
  Terminal
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  currentTask: string;
  performance: number;
  uptime: string;
  lastActivity: string;
  queueLength: number;
  errorCount: number;
}

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Project Manager',
      description: 'Orchestrates project workflow and coordinates other agents',
      status: 'online',
      currentTask: 'Managing TechStart Inc project',
      performance: 95,
      uptime: '99.8%',
      lastActivity: '2 minutes ago',
      queueLength: 2,
      errorCount: 0
    },
    {
      id: '2',
      name: 'Design Agent',
      description: 'Creates UI/UX designs and visual assets',
      status: 'busy',
      currentTask: 'Creating UI for Coffee Corner',
      performance: 88,
      uptime: '98.5%',
      lastActivity: '5 minutes ago',
      queueLength: 1,
      errorCount: 2
    },
    {
      id: '3',
      name: 'Development Agent',
      description: 'Builds website functionality and code',
      status: 'online',
      currentTask: 'Building Fitness Studio features',
      performance: 92,
      uptime: '99.2%',
      lastActivity: '1 minute ago',
      queueLength: 3,
      errorCount: 1
    },
    {
      id: '4',
      name: 'Deploy Agent',
      description: 'Handles deployment and hosting setup',
      status: 'offline',
      currentTask: 'Idle',
      performance: 100,
      uptime: '99.9%',
      lastActivity: '10 minutes ago',
      queueLength: 0,
      errorCount: 0
    },
    {
      id: '5',
      name: 'QA Agent',
      description: 'Tests and validates website functionality',
      status: 'online',
      currentTask: 'Testing completed projects',
      performance: 97,
      uptime: '99.5%',
      lastActivity: '30 seconds ago',
      queueLength: 1,
      errorCount: 0
    },
    {
      id: '6',
      name: 'SEO Agent',
      description: 'Optimizes websites for search engines',
      status: 'error',
      currentTask: 'Error: Connection timeout',
      performance: 75,
      uptime: '95.2%',
      lastActivity: '15 minutes ago',
      queueLength: 4,
      errorCount: 5
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [chatMessage, setChatMessage] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'offline':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAgentAction = (agentId: string, action: 'start' | 'stop' | 'restart') => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: action === 'start' ? 'online' : action === 'stop' ? 'offline' : 'online' }
        : agent
    ));
  };

  const sendChatMessage = () => {
    if (chatMessage.trim() && selectedAgent) {
      console.log(`Sending message to ${selectedAgent.name}: ${chatMessage}`);
      setChatMessage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Agents Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and control your AI agent workforce
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Pause className="mr-2 h-4 w-4" />
            Pause All
          </Button>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Start All
          </Button>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(agent.status)}>
                  {getStatusIcon(agent.status)}
                  <span className="ml-1 capitalize">{agent.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {agent.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Performance</span>
                    <span className="font-medium">{agent.performance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        agent.performance >= 90 ? 'bg-green-500' :
                        agent.performance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${agent.performance}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Uptime</span>
                    <p className="font-medium">{agent.uptime}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Queue</span>
                    <p className="font-medium">{agent.queueLength}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Activity</span>
                    <p className="font-medium">{agent.lastActivity}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Errors</span>
                    <p className="font-medium">{agent.errorCount}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-gray-500">Current Task:</span>
                  <p className="font-medium truncate">{agent.currentTask}</p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAgent(agent)}
                    className="flex-1"
                  >
                    <Settings className="mr-1 h-3 w-3" />
                    Configure
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAgentAction(agent.id, agent.status === 'online' ? 'stop' : 'start')}
                    className="flex-1"
                  >
                    {agent.status === 'online' ? (
                      <>
                        <Pause className="mr-1 h-3 w-3" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="mr-1 h-3 w-3" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agent Details Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Bot className="h-8 w-8 text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAgent.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{selectedAgent.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAgent(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Agent Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Status</span>
                        <Badge className={getStatusColor(selectedAgent.status)}>
                          {getStatusIcon(selectedAgent.status)}
                          <span className="ml-1 capitalize">{selectedAgent.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Performance</span>
                        <span className="font-medium">{selectedAgent.performance}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Uptime</span>
                        <span className="font-medium">{selectedAgent.uptime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Queue Length</span>
                        <span className="font-medium">{selectedAgent.queueLength}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Error Count</span>
                        <span className="font-medium">{selectedAgent.errorCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last Activity</span>
                        <span className="font-medium">{selectedAgent.lastActivity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Agent Chat */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Agent Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-32 bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm overflow-y-auto">
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                              <span className="font-medium">System:</span>
                              <p className="text-gray-600 dark:text-gray-400">Agent {selectedAgent.name} is ready for commands.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <div>
                              <span className="font-medium">{selectedAgent.name}:</span>
                              <p className="text-gray-600 dark:text-gray-400">Current task: {selectedAgent.currentTask}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Send a command to the agent..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                        />
                        <Button onClick={sendChatMessage} size="sm">
                          <Terminal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex space-x-2 mt-6">
                <Button
                  onClick={() => handleAgentAction(selectedAgent.id, selectedAgent.status === 'online' ? 'stop' : 'start')}
                >
                  {selectedAgent.status === 'online' ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Stop Agent
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Agent
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Agent
                </Button>
                <Button variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Logs
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 