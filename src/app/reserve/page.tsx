"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import "leaflet/dist/leaflet.css";
import DatePicker from "react-datepicker";
import { LatLngExpression } from "leaflet";
import ReservationPopup from "@/components/ReservationPopup";
import { SpotData } from "@/types";
import NavMenu from "@/components/Navigation";
import apiClient from '@/lib/apiClient';
import { usePopup } from '@/context/popupContext';

const Map = dynamic(() => import("../../components/Map"), { ssr: false });

const ReservePage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] =
    useState<LatLngExpression | null>(null);
  const [spotname, setSpotname] = useState<string>("");
  const [spotsData, setSpotsData] = useState<SpotData[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const { showPopup, hidePopup } = usePopup();




  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const data: SpotData[] = await apiClient.get("/api/spots");
        console.log("Dane z API:", data);
        setSpotsData(data);
      } catch (error) {
        console.error("Błąd podczas pobierania danych z API:", error);
      }
    };
  
    fetchSpots();
  }, []);
  

  const handleConfirm = async () => {
    if (!selectedLocation) {
      alert("Proszę wybrać lokalizację");
      return;
    }

    const selectedSpot = spotsData.find(
      (spot) =>
        JSON.stringify(spot.location) === JSON.stringify(selectedLocation)
    );

    if (!selectedSpot) {
      alert("Wybrane miejsce nie zostało znalezione");
      return;
    }

    setSpotname(selectedSpot.spotname);

    if(selectedSpot){
      setLatitude(selectedSpot.location[0])
      setLongitude(selectedSpot.location[1])

    }

    const reservationData = {
      startDate: startDate?.toLocaleString(),
      endDate: endDate?.toLocaleString(),
      spotname: selectedSpot.spotname,
      Lat: latitude,
      Long: longitude
    };

    showPopup(        <ReservationPopup
      spotname={spotname}
      startDate={startDate!}
      endDate={endDate!}
      onClose={() => hidePopup}
    />);
    try {
      await apiClient.post("/api/reservations", reservationData);
      console.log("Reservation saved successfully");

    } catch (error) {
      console.error("Error saving reservation:", error);
    }
  };

  const handleMarkerSelect = (location: LatLngExpression) => {
    const selectedSpot = spotsData.find(
      (spot) => JSON.stringify(spot.location) === JSON.stringify(location)
    );
  
    if (selectedSpot &&   (selectedSpot.totalSpaces-selectedSpot.occupiesSpaces > 0)) {
      setSelectedLocation(location);
      setSpotname(selectedSpot.spotname);
      setLatitude(selectedSpot.location[0]);
      setLongitude(selectedSpot.location[1]);
    } else {
      setSelectedLocation(null);
      setSpotname("");
      setLatitude(null);
      setLongitude(null);
  
      alert("Brak dostępnych miejsc parkingowych w tej lokalizacji.");
    }
  };
  
  
  const filterStartTime = (date: { getTime: () => number }) => {
    const isPastTime = new Date().getTime() > date.getTime();
    return !isPastTime;
  };

  const filterEndTime = (date: Date) => {
    if (startDate) {
      return startDate.getTime() <= date.getTime();
    }
    return true; 
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">
          Rezerwacja miejsca parkingowego
        </h1>
        <NavMenu />
      </div>

      <div className="relative h-[70vh] w-full overflow-hidden rounded-md border">
        <Map onMarkerSelect={handleMarkerSelect} />
      </div>

      <div className="relative space-y-4 z-[901]">
        <div>
          <label className="block text-lg font-medium mb-2">
            Wybierz datę i czas:
          </label>
          <div className="flex space-x-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                if (date) setStartDate(date);
              }}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              showTimeSelect
              dateFormat="Pp"
              className="border rounded p-2 w-full"
              minDate={new Date()}
              timeIntervals={15}
              filterTime={filterStartTime}
              placeholderText="Czas rozpoczęcia"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                if (date) setEndDate(date);
              }}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              showTimeSelect
              dateFormat="Pp"
              className="border rounded p-2 w-full"
              timeIntervals={15}
              filterTime={filterEndTime}
              placeholderText="Czas zakończenia"
            />
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!startDate || !endDate}
          className={`py-2 px-4 rounded transition-colors text-white ${
            startDate && endDate
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed opacity-50"
          }`}
        >
          Potwierdź rezerwację
        </button>
      </div>
    </div>
  );
};

export default ReservePage;
