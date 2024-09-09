// components/Map.tsx
"use client";

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import spotsData from 'C:/Users/krystian.dopierala/Desktop/buzzspot/data/spots.json';

// Konfiguracja niestandardowej pinezki
const customIcon = new L.Icon({
  iconUrl: '/image.png', // Ścieżka do obrazu pinezki
  iconSize: [30, 40], // Rozmiar ikony
  iconAnchor: [15, 40], // Punkt zakotwiczenia ikony (środek dolnej krawędzi)
  popupAnchor: [0, -40] // Punkt zakotwiczenia popupu w stosunku do ikony
});



var myIcon = L.divIcon({className: 'my-div-icon', 
  html: '<img class="my-div-image" src="http://png-3.vector.me/files/images/4/0/402272/aiga_air_transportation_bg_thumb"/>'+
  '<span class="my-div-span">sie ogarnie</span>'});

interface MapProps {
  locations: LatLngExpression[];
  onMarkerSelect: (location: LatLngExpression) => void; // Callback po wyborze markera
}

const Map: React.FC<MapProps> = ({ locations, onMarkerSelect }) => {
  return (
    <MapContainer center={[51.935619, 15.506186]} zoom={14} className="h-full w-full">
      {/* Warstwa kafelkowa OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Renderowanie wielu markerów */}
      {locations.map((location, index) => (
        <Marker 
          key={index} 
          position={location} 
          icon={myIcon} 
          title = "parking"
          eventHandlers={{
            click: () => onMarkerSelect(location), // Obsługa kliknięcia na marker
          }}
        >
          <Popup>
            <p>Punkt {index + 1}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
