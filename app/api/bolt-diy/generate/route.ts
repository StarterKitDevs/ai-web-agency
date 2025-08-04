import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      template,
      websiteName,
      businessDescription,
      designStyle,
      colorScheme,
      features,
      budget,
      layout,
      sections,
      advancedFeatures,
      customRequirements,
      additionalInput
    } = body;

    // Validate required fields
    if (!template || !websiteName) {
      return NextResponse.json(
        { error: 'Template and website name are required' },
        { status: 400 }
      );
    }

    // Create comprehensive prompt for AI generation
    const createProfessionalPrompt = () => {
      let prompt = `Create a professional website with the following specifications:\n\n`;
      
      // Basic Information
      prompt += `**PROJECT OVERVIEW:**\n`;
      prompt += `- Website Name: ${websiteName}\n`;
      prompt += `- Template Type: ${template.name}\n`;
      if (businessDescription) {
        prompt += `- Business Description: ${businessDescription}\n`;
      }
      prompt += `- Budget Range: $${budget}\n\n`;
      
      // Design Specifications
      prompt += `**DESIGN SPECIFICATIONS:**\n`;
      if (designStyle) {
        prompt += `- Design Style: ${designStyle}\n`;
      }
      if (colorScheme) {
        prompt += `- Color Scheme: ${colorScheme}\n`;
      }
      prompt += `- Features: ${features.join(', ')}\n\n`;
      
      // Freestyle-specific details
      if (template.id === 'freestyle') {
        prompt += `**FREESTYLE CUSTOMIZATION:**\n`;
        prompt += `- Layout Type: ${layout}\n`;
        prompt += `- Page Sections: ${sections.join(', ')}\n`;
        prompt += `- Advanced Features: ${advancedFeatures.join(', ')}\n`;
        if (customRequirements) {
          prompt += `- Custom Requirements: ${customRequirements}\n`;
        }
        prompt += `\n`;
      }
      
      // Additional user input
      if (additionalInput) {
        prompt += `**ADDITIONAL REQUIREMENTS:**\n`;
        prompt += `${additionalInput}\n\n`;
      }
      
      prompt += `**TECHNICAL REQUIREMENTS:**\n`;
      prompt += `- Responsive design for all devices\n`;
      prompt += `- Modern, clean UI/UX\n`;
      prompt += `- Fast loading times\n`;
      prompt += `- SEO optimized\n`;
      prompt += `- Accessible design\n\n`;
      
      prompt += `Please create a professional, modern website that meets all these specifications.`;
      
      return prompt;
    };

    const professionalPrompt = createProfessionalPrompt();
    
    // Log the professional prompt for debugging
    console.log('Professional Prompt Generated:', professionalPrompt);

    // Simulate AI website generation process
    const generationSteps = [
      {
        step: 'Analyzing Requirements',
        description: 'Processing your business requirements and design preferences',
        progress: 20
      },
      {
        step: 'Designing Layout',
        description: 'Creating responsive layouts based on your chosen template',
        progress: 40
      },
      {
        step: 'Building Components',
        description: 'Developing interactive components and features',
        progress: 60
      },
      {
        step: 'Optimizing Performance',
        description: 'Optimizing for speed, SEO, and mobile responsiveness',
        progress: 80
      },
      {
        step: 'Finalizing Website',
        description: 'Adding final touches and preparing for deployment',
        progress: 100
      }
    ];

    // Calculate estimated price
    const basePrice = template.price || 299;
    
    // Generate unique project ID
    const projectId = `bolt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    if (template.id === 'freestyle') {
      // Freestyle pricing: base + sections + advanced features
      const sectionPrice = (sections?.length || 0) * 25;
      const advancedFeaturePrice = (advancedFeatures?.length || 0) * 50;
      const totalPrice = basePrice + sectionPrice + advancedFeaturePrice;
      
      // Create project data with Freestyle-specific info
      const projectData = {
        id: projectId,
        name: websiteName,
        template: template.name,
        description: businessDescription,
        style: designStyle,
        colorScheme,
        features,
        budget,
        totalPrice,
        status: 'generating',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes for Freestyle
        // Freestyle-specific data
        layout,
        sections,
        advancedFeatures,
        customRequirements,
        additionalInput,
        // Professional prompt
        professionalPrompt
      };
      
      // Enhanced generation steps for conversational AI
      const enhancedSteps = [
        {
          step: 'Understanding Requirements',
          description: 'Analyzing your description and requirements',
          progress: 15
        },
        {
          step: 'Designing Architecture',
          description: 'Creating the perfect structure for your needs',
          progress: 30
        },
        {
          step: 'Building Components',
          description: 'Developing interactive elements and features',
          progress: 50
        },
        {
          step: 'Styling & Animations',
          description: 'Adding beautiful design and smooth interactions',
          progress: 70
        },
        {
          step: 'Optimizing Performance',
          description: 'Making it fast and mobile-friendly',
          progress: 85
        },
        {
          step: 'Finalizing Website',
          description: 'Adding final touches and preparing for launch',
          progress: 100
        }
      ];
      
      return NextResponse.json({
        success: true,
        project: projectData,
        generationSteps: enhancedSteps,
        message: 'Freestyle website generation started successfully'
      });
    } else {
      // Standard template pricing
      const additionalFeatures = features.length - (template.features?.length || 0);
      const totalPrice = basePrice + (additionalFeatures * 50);
      
      // Create project data
      const projectData = {
        id: projectId,
        name: websiteName,
        template: template.name,
        description: businessDescription,
        style: designStyle,
        colorScheme,
        features,
        budget,
        totalPrice,
        status: 'generating',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
        additionalInput,
        // Professional prompt
        professionalPrompt
      };
      
      // Enhanced generation steps for conversational AI
      const enhancedSteps = [
        {
          step: 'Understanding Requirements',
          description: 'Analyzing your description and requirements',
          progress: 20
        },
        {
          step: 'Designing Layout',
          description: 'Creating responsive layouts based on your template',
          progress: 40
        },
        {
          step: 'Building Components',
          description: 'Developing interactive components and features',
          progress: 60
        },
        {
          step: 'Optimizing Performance',
          description: 'Optimizing for speed, SEO, and mobile responsiveness',
          progress: 80
        },
        {
          step: 'Finalizing Website',
          description: 'Adding final touches and preparing for deployment',
          progress: 100
        }
      ];
      
      return NextResponse.json({
        success: true,
        project: projectData,
        generationSteps: enhancedSteps,
        message: 'Website generation started successfully'
      });
    }

  } catch (error) {
    console.error('Bolt DIY generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate website' },
      { status: 500 }
    );
  }
}

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

    // Simulate fetching project status
    const projectStatus = {
      id: projectId,
      status: 'completed',
      progress: 100,
      downloadUrl: `https://download.webai.studio/${projectId}.zip`,
      previewUrl: `https://preview.webai.studio/${projectId}`,
      liveUrl: `https://${projectId}.webai.studio`,
      completedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      project: projectStatus
    });

  } catch (error) {
    console.error('Bolt DIY status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check project status' },
      { status: 500 }
    );
  }
} 