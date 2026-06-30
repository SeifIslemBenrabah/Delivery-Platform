import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const livreurIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149060.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

interface Props {
  livreurPosition?: { lat: number; lng: number };
  pickupPosition?: { lat: number; lng: number };
  dropoffPosition?: { lat: number; lng: number };
  routeCoords?: [number, number][];
}

export default function TrackingMap({
  livreurPosition,
  pickupPosition,
  dropoffPosition,
  routeCoords = [],
}: Props) {
  const center: [number, number] =
    livreurPosition
      ? [livreurPosition.lat, livreurPosition.lng]
      : [36.7538, 3.0588]; // Algiers default

  return (
    <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-200">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {livreurPosition && (
          <Marker position={[livreurPosition.lat, livreurPosition.lng]} icon={livreurIcon}>
            <Popup>Livreur</Popup>
          </Marker>
        )}

        {pickupPosition && (
          <Marker position={[pickupPosition.lat, pickupPosition.lng]}>
            <Popup>Point de collecte</Popup>
          </Marker>
        )}

        {dropoffPosition && (
          <Marker position={[dropoffPosition.lat, dropoffPosition.lng]}>
            <Popup>Point de livraison</Popup>
          </Marker>
        )}

        {routeCoords.length > 1 && (
          <Polyline positions={routeCoords} color="#2563eb" weight={4} />
        )}
      </MapContainer>
    </div>
  );
}