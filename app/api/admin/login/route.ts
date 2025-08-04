import { NextRequest, NextResponse } from 'next/server';

const ADMIN_CREDENTIALS = {
  email: 'admin@webai.studio',
  password: 'admin123' // In production, use environment variables and proper hashing
};

// Simple token generation (in production, use proper JWT)
function generateToken(email: string) {
  const payload = {
    email,
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  return btoa(JSON.stringify(payload));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check admin credentials (in production, verify against database)
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Generate simple token
      const token = generateToken(ADMIN_CREDENTIALS.email);

      // Log successful login
      console.log('Admin login successful:', { email, timestamp: new Date().toISOString() });

      return NextResponse.json({
        success: true,
        token,
        user: {
          email: ADMIN_CREDENTIALS.email,
          role: 'admin'
        }
      });
    } else {
      // Log failed login attempt
      console.log('Admin login failed:', { email, timestamp: new Date().toISOString() });

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 