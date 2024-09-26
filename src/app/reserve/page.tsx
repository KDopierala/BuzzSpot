"use client"

import { useState, useEffect } from "react";
import * as Yup from "yup";
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

const reservationSchema = Yup.object().shape({
  startDate: Yup.date()
    .required("Data rozpoczęcia jest wymagana")
    .max(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "Nie można rezerować później niż rok w przód"),
  endDate: Yup.date()
    .required("Data zakończenia jest wymagana")
    .min(Yup.ref('startDate'), "Data zakończenia musi być późniejsza niż data rozpoczęcia")
    .test("is-within-a-month", "Data zakończenia musi być w ciągu miesiąca od daty rozpoczęcia", function(value) {
      const { startDate } = this.parent;
      if (startDate && value) {
        const duration = (new Date(value).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24);
        return duration <= 30; 
      }
      return true; 
    }),
  spotname: Yup.string().required("Nazwa miejsca jest wymagana"),
  latitude: Yup.number().required("Szerokość geograficzna jest wymagana"),
  longitude: Yup.number().required("Długość geograficzna jest wymagana"),
});



const ReservePage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<LatLngExpression | null>(null);
  const [spotname, setSpotname] = useState<string>("");
  const [spotsData, setSpotsData] = useState<SpotData[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const { showPopup, hidePopup } = usePopup();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
      (spot) => JSON.stringify(spot.location) === JSON.stringify(selectedLocation)
    );

    if (!selectedSpot) {
      alert("Wybrane miejsce nie zostało znalezione");
      return;
    }

    setSpotname(selectedSpot.spotname);
    setLatitude(selectedSpot.location[0]);
    setLongitude(selectedSpot.location[1]);

    const reservationData = {
      startDate: startDate,
      endDate: endDate,
      spotname: selectedSpot.spotname,
      latitude: selectedSpot.location[0],
      longitude: selectedSpot.location[1],
    };

    try {
      await reservationSchema.validate(reservationData, { abortEarly: false });
      showPopup(
        <ReservationPopup
          spotname={spotname}
          startDate={startDate!}
          endDate={endDate!}
          onClose={() => hidePopup()}
        />
      );

      await apiClient.post("/api/reservations", reservationData);
      console.log("Reservation saved successfully");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setValidationErrors(error.errors);
        alert(error.errors.join('\n'));
      } else {
        console.error("Error saving reservation:", error);
      }
    }
  };

  const handleMarkerSelect = (location: LatLngExpression) => {
    const selectedSpot = spotsData.find(
      (spot) => JSON.stringify(spot.location) === JSON.stringify(location)
    );

    if (selectedSpot && (selectedSpot.totalSpaces - selectedSpot.occupiesSpaces > 0)) {
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

        {validationErrors.length > 0 && (
          <div className="text-red-600">
            {validationErrors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservePage;
