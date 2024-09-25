// src/app/api/reservations/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase.from("reservations").select("*");

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newReservation = await request.json();

    const reservationWithId = {
      ...newReservation,
    };

    const { data, error } = await supabase
      .from("reservations")
      .insert([reservationWithId]);

    if (error) {
      throw error;
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("reservations").delete().eq("id", id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 }); // Success, no content to return
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
