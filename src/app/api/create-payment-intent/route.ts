import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe only if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: 'Payment service not configured' },
        { status: 503 }
      )
    }

    const { orderId, amount, currency = 'eur' } = await request.json()

    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create payment intent (let Stripe determine the eligible payment methods)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId,
      },
      automatic_payment_methods: { enabled: true },
      description: `Order ${orderId} - East at West Restaurant`,
    })

    return NextResponse.json({
      success: true,
      data: {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id
      }
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
} 