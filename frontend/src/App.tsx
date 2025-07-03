import Map from './components/Map';
import { useState } from 'react';
import { type City } from './services/cities';

function App() {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [cities, setCities] = useState<City[]>([]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Coordinates copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="w-screen h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Map Section */}
  <div className="w-2/3 h-full border-r border-gray-100 shadow-lg relative z-0 bg-white/60">
        <Map 
          setSelectedCoordinates={setSelectedCoordinates}
          setCities={setCities}
        />
      </div>

      {/* Minimal Sidebar */}
  <div className="w-1/3 h-full flex flex-col bg-white/60 backdrop-blur-md border-l border-gray-100 shadow-lg overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {/* Coordinates Section - compact */}
          {selectedCoordinates && (
            <div className="px-4 pt-4 pb-2 border-b border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Lat</span>
                <span className="font-mono text-blue-700">{selectedCoordinates.latitude.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Lng</span>
                <span className="font-mono text-blue-700">{selectedCoordinates.longitude.toFixed(4)}</span>
              </div>
              <button
                onClick={() => copyToClipboard(`${selectedCoordinates.latitude.toFixed(6)}, ${selectedCoordinates.longitude.toFixed(6)}`)}
                className="w-full mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-all"
              >Copy</button>
            </div>
          )}

          {/* Cities Section - compact */}
          {selectedCoordinates && (
            <div className="px-4 pt-3 pb-2">
              <div className="text-xs text-gray-500 mb-1 font-semibold">Cities Nearby</div>
              {cities.length > 0 ? (
                <ul className="space-y-1">
                  {cities.map(city => (
                    <li key={city.id} className="flex flex-col bg-white/80 rounded px-2 py-1 shadow-sm hover:bg-blue-50 transition">
                      <div className="flex items-center text-xs gap-2">
                        <span className="font-medium text-blue-700 whitespace-nowrap">{city.name}</span>
                        <span className="block max-w-[80px] truncate bg-blue-50 text-blue-600 rounded px-1 ml-1" title={city.country}>{city.country}</span>
                        {city.population && (
                          <span className="text-gray-500 ml-2">{city.population.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex gap-2 text-[10px] text-gray-500 font-mono pl-1">
                        <span>Lat: {city.latitude.toFixed(4)}</span>
                        <span>Lng: {city.longitude.toFixed(4)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-gray-400 italic py-2">No cities found for this location.</div>
              )}
            </div>
          )}
        </div>
        <div className="p-2 text-[10px] text-gray-300 text-center bg-white/70 border-t border-gray-100">&copy; {new Date().getFullYear()} Latitude Explorer</div>
      </div>
    </div>
  );
}

export default App;
