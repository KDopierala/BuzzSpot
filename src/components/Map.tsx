// components/Map.tsx
"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SpotData, LocationData } from '@/types'; // Import interfejsów


// Funkcja do tworzenia niestandardowej ikony
const createCustomIcon = (availableSpaces: number, totalSpaces: number, imgSource: string, spotName: string) => {
  return new L.DivIcon({
    className: 'my-div-icon',
    html: `
      <div style="text-align: center;">
        <p style="font-size: 0.9rem;font-weight:700">${availableSpaces}/${totalSpaces}</p>
        <img class="my-div-image" src="/${imgSource}" style="width: 35px; height: 45px;"/>
        <span class="my-div-span" style="display: block;min-width:200px; margin-left:-83px; text-align: center; font-size: 0.7rem;font-weight:700">${spotName}</span>
      </div>
    `,
    iconSize: [35, 45],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
};

interface MapProps {
  onMarkerSelect: (location: LatLngExpression) => void;
}

const Map: React.FC<MapProps> = ({ onMarkerSelect }) => {
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/spots', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Nie udało się pobrać danych z API');
        }

        const data: SpotData[] = await response.json();
        const mappedLocations: LocationData[] = data.map((element) => {
          const availableSpaces = element.totalSpaces - element.occupiesSpaces;
          const occupiedPercentage = (element.occupiesSpaces / element.totalSpaces) * 100;

          let imgPath = '';

          // Sprawdzenie zajętości miejsc
          if (occupiedPercentage < 70) {
            imgPath = 'FullSpace.png'; // Więcej niż 30% dostępnych miejsc
          } else if (occupiedPercentage >= 70 && occupiedPercentage < 100) {
            imgPath = 'MediumSpaceAvailability.png'; // Pomiędzy 70% a 100% zajętych miejsc
          } else {
            imgPath = 'NoSpace.png'; // 100% zajętych miejsc
          }

          return {
            location: [element.location[0], element.location[1]],
            spotname: element.spotname,
            totalSpaces: element.totalSpaces,
            availableSpaces,
            imgPath, // Zapisujemy ścieżkę do obrazka
          };
        });

        setLocations(mappedLocations);
      } catch (error) {
        console.error('Błąd podczas pobierania danych z API:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <MapContainer center={[51.935619, 15.506186]} zoom={14} className="h-full w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((loc, index) => (
        <Marker
          key={index}
          position={loc.location}
          icon={createCustomIcon(loc.availableSpaces, loc.totalSpaces, loc.imgPath, loc.spotname)} // Użycie dynamicznej ścieżki
          eventHandlers={{
            click: () => onMarkerSelect(loc.location),
          }}
        >
          <Popup>
            <p>Parking spot: {loc.spotname}</p>
            <p>Available spaces: {loc.availableSpaces}</p>
            <p>Total spaces: {loc.totalSpaces}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
