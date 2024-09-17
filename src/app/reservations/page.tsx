"use client";

import { useEffect, useState } from 'react';
import { calculatePrice, calculateParkingDuration } from '@/utils/priceCaclc'; // Import funkcji


interface Reservation {
  spotname: string;
  startDate: Date;
  endDate: Date;
  ratePerHour: number;
}

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

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
        console.log("Dane z API:", data);
        setReservations(data);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania danych z API:", error);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Lista rezerwacji</h1>

      {reservations.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border p-2">Miejsce</th>
              <th className="border p-2">Data rozpoczęcia</th>
              <th className="border p-2">Data zakończenia</th>
              <th className="border p-2">Czas postoju (godziny)</th>
              <th className="border p-2">Opłacona kwota</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => {
              const duration = calculateParkingDuration(reservation.startDate, reservation.endDate);
              const amount = calculatePrice(reservation.startDate, reservation.endDate);

              return (
                <tr key={index}>
                  <td className="border p-2">{reservation.spotname}</td>
                  <td className="border p-2">{new Date(reservation.startDate).toLocaleString()}</td>
                  <td className="border p-2">{new Date(reservation.endDate).toLocaleString()}</td>
                  <td className="border p-2">{duration.hours}godz. {duration.minutes}min.</td>
                  <td className="border p-2">{amount.toFixed(2)} zł</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Brak rezerwacji do wyświetlenia.</p>
      )}
    </div>
  );
};

export default ReservationsPage;
