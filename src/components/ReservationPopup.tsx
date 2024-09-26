// components/ReservationPopup.tsx

"use client";
import React from 'react';
import { calculatePrice, calculateParkingDuration } from '@/utils/priceCaclc'; // Import funkcji

interface ReservationPopupProps {
  spotname: string;
  startDate: Date;
  endDate: Date;
}

const ReservationPopup: React.FC<ReservationPopupProps> = ({ spotname, startDate, endDate }) => {
  const { hours, minutes } = calculateParkingDuration(startDate, endDate);
  const price = calculatePrice(startDate, endDate);

  return (
      <div className="w-auto">
        <h2 className="text-xl font-semibold mb-4">Dokonałeś rezerwacji</h2>
        <p>Miejsce: {spotname}</p>
        <p>Czas postoju: {hours}h {minutes}min</p>
        <p>Do zapłaty: {price}zł</p>
      </div>
  );
};

export default ReservationPopup;
