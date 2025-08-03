import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id

    // Mock project status data
    // In production, this would fetch from your backend API
    const mockProjectStatus = {
      id: parseInt(projectId),
      status: 'in_progress',
      progress_percentage: 65,
      current_agent: 'Development Agent',
      agent_logs: [
        {
          id: 1,
          agent_type: 'design',
          status: 'completed',
          message: 'Design mockups created successfully',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          agent_type: 'development',
          status: 'in_progress',
          message: 'Building responsive components and implementing features',
          created_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 3,
          agent_type: 'deployment',
          status: 'pending',
          message: 'Waiting for development to complete',
          created_at: new Date(Date.now() - 900000).toISOString()
        },
        {
          id: 4,
          agent_type: 'notification',
          status: 'pending',
          message: 'Will notify when deployment is ready',
          created_at: new Date(Date.now() - 300000).toISOString()
        }
      ]
    }

    return NextResponse.json(mockProjectStatus)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project status' },
      { status: 500 }
    )
  }
} 