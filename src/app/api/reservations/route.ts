// src/app/api/reservations/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newReservation = await request.json();
    
    // Dodanie UUID do nowej rezerwacji
    const reservationWithId = {
      ...newReservation,
    };

    const { data, error } = await supabase
      .from('reservations')
      .insert([reservationWithId]);

    if (error) {
      throw error;
    }
    // console.log(reservationWithId)
    return NextResponse.json(data);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { data, error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
