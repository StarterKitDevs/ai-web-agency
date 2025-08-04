import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate project creation (in real app, this would save to database)
    const project = {
      id: Math.floor(Math.random() * 1000000),
      business_name: body.business_name || 'Your Business',
      website_type: body.website_type || 'business',
      features: body.features || ['responsive', 'seo', 'contact_form'],
      design_style: body.design_style || 'modern',
      budget: body.budget || 'standard',
      status: 'created',
      created_at: new Date().toISOString(),
      estimated_price: 99700 // $997 in cents
    };

    // In a real app, you would save this to your database
    console.log('Quick project created:', project);

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating quick project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 