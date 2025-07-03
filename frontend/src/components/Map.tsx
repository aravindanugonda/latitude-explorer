import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react';
import { getCitiesByLatitude, type City } from '../services/cities';

// Fix for default icon issue with Leaflet and Webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

type MapProps = {
  setSelectedCoordinates: (coords: { latitude: number; longitude: number } | null) => void;
  setCities: (cities: City[]) => void;
};

const MapEvents = ({
  setSelectedCoordinates,
  setClickedLocation,
  setCities
}: {
  setSelectedCoordinates: (coords: { latitude: number; longitude: number } | null) => void;
  setClickedLocation: (coords: { latitude: number; longitude: number } | null) => void;
  setCities: (cities: City[]) => void;
}) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const coordinates = { latitude: lat, longitude: lng };
      setSelectedCoordinates(coordinates);
      setClickedLocation(coordinates);
      try {
        const fetchedCities = await getCitiesByLatitude(lat, lng, 1.0);
        setCities(fetchedCities || []);
      } catch (err: any) {
        console.error('Error fetching cities:', err);
        setCities([]); // Always update parent
      }
    },
  });
  return null;
};

const Map = ({ setSelectedCoordinates, setCities }: MapProps) => {
  const [citiesOnMap, setCitiesOnMap] = useState<City[]>([]);
  const [clickedLocation, setClickedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  return (
  <div className="h-full w-full relative overflow-hidden cursor-pointer">
      <MapContainer
        key="london-map" // Force re-render
        center={[51.5074, -0.1278]} // London coordinates
        zoom={8} // Zoomed out to show more area around London
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', cursor: 'pointer' }}
        className="z-0"
        maxBounds={[[ -85, -180 ], [ 85, 180 ]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          noWrap={true}
        />
        <MapEvents
          setSelectedCoordinates={setSelectedCoordinates}
          setClickedLocation={setClickedLocation}
          setCities={(cities) => {
            setCitiesOnMap(cities);
            setCities(cities);
          }}
        />
        {/* Clicked location marker */}
        {clickedLocation && (
          <Marker position={[clickedLocation.latitude, clickedLocation.longitude]}>
            <Popup>
              <div className="text-center">
                <strong>Selected Location</strong><br />
                Lat: {clickedLocation.latitude.toFixed(4)}<br />
                Lng: {clickedLocation.longitude.toFixed(4)}
              </div>
            </Popup>
          </Marker>
        )}
        {/* City markers */}
        {citiesOnMap.map((city) => (
          <Marker key={city.id} position={[city.latitude, city.longitude]}>
            <Popup>
              <div className="text-center">
                <strong>{city.name}</strong><br />
                {city.country}<br />
                {city.population && (
                  <span className="text-sm text-gray-600">
                    Pop: {city.population.toLocaleString()}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
