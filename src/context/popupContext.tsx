// contexts/ReservationContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface ReservationContextType {
  showPopup: boolean;
  spotname: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  openPopup: (spotname: string, startDate: Date, endDate: Date) => void;
  closePopup: () => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [spotname, setSpotname] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const openPopup = (spotname: string, startDate: Date, endDate: Date) => {
    setSpotname(spotname);
    setStartDate(startDate);
    setEndDate(endDate);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSpotname('');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <ReservationContext.Provider value={{ showPopup, spotname, startDate, endDate, openPopup, closePopup }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservationContext = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservationContext must be used within a ReservationProvider');
  }
  return context;
};
