// src/app/reserve/page.tsx

"use client"; // <-- Dodaj to na górze pliku

import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { LatLngExpression } from 'leaflet';

// Importujemy mapę, aby uniknąć problemów z SSR (Server-Side Rendering)
const Map = dynamic(() => import('../../components/Map'), { ssr: false });

const ReservePage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState<LatLngExpression>([51.505, -0.09]);

  const handleConfirm = () => {
    console.log('Data:', startDate);
    console.log('End Data:', endDate);
    console.log('Location:', location);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold mb-4">Rezerwacja miejsca parkingowego</h1>

      <div className="h-80">
        <Map location={location} />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-lg font-medium mb-2">Wybierz datę i czas:</label>
          <div className="flex space-x-4">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | undefined) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              showTimeSelect
              dateFormat="Pp"
              className="border rounded p-2 w-full"
            />
            <DatePicker
              selected={endDate}
              onChange={(date: Date | undefined) => setEndDate(date)}
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
