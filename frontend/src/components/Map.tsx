import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react';
import { getCitiesByLatitude, type City } from '../services/cities';

// Fix for default icon issue with Leaflet and Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapProps {
  setSelectedCoordinates: (coords: { latitude: number; longitude: number } | null) => void;
  setCities: (cities: City[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const Map = ({ setSelectedCoordinates, setCities, setLoading, setError }: MapProps) => {
  const [citiesOnMap, setCitiesOnMap] = useState<City[]>([]);
  const [clickedLocation, setClickedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const MapEvents = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        const coordinates = { latitude: lat, longitude: lng };
        
        setSelectedCoordinates(coordinates);
        setClickedLocation(coordinates);
        setLoading(true);
        setError(null);
        
        try {
          const fetchedCities = await getCitiesByLatitude(lat, 0.1);
          setCities(fetchedCities);
          setCitiesOnMap(fetchedCities);
        } catch (error) {
          console.error('Error fetching cities:', error);
          setError('Failed to fetch cities. Please try again.');
          setCities([]);
          setCitiesOnMap([]);
        } finally {
          setLoading(false);
        }
      },
    });
    return null;
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        
        {/* Clicked location marker */}
        {clickedLocation && (
          <Marker position={[clickedLocation.latitude, clickedLocation.longitude]}>
            <Popup>
              <div className="text-center">
                <strong>Selected Location</strong><br/>
                Lat: {clickedLocation.latitude.toFixed(4)}<br/>
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
                <strong>{city.name}</strong><br/>
                {city.country}<br/>
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
