import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    // For now, return a simple response
    // In production, this would call your backend API
    const response = {
      message: `I received your message: "${message}". This is a placeholder response.`,
      suggestions: [
        "Tell me about your project",
        "What's your budget?",
        "What type of website do you need?"
      ]
    }
    
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
} 