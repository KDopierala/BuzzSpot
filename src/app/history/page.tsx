"use client";

import { useEffect, useState } from "react";
import { calculatePrice, calculateParkingDuration } from "@/utils/priceCaclc";
import NavMenu from '@/components/Navigation'; // Adjust the path if necessary

interface Reservation {
  spotname: string;
  startDate: string;
  endDate: string;
}

const HistoricalReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const currentDate = new Date(); // Aktualna data

  useEffect(() => {
    fetch("/api/reservations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Nie udało się pobrać danych z API");
        }
      })
      .then((data: Reservation[]) => {
        // Filtrowanie historycznych rezerwacji
        const historicalReservations = data.filter(
          (reservation) => new Date(reservation.endDate) <= currentDate
        );
        setReservations(historicalReservations);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania danych z API:", error);
      });
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">
          Historia rezerwacji
        </h1>
        <NavMenu />
      </div>

      {reservations.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border p-2">Miejsce</th>
              <th className="border p-2">Data rozpoczęcia</th>
              <th className="border p-2">Data zakończenia</th>
              <th className="border p-2">Czas postoju</th>
              <th className="border p-2">Opłacona kwota</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => {
              const startDate = new Date(reservation.startDate);
              const endDate = new Date(reservation.endDate);
              const { hours, minutes } = calculateParkingDuration(
                startDate,
                endDate
              );
              const price = calculatePrice(startDate, endDate);

              return (
                <tr key={index}>
                  <td className="border p-2">{reservation.spotname}</td>
                  <td className="border p-2">{startDate.toLocaleString()}</td>
                  <td className="border p-2">{endDate.toLocaleString()}</td>
                  <td className="border p-2">
                    {hours} godz. {minutes} min.
                  </td>
                  <td className="border p-2">{price} zł</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Brak historycznych rezerwacji.</p>
      )}
    </div>
  );
};

export default HistoricalReservationsPage;
