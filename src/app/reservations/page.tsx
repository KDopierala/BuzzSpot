"use client";

import { useEffect, useState } from 'react';
import { calculatePrice, calculateParkingDuration } from '@/utils/priceCaclc';
import NavMenu from '@/components/Navigation';
import Loader from '@/components/Loader'
import apiClient from '@/lib/apiClient';
import { UUID } from 'crypto';

interface Reservation {
  id: UUID;
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
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const data: Reservation[] = await apiClient.get('/api/reservations');
        const ongoingReservations = data.filter(reservation => new Date(reservation.endDate) > currentDate);
        setReservations(ongoingReservations);
      } catch (error) {
        console.error("Błąd podczas pobierania danych z API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const deleteReservation = async (id: UUID) => {
    setDeletingId(id);
    try {
      await apiClient.delete('/api/reservations', { id });
      setReservations(reservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error("Błąd:", error);
    } finally {
      setDeletingId(null);
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

  if (loading) {
    return <Loader width={100} height={100}/>;
  }

  return (
    <div className="p-6">
            <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">
          Lista rezerwacji
        </h1>
        <NavMenu />
      </div>

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
              <th className="border p-2">Anuluj</th>
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
                  {deletingId === reservation.id ? (
                <Loader/>
              ) : (
                <button onClick={() => deleteReservation(reservation.id)}>
                  🗑️
                </button>
              )}
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
