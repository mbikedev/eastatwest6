import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const invoiceNumber = searchParams.get('invoice')

    if (!invoiceNumber) {
      return NextResponse.json(
        { success: false, error: 'Invoice number is required' },
        { status: 400 }
      )
    }

    // Find the reservation by invoice number
    const { data: reservation, error: findError } = await supabase
      .from('reservations')
      .select('*')
      .eq('invoice_number', invoiceNumber)
      .single()

    if (findError || !reservation) {
      return NextResponse.json(
        { success: false, error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Check if reservation is already cancelled
    if (reservation.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'Reservation is already cancelled' },
        { status: 400 }
      )
    }

    // Update reservation status to cancelled
    const { error: updateError } = await supabase
      .from('reservations')
      .update({ 
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('invoice_number', invoiceNumber)

    if (updateError) {
      console.error('Failed to cancel reservation:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to cancel reservation' },
        { status: 500 }
      )
    }

    // Send cancellation confirmation email
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-cancellation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: reservation.email,
          language: reservation.language || 'en',
          reservationData: reservation
        }),
      })
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError)
      // Don't fail the cancellation if email fails
    }

    // Redirect to a success page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://eastatwest.com'}/reservations?cancelled=true`)

  } catch (error) {
    console.error('Error cancelling reservation:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { invoiceNumber } = await request.json()

    if (!invoiceNumber) {
      return NextResponse.json(
        { success: false, error: 'Invoice number is required' },
        { status: 400 }
      )
    }

    // Find the reservation by invoice number
    const { data: reservation, error: findError } = await supabase
      .from('reservations')
      .select('*')
      .eq('invoice_number', invoiceNumber)
      .single()

    if (findError || !reservation) {
      return NextResponse.json(
        { success: false, error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Check if reservation is already cancelled
    if (reservation.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'Reservation is already cancelled' },
        { status: 400 }
      )
    }

    // Update reservation status to cancelled
    const { error: updateError } = await supabase
      .from('reservations')
      .update({ 
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('invoice_number', invoiceNumber)

    if (updateError) {
      console.error('Failed to cancel reservation:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to cancel reservation' },
        { status: 500 }
      )
    }

    // Send cancellation confirmation email
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-cancellation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: reservation.email,
          language: reservation.language || 'en',
          reservationData: reservation
        }),
      })
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError)
      // Don't fail the cancellation if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation cancelled successfully'
    })

  } catch (error) {
    console.error('Error cancelling reservation:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 