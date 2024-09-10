// src/app/reserve/page.tsx
"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-datepicker/dist/react-datepicker.css';
import "leaflet/dist/leaflet.css";
import DatePicker from 'react-datepicker';
import { LatLng, LatLngExpression } from 'leaflet';
import spotsData from 'C:/Users/krystian.dopierala/Desktop/buzzspot/data/spots.json';


const Map = dynamic(() => import('../../components/Map'), { ssr: false });

// Extract the locations correctly
const locations: LatLngExpression[] = spotsData.map(element => [element.location[0], element.location[1]]);

console.log(locations)

const ReservePage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedLocation, setSelectedLocation] = useState<LatLngExpression | null>(null);
  const [markers, setMarkers] = useState<LatLngExpression[]>(locations);

  const handleConfirm = async () => {

    console.log(`Selected Start Date (Local): ${startDate.toLocaleString()}`);
    console.log(`Selected End Date (Local): ${endDate.toLocaleString()}`);
    console.log(`Time Zone Offset (minutes): ${startDate.getTimezoneOffset()}`);

    const reservationData = {
      startDate: startDate.toLocaleString(),
      endDate: endDate.toLocaleString(),
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

      <div className="relative h-[50vh] w-full overflow-hidden rounded-md border">
        <Map  onMarkerSelect={handleMarkerSelect} />
      </div>

      <div className="space-y-4">
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
            />
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date || new Date())}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              showTimeSelect
              dateFormat="Pp"
              className="border rounded p-2 w-full"
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
    </div>
  );
};

export default ReservePage;
