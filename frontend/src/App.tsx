import Map from './components/Map';
import { useState } from 'react';
import { type City } from './services/cities';

function App() {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Coordinates copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="w-screen h-screen flex bg-gray-50">
      {/* Map Section */}
      <div className="w-3/4 h-full border-r border-gray-200">
        <Map 
          setSelectedCoordinates={setSelectedCoordinates} 
          setCities={setCities}
          setLoading={setLoading}
          setError={setError}
        />
      </div>
      
      {/* Sidebar */}
      <div className="w-1/4 h-full bg-white shadow-lg overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Latitude Explorer</h1>
          <p className="text-sm text-gray-600">Click anywhere on the map to discover cities at the same latitude!</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Coordinates Section */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Selected Coordinates</h2>
            {selectedCoordinates ? (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Latitude:</span>
                  <span className="font-mono text-sm">{selectedCoordinates.latitude.toFixed(6)}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Longitude:</span>
                  <span className="font-mono text-sm">{selectedCoordinates.longitude.toFixed(6)}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`${selectedCoordinates.latitude.toFixed(6)}, ${selectedCoordinates.longitude.toFixed(6)}`)}
                  className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Copy Coordinates
                </button>
              </div>
            ) : (
              <div className="text-gray-500 text-sm bg-gray-50 rounded-lg p-4 text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Click on the map to select coordinates
              </div>
            )}
          </div>

          {/* Cities Section */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Cities at This Latitude
              {cities.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">({cities.length} found)</span>
              )}
            </h2>
            
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-sm text-gray-600">Loading cities...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && cities.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {cities.map((city) => (
                  <div key={city.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{city.name}</h3>
                        <p className="text-sm text-gray-600">{city.country}</p>
                        {city.population && (
                          <p className="text-xs text-gray-500 mt-1">
                            Population: {city.population.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>Lat: {city.latitude.toFixed(3)}</div>
                        <div>Lng: {city.longitude.toFixed(3)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && selectedCoordinates && cities.length === 0 && (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-gray-500 text-sm mb-2">No cities found at this latitude</p>
                <p className="text-gray-400 text-xs">Try clicking on a different location</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
