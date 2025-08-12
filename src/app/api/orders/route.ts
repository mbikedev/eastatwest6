import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSSRClient } from '@/lib/supabaseServer'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Prefer service-role for writes (bypass RLS issues) if available; fallback to SSR anon client
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    if (!url) {
      console.error('Supabase URL missing: set NEXT_PUBLIC_SUPABASE_URL')
      return NextResponse.json({ success: false, error: 'Server config error: NEXT_PUBLIC_SUPABASE_URL is not set' }, { status: 500 })
    }

    if (!serviceKey && !anonKey) {
      console.error('Supabase keys missing: set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
      return NextResponse.json({ success: false, error: 'Server config error: missing SUPABASE keys' }, { status: 500 })
    }
    const supabase = serviceKey
      ? createAdminClient(url, serviceKey, { auth: { persistSession: false } })
      : await createSSRClient()
    const orderData = await request.json()

    // Validate required fields
    const requiredFields = ['customer_name', 'customer_email', 'customer_phone', 'delivery_type', 'delivery_date', 'delivery_time', 'total_amount']
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Normalize fields
    const normalizedTotal = Number(orderData.total_amount) || 0
    const normalizedTime = typeof orderData.delivery_time === 'string' && orderData.delivery_time.length === 5
      ? `${orderData.delivery_time}:00`
      : orderData.delivery_time
    const normalizedAddress = orderData.delivery_type === 'delivery' ? orderData.delivery_address : null

    // Validate formats early
    const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(orderData.delivery_date)
    const timeOk = /^\d{2}:\d{2}(:\d{2})?$/.test(normalizedTime)
    if (!dateOk) {
      return NextResponse.json({ success: false, error: 'Invalid delivery_date format. Expected YYYY-MM-DD.' }, { status: 400 })
    }
    if (!timeOk) {
      return NextResponse.json({ success: false, error: 'Invalid delivery_time format. Expected HH:MM or HH:MM:SS.' }, { status: 400 })
    }

    // Preflight: check table accessibility to give actionable error
    const preflight = await supabase
      .from('orders')
      .select('id', { head: true, count: 'exact' })
      .limit(0)
    if ((preflight as any)?.error) {
      const e = (preflight as any).error
      console.error('Orders table preflight failed:', e)
      return NextResponse.json(
        { success: false, error: `Orders table access failed: ${e.message || e.code || 'unknown'}` },
        { status: 500 }
      )
    }

    // Create order in database
    console.log('Creating order with payload:', {
      ...orderData,
      total_amount: normalizedTotal,
      delivery_time: normalizedTime,
      delivery_address: normalizedAddress,
    })

    const { data: orderRows, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        delivery_type: orderData.delivery_type,
        delivery_address: normalizedAddress,
        // Ensure proper Postgres types
        delivery_date: orderData.delivery_date, // YYYY-MM-DD
        delivery_time: normalizedTime, // HH:MM[:SS]
        additional_notes: orderData.additional_notes,
        total_amount: normalizedTotal,
        status: 'pending',
        language: orderData.language || 'en'
      }])
      .select()

    if (orderError || !orderRows || orderRows.length === 0) {
      console.error('Order creation error:', orderError)
      const pieces = [
        orderError?.message as any,
        (orderError as any)?.details,
        (orderError as any)?.hint,
        (orderError as any)?.code,
      ].filter(Boolean)
      const errorText = pieces.length > 0 ? pieces.join(' | ') : 'Failed to create order'
      return NextResponse.json({ success: false, error: errorText, debug: orderError ?? undefined }, { status: 500 })
    }

    // Create order items
    if (orderData.items && orderData.items.length > 0) {
      const newOrder = orderRows[0]
      const orderItems = orderData.items.map((item: { product_id: string; product_name: string; quantity: number; unit_price: number; total_price: number }) => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Order items creation error:', itemsError)
        // Note: We don't fail here as the order was created successfully
      }
    }

    return NextResponse.json({
      success: true,
      data: orderRows[0]
    })

  } catch (error) {
    console.error('Order creation error (catch):', error)
    const message = (error as any)?.message || (typeof error === 'string' ? error : JSON.stringify(error))
    return NextResponse.json(
      { success: false, error: `Order creation failed: ${message}` },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSSRClient()
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get order with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single()

    if (orderError) {
      console.error('Order retrieval error:', orderError)
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })

  } catch (error) {
    console.error('Order retrieval error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve order' },
      { status: 500 }
    )
  }
} 