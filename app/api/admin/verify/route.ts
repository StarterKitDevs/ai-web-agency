import { NextRequest, NextResponse } from 'next/server';

// Simple token verification (in production, use proper JWT)
function verifyToken(token: string) {
  try {
    const decoded = JSON.parse(atob(token));
    
    // Check if token is expired
    if (decoded.exp && Date.now() >= decoded.exp) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = verifyToken(token);
    
    if (!decoded) {
      console.log('Admin token verification failed:', { timestamp: new Date().toISOString() });
      
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Log successful verification
    console.log('Admin token verified:', { email: decoded.email, timestamp: new Date().toISOString() });

    return NextResponse.json({
      success: true,
      user: {
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 