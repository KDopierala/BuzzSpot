// components/Map.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface MapProps {
  location: LatLngExpression;
}

const Map: React.FC<MapProps> = ({ location }) => {
  return (
    <MapContainer center={location} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={location}>
        <Popup>Twoje miejsce parkingowe</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
