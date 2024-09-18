// src/app/api/reservations/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Importujemy funkcję do generowania UUID

const dataFilePath = path.join(process.cwd(), 'data', 'reservations.json');

export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const reservations = JSON.parse(data);
    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newReservation = await request.json();
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const reservations = JSON.parse(data);

    // Generujemy UUID dla nowej rezerwacji
    const reservationWithId = {
      ...newReservation,
      id: uuidv4(), // Generowanie unikalnego identyfikatora UUID
    };

    reservations.push(reservationWithId);
    fs.writeFileSync(dataFilePath, JSON.stringify(reservations, null, 2));

    return NextResponse.json(reservationWithId);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const data = fs.readFileSync(dataFilePath, 'utf8');
    let reservations = JSON.parse(data);

    const updatedReservations = reservations.filter((reservation: { id: string }) => reservation.id !== id);

    if (updatedReservations.length === reservations.length) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(updatedReservations, null, 2));

    return NextResponse.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
