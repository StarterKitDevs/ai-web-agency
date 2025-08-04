import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for projects (in production, this would be a database)
let projects = [
  {
    id: '1',
    businessName: 'TechStart Inc',
    email: 'contact@techstart.com',
    status: 'in-development',
    progress: 75,
    estimatedPrice: 150,
    createdAt: '2024-01-15',
    agent: 'Design Agent',
    description: 'Modern SaaS website with dashboard',
    websiteType: 'business',
    features: ['Responsive Design', 'Admin Dashboard'],
    designStyle: 'modern',
    budget: 250
  },
  {
    id: '2',
    businessName: 'Coffee Corner',
    email: 'hello@coffeecorner.com',
    status: 'completed',
    progress: 100,
    estimatedPrice: 125,
    createdAt: '2024-01-14',
    agent: 'Deploy Agent',
    description: 'Local coffee shop website',
    websiteType: 'business',
    features: ['Online Menu', 'Contact Form'],
    designStyle: 'classic',
    budget: 200
  },
  {
    id: '3',
    businessName: 'Fitness Studio',
    email: 'info@fitnessstudio.com',
    status: 'in-review',
    progress: 90,
    estimatedPrice: 200,
    createdAt: '2024-01-13',
    agent: 'QA Agent',
    description: 'Gym and fitness center website',
    websiteType: 'business',
    features: ['Class Booking', 'Member Portal'],
    designStyle: 'modern',
    budget: 300
  },
  {
    id: '4',
    businessName: 'Digital Agency',
    email: 'hello@digitalagency.com',
    status: 'pending',
    progress: 0,
    estimatedPrice: 300,
    createdAt: '2024-01-12',
    agent: 'Project Manager',
    description: 'Creative agency portfolio site',
    websiteType: 'portfolio',
    features: ['Portfolio Gallery', 'Contact Form'],
    designStyle: 'minimalist',
    budget: 400
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is an admin operation
    if (body.action === 'create') {
      // Admin creating a project
      const newProject = {
        id: (projects.length + 1).toString(),
        businessName: body.businessName,
        email: body.email,
        description: body.description || '',
        status: 'pending',
        progress: 0,
        agent: 'Project Manager',
        estimatedPrice: body.estimatedPrice || 150,
        createdAt: new Date().toISOString().split('T')[0],
        websiteType: body.websiteType || 'business',
        features: body.features || [],
        designStyle: body.designStyle || 'modern',
        budget: body.budget || 250
      };
      
      projects.unshift(newProject);
      console.log('Admin created project:', newProject.businessName);
      
      // Start automatic workflow
      setTimeout(() => startAutomaticWorkflow(newProject.id), 1000);
      
      return NextResponse.json({
        success: true,
        project: newProject,
        message: 'Project created successfully'
      });
    }
    
    // Client creating a project (from quote form)
    if (!body.business_name || !body.email || !body.website_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const project = {
      id: (projects.length + 1).toString(),
      businessName: body.business_name,
      email: body.email,
      websiteType: body.website_type,
      features: body.features || [],
      designStyle: body.design_style || 'modern',
      budget: body.budget || 250,
      estimatedPrice: body.estimated_price || 0,
      description: body.project_description || '',
      businessGoals: body.business_goals || '',
      targetAudience: body.target_audience || '',
      competitors: body.competitors || '',
      specialRequirements: body.special_requirements || '',
      images: body.images || [],
      status: 'pending',
      progress: 0,
      agent: 'Project Manager',
      createdAt: new Date().toISOString().split('T')[0]
    };

    projects.unshift(project);
    console.log('Client created project:', project.businessName);

    // Start automatic workflow for client projects
    setTimeout(() => startAutomaticWorkflow(project.id), 1000);

    return NextResponse.json({
      success: true,
      project: project,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// Automatic workflow function
async function startAutomaticWorkflow(projectId: string) {
  const projectIndex = projects.findIndex(p => p.id === projectId);
  if (projectIndex === -1) return;

  const workflowSteps = [
    {
      status: 'in-development',
      progress: 30,
      agent: 'Design Agent',
      delay: 2000,
      message: 'Project Manager assigned to Design Agent'
    },
    {
      status: 'in-development',
      progress: 60,
      agent: 'Development Agent',
      delay: 3000,
      message: 'Design completed, moving to Development Agent'
    },
    {
      status: 'in-review',
      progress: 90,
      agent: 'QA Agent',
      delay: 2500,
      message: 'Development completed, moving to QA Agent'
    },
    {
      status: 'completed',
      progress: 100,
      agent: 'Deploy Agent',
      delay: 2000,
      message: 'QA completed, deploying to production'
    }
  ];

  for (const step of workflowSteps) {
    await new Promise(resolve => setTimeout(resolve, step.delay));
    
    // Update project status
    if (projectIndex < projects.length) {
      projects[projectIndex] = {
        ...projects[projectIndex],
        status: step.status,
        progress: step.progress,
        agent: step.agent
      };
      
      console.log(`Project ${projects[projectIndex].businessName}: ${step.message}`);
      
      // If project is completed, generate live site URL and documentation
      if (step.status === 'completed') {
        await generateLiveSiteInfo(projectId, projects[projectIndex]);
      }
    }
  }
}

// Generate live site URL and documentation for completed projects
async function generateLiveSiteInfo(projectId: string, project: any) {
  try {
    const liveSiteUrl = `https://${project.businessName.toLowerCase().replace(/\s+/g, '-')}.webai.studio`;
    const documentation = {
      deployment: 'https://vercel.com/dashboard',
      github: `https://github.com/webai-studio/${project.businessName.toLowerCase().replace(/\s+/g, '-')}`,
      documentation: `https://docs.webai.studio/projects/${projectId}`,
      analytics: 'https://analytics.google.com'
    };

    // Store live site information
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/projects/live-site`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        liveSiteUrl,
        documentation
      })
    });

    if (response.ok) {
      console.log(`Live site info generated for ${project.businessName}:`, { liveSiteUrl, documentation });
    }
  } catch (error) {
    console.error('Error generating live site info:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');
    
    if (admin === 'true') {
      // Return all projects for admin
      return NextResponse.json({
        success: true,
        projects: projects,
        total: projects.length
      });
    }
    
    // Return filtered projects for client
    const status = searchParams.get('status');
    const filteredProjects = status 
      ? projects.filter(p => p.status === status)
      : projects;

    return NextResponse.json({
      success: true,
      projects: filteredProjects,
      total: filteredProjects.length
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updateData
    };
    
    console.log('Project updated:', projects[projectIndex].businessName);
    
    return NextResponse.json({
      success: true,
      project: projects[projectIndex],
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    const deletedProject = projects[projectIndex];
    projects.splice(projectIndex, 1);
    
    console.log('Project deleted:', deletedProject.businessName);
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 