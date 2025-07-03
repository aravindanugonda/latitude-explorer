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
  <div className="w-2/3 h-[98vh] border-r border-gray-100 shadow-lg relative z-0 bg-white/60 flex flex-col">
        <div className="flex-1">
          <Map 
            setSelectedCoordinates={setSelectedCoordinates}
            setCities={setCities}
          />
        </div>
      </div>

      {/* Minimal Sidebar */}
  <div className="w-[480px] max-w-[480px] h-screen flex flex-col bg-white/60 backdrop-blur-md border-l border-gray-100 shadow-lg">
        <div className="flex-1 overflow-y-auto pb-10">
          {/* Coordinates Section - compact */}
          {selectedCoordinates && (
            <div className="px-2 pt-2 pb-0.5 border-b border-gray-100">
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
            <div className="px-2 pt-1 pb-0.5">
              <div className="text-xs text-gray-500 mb-1 font-semibold">Cities Nearby</div>
              {cities.length > 0 ? (
                <div className="overflow-x-hidden">
                  <table className="w-full border border-gray-200 text-[8.5px] table-fixed">
                    <colgroup>
                      <col style={{ width: '22%' }} />
                      <col style={{ width: '22%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '18%' }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-blue-100 text-blue-900">
                        <th className="px-1 py-1 border-b border-gray-200 text-left font-semibold">City</th>
                        <th className="px-1 py-1 border-b border-gray-200 text-left font-semibold">Country</th>
                        <th className="px-1 py-1 border-b border-gray-200 text-left font-semibold">Population</th>
                        <th className="px-1 py-1 border-b border-gray-200 text-left font-semibold">Latitude</th>
                        <th className="px-1 py-1 border-b border-gray-200 text-left font-semibold">Longitude</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cities.map((city, idx) => (
                        <tr key={city.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                          <td className="px-1 py-1 border-b border-gray-100 font-medium text-blue-800 whitespace-nowrap overflow-hidden text-ellipsis">{city.name}</td>
                          <td className="px-1 py-1 border-b border-gray-100 text-blue-700 whitespace-nowrap overflow-hidden text-ellipsis">{city.country}</td>
                          <td className="px-1 py-1 border-b border-gray-100 font-mono text-gray-800">{city.population?.toLocaleString() ?? 'N/A'}</td>
                          <td className="px-1 py-1 border-b border-gray-100 font-mono text-gray-600">{city.latitude.toFixed(4)}</td>
                          <td className="px-1 py-1 border-b border-gray-100 font-mono text-gray-600">{city.longitude.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic py-2">No cities found for this location.</div>
              )}
            </div>
          )}
  </div>
  <div className="shrink-0 p-0.5 text-[8px] text-gray-300 text-center bg-white/70 border-t border-gray-100">&copy; {new Date().getFullYear()} Latitude Explorer</div>
  {/* Black border at the very bottom of the sidebar, in normal flow */}
  <div className="w-full h-[8px] bg-black" style={{boxShadow: '0 -1px 4px rgba(0,0,0,0.12)'}}></div>
      </div>
    </div>
  );
}

export default App;
