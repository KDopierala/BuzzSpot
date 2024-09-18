"use client";

import { useEffect, useState } from 'react';
import { calculatePrice, calculateParkingDuration } from '@/utils/priceCaclc';

interface Reservation {
  id: string; // Dodajemy id rezerwacji
  spotname: string;
  startDate: string;
  endDate: string;
}

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'ascending' | 'descending' | null }>({
    key: 'startDate',
    direction: 'ascending'
  });
  const currentDate = new Date();

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
        const ongoingReservations = data.filter(reservation => new Date(reservation.endDate) > currentDate);
        setReservations(ongoingReservations);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania danych z API:", error);
      });
  }, []);

  const deleteReservation = async (id: string) => {
    try {
      const response = await fetch(`/api/reservations`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Wysyłamy id rezerwacji, którą chcemy usunąć
      });
  
      if (response.ok) {
        setReservations(reservations.filter(reservation => reservation.id !== id));
      } else {
        throw new Error("Błąd podczas usuwania rezerwacji");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };
  

  const sortedReservations = [...reservations].sort((a, b) => {
    const getSortableValue = (reservation: Reservation, key: string) => {
      if (key === 'spotname') return reservation.spotname;
      if (key === 'startDate' || key === 'endDate') return new Date(reservation[key as keyof Reservation]).getTime();

      const startDate = new Date(reservation.startDate);
      const endDate = new Date(reservation.endDate);
      if (key === 'duration') {
        const { hours, minutes } = calculateParkingDuration(startDate, endDate);
        return hours * 60 + minutes;
      }
      if (key === 'price') {
        return calculatePrice(startDate, endDate);
      }
    };

    const aValue = getSortableValue(a, sortConfig.key);
    const bValue = getSortableValue(b, sortConfig.key);

    if (aValue! < bValue!) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (aValue! > bValue!) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Lista rezerwacji</h1>

      {reservations.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border p-2 cursor-pointer" onClick={() => requestSort('spotname')}>
                Miejsce {sortConfig.key === 'spotname' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
              </th>
              <th className="border p-2 cursor-pointer" onClick={() => requestSort('startDate')}>
                Data rozpoczęcia {sortConfig.key === 'startDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
              </th>
              <th className="border p-2 cursor-pointer" onClick={() => requestSort('endDate')}>
                Data zakończenia {sortConfig.key === 'endDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
              </th>
              <th className="border p-2 cursor-pointer" onClick={() => requestSort('duration')}>
                Czas postoju (godziny) {sortConfig.key === 'duration' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
              </th>
              <th className="border p-2 cursor-pointer" onClick={() => requestSort('price')}>
                Opłacona kwota {sortConfig.key === 'price' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
              </th>
              <th className="border p-2">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {sortedReservations.map((reservation) => {
              const startDate = new Date(reservation.startDate);
              const endDate = new Date(reservation.endDate);
              const { hours, minutes } = calculateParkingDuration(startDate, endDate);
              const price = calculatePrice(startDate, endDate);

              return (
                <tr key={reservation.id}>
                  <td className="border p-2">{reservation.spotname}</td>
                  <td className="border p-2">{startDate.toLocaleString()}</td>
                  <td className="border p-2">{endDate.toLocaleString()}</td>
                  <td className="border p-2">{hours} godz. {minutes} min.</td>
                  <td className="border p-2">{price} zł</td>
                  <td className="border p-2">
                    <button onClick={() => deleteReservation(reservation.id)} className="text-red-500">
                      🗑️
                    </button>
                  </td>
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
