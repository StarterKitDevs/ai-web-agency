import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for live site URLs and documentation
let liveSites = new Map();
let documentation = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Get live site URL and documentation for the project
    const liveSiteUrl = liveSites.get(projectId) || `https://${projectId.toLowerCase().replace(/\s+/g, '-')}.webai.studio`;
    const projectDocs = documentation.get(projectId) || {
      deployment: 'https://vercel.com/dashboard',
      github: 'https://github.com/webai-studio',
      documentation: 'https://docs.webai.studio',
      analytics: 'https://analytics.google.com'
    };

    return NextResponse.json({
      success: true,
      liveSiteUrl,
      documentation: projectDocs
    });
  } catch (error) {
    console.error('Error fetching live site info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live site information' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, liveSiteUrl, documentation: docs } = body;
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Store live site URL and documentation
    if (liveSiteUrl) {
      liveSites.set(projectId, liveSiteUrl);
    }
    
    if (docs) {
      documentation.set(projectId, docs);
    }

    console.log(`Live site info updated for project ${projectId}:`, { liveSiteUrl, docs });

    return NextResponse.json({
      success: true,
      message: 'Live site information updated successfully'
    });
  } catch (error) {
    console.error('Error updating live site info:', error);
    return NextResponse.json(
      { error: 'Failed to update live site information' },
      { status: 500 }
    );
  }
} 