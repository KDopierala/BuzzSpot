// components/ReservationPopup.tsx
import React from 'react';

interface ReservationPopupProps {
  spotname: string;
  startDate: Date;
  endDate: Date;
  onClose: () => void;
}

const ReservationPopup: React.FC<ReservationPopupProps> = ({ spotname, startDate, endDate, onClose }) => {
  const parkingDurationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60 ); // czas w godzinach
  let parkingDurationHours = 0;
  let restOfMinutes = 0;
    if (parkingDurationMinutes>60){
        parkingDurationHours = Math.floor(parkingDurationMinutes/60);
        restOfMinutes = parkingDurationMinutes % 60;
    }else{
        restOfMinutes = parkingDurationMinutes;
    }
  const price = Math.ceil(parkingDurationMinutes/30);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[900]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Dokonałeś rezerwacji</h2>
        <p>Miejsce: {spotname}</p>
        <p>Czas postoju: {parkingDurationHours}h {restOfMinutes}min</p>
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
