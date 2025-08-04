import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate payment data
    if (!body.project_id || !body.amount) {
      return NextResponse.json(
        { error: 'Missing project_id or amount' },
        { status: 400 }
      );
    }

    // Validate amount (must be positive and in cents)
    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create comprehensive payment intent
    const paymentIntent = {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      project_id: body.project_id,
      amount: body.amount,
      currency: 'usd',
      status: 'requires_payment_method',
      client_secret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      metadata: {
        project_id: body.project_id.toString(),
        source: 'ai_web_agency_frontend',
        version: '2.0'
      }
    };

    // Log payment intent creation
    console.log('Payment intent created:', {
      payment_intent_id: paymentIntent.id,
      project_id: paymentIntent.project_id,
      amount: paymentIntent.amount,
      amount_usd: (paymentIntent.amount / 100).toFixed(2)
    });

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 