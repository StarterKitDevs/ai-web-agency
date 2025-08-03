'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Download, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface ProjectStatus {
  id: number
  status: string
  progress_percentage: number
  current_agent?: string
  agent_logs: Array<{
    id: number
    agent_type: string
    status: string
    message: string
    created_at: string
  }>
}

export default function DashboardContent() {
  const [projectStatus, setProjectStatus] = useState<ProjectStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock project data - in real app, this would come from auth context
  const mockProjectId = 1

  useEffect(() => {
    fetchProjectStatus()
    setupRealtimeSubscription()
  }, [])

  const fetchProjectStatus = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/projects/${mockProjectId}/status`)
      if (!response.ok) {
        throw new Error('Failed to fetch project status')
      }
      
      const data = await response.json()
      setProjectStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status')
    } finally {
      setIsLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    // Subscribe to project status changes
    const channel = supabase
      .channel('project_status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${mockProjectId}`
        },
        (payload) => {
          console.log('Project status changed:', payload)
          fetchProjectStatus()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_logs',
          filter: `project_id=eq.${mockProjectId}`
        },
        (payload) => {
          console.log('Agent log changed:', payload)
          fetchProjectStatus()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleDownload = async () => {
    try {
      // In real app, this would trigger file download
      console.log('Downloading project files...')
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Download started!')
    } catch (err) {
      setError('Failed to download files')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button onClick={fetchProjectStatus} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Project Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Project Status
            {projectStatus && getStatusIcon(projectStatus.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <Badge className={getStatusColor(projectStatus?.status || 'pending')}>
                {projectStatus?.status || 'pending'}
              </Badge>
            </div>
            
            <Progress 
              value={projectStatus?.progress_percentage || 0} 
              className="h-2"
            />
            
            <div className="text-sm text-muted-foreground">
              {projectStatus?.progress_percentage || 0}% Complete
            </div>

            {projectStatus?.current_agent && (
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Current: {projectStatus.current_agent}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agent Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projectStatus?.agent_logs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  {getStatusIcon(log.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium capitalize">
                      {log.agent_type}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-xs',
                        log.status === 'completed' && 'border-green-200 text-green-700',
                        log.status === 'failed' && 'border-red-200 text-red-700'
                      )}
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            
            {(!projectStatus?.agent_logs || projectStatus.agent_logs.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <p>No activity yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Download Section */}
      {projectStatus?.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle>Download Files</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDownload} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Project Files
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button 
          onClick={fetchProjectStatus} 
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          Refresh Status
        </Button>
      </div>
    </div>
  )
} 