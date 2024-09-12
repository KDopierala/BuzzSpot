"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-datepicker/dist/react-datepicker.css';
import "leaflet/dist/leaflet.css";
import DatePicker from 'react-datepicker';
import { LatLngExpression } from 'leaflet';
import ReservationPopup from '../../components/ReservationPopup'; // Importowanie komponentu popupu

const Map = dynamic(() => import('../../components/Map'), { ssr: false });

const ReservePage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedLocation, setSelectedLocation] = useState<LatLngExpression | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [spotname, setSpotname] = useState<string>('');
  const [spotsData, setSpotsData] = useState<any[]>([]); // Dodanie stanu na przechowywanie danych z API

  // Funkcja do pobierania danych z API
  useEffect(() => {
    fetch('/api/spots', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json(); // Przetworzenie odpowiedzi jako JSON
        } else {
          throw new Error('Nie udało się pobrać danych z API');
        }
      })
      .then(data => {
        console.log('Dane z API:', data);
        setSpotsData(data); // Zapisanie danych w stanie
      })
      .catch(error => {
        console.error('Błąd podczas pobierania danych z API:', error);
      });
  }, []);


  const handleConfirm = async () => {
    if (!selectedLocation) {
      alert('Proszę wybrać lokalizację');
      return;
    }

    const selectedSpot = spotsData.find(spot => 
      JSON.stringify(spot.location) === JSON.stringify(selectedLocation)
    );

    if (!selectedSpot) {
      alert('Wybrane miejsce nie zostało znalezione');
      return;
    }

    setSpotname(selectedSpot.spotname);

    const reservationData = {
      startDate: startDate.toLocaleString(),
      endDate: endDate.toLocaleString(),
      spotname: selectedSpot.spotname,
      location: selectedLocation,
    };

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        console.log('Reservation saved successfully');
        setShowPopup(true); 
      } else {
        console.error('Failed to save reservation');
      }
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  };

  const handleMarkerSelect = (location: LatLngExpression) => {
    setSelectedLocation(location);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold mb-4">Rezerwacja miejsca parkingowego</h1>

      <div className="relative h-[70vh] w-full overflow-hidden rounded-md border">
        <Map onMarkerSelect={handleMarkerSelect} />
      </div>

      <div className="relative space-y-4 z-[901]">
        <div>
          <label className="block text-lg font-medium mb-2">Wybierz datę i czas:</label>
          <div className="flex space-x-4">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date || new Date())}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              showTimeSelect
              dateFormat="Pp"
              className="border rounded p-2 w-full"
              minDate={new Date()}
              timeIntervals={15}
              customInput={<input readOnly className="border rounded p-2 w-full" />}
            />
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date || new Date())}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              customInput={<input disabled className="border rounded p-2 w-full" />}
              showTimeSelect
              dateFormat="Pp"
              className="border rounded p-2 w-full"
              timeIntervals={15}
            />
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Potwierdź rezerwację
        </button>
      </div>

      {showPopup && (
        <ReservationPopup
          spotname={spotname}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default ReservePage;
