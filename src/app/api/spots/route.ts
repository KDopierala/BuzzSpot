// src/app/api/reservations/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "spots.json");

export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const reservations = JSON.parse(data);
    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newReservation = await request.json();
    const data = fs.readFileSync(dataFilePath, "utf8");
    const reservations = JSON.parse(data);

    reservations.push(newReservation);
    fs.writeFileSync(dataFilePath, JSON.stringify(reservations, null, 2));

    return NextResponse.json(newReservation);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
