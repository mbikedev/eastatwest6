import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // First, let's check if the table exists by trying to select from it
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Table check error:', error);
      return NextResponse.json({
        success: false,
        tableExists: false,
        error: error.message,
        code: error.code,
        details: error.details
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      tableExists: true,
      message: 'Table exists and is accessible',
      sampleData: data
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred'
    }, { status: 500 });
  }
} 