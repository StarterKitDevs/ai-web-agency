import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock project creation
    // In production, this would create a project in your backend
    const mockProject = {
      id: Math.floor(Math.random() * 1000) + 1,
      business_name: body.businessName,
      email: body.email,
      website_type: body.websiteType,
      features: body.features,
      design_style: body.designStyle,
      budget: body.budget,
      estimated_price: body.estimatedPrice,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    return NextResponse.json(mockProject, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
} 