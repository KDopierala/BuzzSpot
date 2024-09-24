// hooks/useReservations.js
import { useEffect, useState } from 'react';

export default function useReservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Sprawdzenie, czy dane są już w sessionStorage
    const storedData = sessionStorage.getItem('reservations');
    if (storedData) {
      setReservations(JSON.parse(storedData));
      return;
    }

    // Pobieranie danych z API
    fetch('/api/reservations')
      .then(response => response.json())
      .then(data => {
        // Zapis danych w sessionStorage
        sessionStorage.setItem('reservations', JSON.stringify(data));
        setReservations(data);
      })
      .catch(error => {
        console.error('Błąd przy pobieraniu danych:', error);
      });
  }, []);

  return reservations;
}
