// components/Map.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import spotsData from 'C:/Users/krystian.dopierala/Desktop/buzzspot/data/spots.json';

const createCustomIcon = (availableSpaces: number, totalSpaces: number) => {
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
    popupAnchor: [0, -40]
  });
};

// Map the spotsData to extract necessary information
const locations = spotsData.map(element => ({
  location: [element.location[0], element.location[1]] as LatLngExpression,
  spotname: element.spotname,
  totalSpaces: element.totalSpaces,
  availableSpaces: element.totalSpaces - element.occupiesSpaces
}));

interface MapProps {
  onMarkerSelect: (location: LatLngExpression) => void;
}

const Map: React.FC<MapProps> = ({ onMarkerSelect }) => {
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
          icon={createCustomIcon(loc.availableSpaces, loc.totalSpaces)}
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