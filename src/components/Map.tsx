"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Funkcja do tworzenia niestandardowej ikony
const createCustomIcon = (availableSpaces: number) => {
  return new L.DivIcon({
    className: 'my-div-icon',
    html: `
      <div style="text-align: center;">
        <img class="my-div-image" src="/image.png" style="width: 30px; height: 40px;"/>
        <span class="my-div-span" style="display: block;">Available: ${availableSpaces}</span>
      </div>
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
};

interface MapProps {
  onMarkerSelect: (location: LatLngExpression) => void;
}

const Map: React.FC<MapProps> = ({ onMarkerSelect }) => {
  const [locations, setLocations] = useState<any[]>([]); // Stan do przechowywania danych o lokalizacjach

  // Pobieranie danych z API przy użyciu efektu
  useEffect(() => {
    fetch('/api/spots', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json(); // Przetworzenie odpowiedzi jako JSON
        } else {
          throw new Error('Nie udało się pobrać danych z API');
        }
      })
      .then(data => {
        // Przekształcenie danych z API na format odpowiedni do wykorzystania w mapie
        const mappedLocations = data.map((element: any) => ({
          location: [element.location[0], element.location[1]] as LatLngExpression,
          spotname: element.spotname,
          totalSpaces: element.totalSpaces,
          availableSpaces: element.totalSpaces - element.occupiesSpaces,
        }));
        setLocations(mappedLocations); // Zapisanie przekształconych danych w stanie
      })
      .catch(error => {
        console.error('Błąd podczas pobierania danych z API:', error);
      });
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
          icon={createCustomIcon(loc.availableSpaces)}
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
