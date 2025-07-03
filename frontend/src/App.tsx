import Map from './components/Map';
import { useState } from 'react';
import { type City } from './services/cities';

function App() {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Coordinates copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleLocationSelect = (coords: { latitude: number; longitude: number } | null) => {
    setSelectedCoordinates(coords);
    if (coords) {
      setIsLoading(true);
    }
  };

  const handleCitiesUpdate = (newCities: City[]) => {
    setCities(newCities);
    setIsLoading(false);
  };

  return (
    <div className="w-screen h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-100 overflow-hidden">
      {/* Map Section - Maximized */}
      <div className="w-[70vw] h-full border-r-2 border-gray-200 shadow-lg relative bg-white/80">
        <Map 
          setSelectedCoordinates={handleLocationSelect}
          setCities={handleCitiesUpdate}
        />
      </div>

      {/* Right Panel - Compact at 30% */}
      <div className="w-[30vw] h-full flex flex-col bg-white/95 backdrop-blur-sm border-l border-gray-200 shadow-xl">
        {/* Header */}
        <div className="shrink-0 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h2 className="text-lg font-semibold">Location Details</h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {selectedCoordinates ? (
            <div className="space-y-4">
              {/* Coordinates Section */}
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Coordinates</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Latitude:</span>
                    <span className="font-mono text-sm text-blue-700 font-medium">
                      {selectedCoordinates.latitude.toFixed(6)}°
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Longitude:</span>
                    <span className="font-mono text-sm text-blue-700 font-medium">
                      {selectedCoordinates.longitude.toFixed(6)}°
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${selectedCoordinates.latitude.toFixed(6)}, ${selectedCoordinates.longitude.toFixed(6)}`)}
                    className="w-full mt-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Copy Coordinates
                  </button>
                </div>
              </div>

              {/* Cities Section */}
              <div className="px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Nearby Cities ({cities.length})
                  {isLoading && <span className="ml-2 text-xs text-blue-600">Loading...</span>}
                </h3>
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm">Fetching nearby cities...</p>
                  </div>
                ) : cities.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700">City</th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Country</th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Population</th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Distance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {cities.map((city, idx) => (
                            <tr key={city.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-3 py-2 font-medium text-gray-900">
                                <div className="truncate max-w-[120px]" title={city.name}>
                                  {city.name}
                                </div>
                              </td>
                              <td className="px-3 py-2 text-gray-600">
                                <div className="truncate max-w-[100px]" title={city.country}>
                                  {city.country}
                                </div>
                              </td>
                              <td className="px-3 py-2 font-mono text-gray-700 text-xs">
                                {city.population?.toLocaleString() ?? 'N/A'}
                              </td>
                              <td className="px-3 py-2 font-mono text-gray-600 text-xs">
                                {Math.abs(city.latitude - selectedCoordinates.latitude).toFixed(2)}°
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🏙️</div>
                    <p className="text-sm">No cities found for this location.</p>
                    <p className="text-xs text-gray-400 mt-1">Try clicking on a different area.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold mb-2">Welcome to Latitude Explorer</h3>
              <p className="text-sm text-center text-gray-400">
                Click anywhere on the map to explore cities at that latitude
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 py-2 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Latitude Explorer
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
