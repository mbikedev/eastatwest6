import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabaseServer'

// Initialize Stripe only if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  // Check if Stripe is properly configured
  if (!stripe || !endpointSecret) {
    return NextResponse.json(
      { error: 'Webhook service not configured' },
      { status: 503 }
    )
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailure(failedPayment)
        break

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object as Stripe.PaymentIntent
        await handlePaymentCanceled(canceledPayment)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId

  if (!orderId) {
    console.error('No order ID in payment intent metadata')
    return
  }

  try {
    const supabase = await createClient()
    // Update order status to paid
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_intent_id: paymentIntent.id,
        paid_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Failed to update order status:', updateError)
      return
    }

    // Send confirmation email
    await sendOrderConfirmationEmail(orderId)

    console.log(`Order ${orderId} marked as paid`)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId

  if (!orderId) {
    console.error('No order ID in payment intent metadata')
    return
  }

  try {
    const supabase = await createClient()
    // Update order status to failed
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'payment_failed',
        payment_intent_id: paymentIntent.id
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Failed to update order status:', updateError)
      return
    }

    console.log(`Order ${orderId} payment failed`)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId

  if (!orderId) {
    console.error('No order ID in payment intent metadata')
    return
  }

  try {
    const supabase = await createClient()
    // Update order status to canceled
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'canceled',
        payment_intent_id: paymentIntent.id
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Failed to update order status:', updateError)
      return
    }

    console.log(`Order ${orderId} payment canceled`)
  } catch (error) {
    console.error('Error handling payment cancellation:', error)
  }
}

async function sendOrderConfirmationEmail(orderId: string) {
  try {
    const supabase = await createClient()
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('Failed to get order details for email:', orderError)
      return
    }

    // Send email using existing email API
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-reservation-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: order.customer_email,
        subject: `Order Confirmation - East at West`,
        template: 'order-confirmation',
        data: {
          orderId: order.id,
          customerName: order.customer_name,
          totalAmount: order.total_amount,
          deliveryType: order.delivery_type,
          deliveryDate: order.delivery_date,
          deliveryTime: order.delivery_time,
          items: order.order_items
        }
      })
    })

    if (!emailResponse.ok) {
      console.error('Failed to send order confirmation email')
    }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
  }
} 