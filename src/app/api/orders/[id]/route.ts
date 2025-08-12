import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const orderId = id

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const orderId = id
    const updateData = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Update order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single()

    if (orderError) {
      console.error('Order update error:', orderError)
      return NextResponse.json(
        { success: false, error: 'Failed to update order' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })

  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
} 