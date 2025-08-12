import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Try to insert a test record to see what the actual error is
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      reservation_date: '2024-01-01',
      start_time: '12:00:00',
      end_time: '13:00:00',
      number_of_guests: 2,
      special_requests: 'Test reservation'
    };
    
    console.log('Attempting to insert test data:', testData);
    
    const { data, error } = await supabase
      .from('reservations')
      .insert(testData)
      .select();
    
    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        attemptedData: testData
      }, { status: 500 });
    }
    
    // If successful, delete the test record
    if (data && data.length > 0) {
      await supabase
        .from('reservations')
        .delete()
        .eq('id', data[0].id);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Table structure is correct',
      testData: testData
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred'
    }, { status: 500 });
  }
} 