"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import "leaflet/dist/leaflet.css";
import DatePicker from "react-datepicker";
import { LatLngExpression } from "leaflet";
import ReservationPopup from "../../components/ReservationPopup";
import { SpotData } from "@/types";

const Map = dynamic(() => import("../../components/Map"), { ssr: false });

const ReservePage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] =
    useState<LatLngExpression | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [spotname, setSpotname] = useState<string>("");
  const [spotsData, setSpotsData] = useState<SpotData[]>([]);

  useEffect(() => {
    if (startDate && endDate) {
      setShowPopup(false); 
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetch("/api/spots", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Nie udało się pobrać danych z API");
        }
      })
      .then((data: SpotData[]) => {
        console.log("Dane z API:", data);
        setSpotsData(data);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania danych z API:", error);
      });
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

    const reservationData = {
      startDate: startDate?.toLocaleString(), // Użycie opcjonalnego chainingu
      endDate: endDate?.toLocaleString(), // Użycie opcjonalnego chainingu
      spotname: selectedSpot.spotname,
      location: selectedLocation,
    };

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        console.log("Reservation saved successfully");
        setShowPopup(true);
      } else {
        console.error("Failed to save reservation");
      }
    } catch (error) {
      console.error("Error saving reservation:", error);
    }
  };

  const handleMarkerSelect = (location: LatLngExpression) => {
    setSelectedLocation(location);
  };

  const filterStartTime = (date: { getTime: () => number }) => {
    const isPastTime = new Date().getTime() > date.getTime();
    return !isPastTime;
  };

  const filterEndTime = (date: Date) => {
    // Sprawdza, czy czas zakończenia jest późniejszy niż czas rozpoczęcia, jeśli startDate istnieje
    if (startDate) {
      return startDate.getTime() <= date.getTime();
    }
    return true; // Domyślnie pozwala na wybór jakiegokolwiek czasu, jeśli startDate nie jest ustawiona
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Rezerwacja miejsca parkingowego
      </h1>

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

      {showPopup && startDate && endDate ? (
        <ReservationPopup
          spotname={spotname}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setShowPopup(false)}
        />
      ) : (
        !startDate ||
        (!endDate && (
          <div className="text-red-500">
            Proszę wybrać datę rozpoczęcia i zakończenia rezerwacji
          </div>
        ))
      )}
    </div>
  );
};

export default ReservePage;
