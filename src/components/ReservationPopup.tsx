// components/ReservationPopup.tsx
import React from 'react';
import { calculatePrice, calculateParkingDuration } from '@/utils/priceCaclc'; // Import funkcji

interface ReservationPopupProps {
  spotname: string;
  startDate: Date;
  endDate: Date;
  onClose: () => void;
}

const ReservationPopup: React.FC<ReservationPopupProps> = ({ spotname, startDate, endDate, onClose }) => {
  const { hours, minutes } = calculateParkingDuration(startDate, endDate);
  const price = calculatePrice(startDate, endDate);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[900]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Dokonałeś rezerwacji</h2>
        <p>Miejsce: {spotname}</p>
        <p>Czas postoju: {hours}h {minutes}min</p>
        <p>Twój rachunek zostanie obciążony na kwotę: {price}zł</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
};

export default ReservationPopup;
