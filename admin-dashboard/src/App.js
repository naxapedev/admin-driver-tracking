import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { socket } from './socket';

const containerStyle = {
  width: '100%',
  height: '80vh',
};

const centerDefault = {
  lat: 31.4107,
  lng: 73.1070,
};

function App() {
  const [walkers, setWalkers] = useState({});
  const [selectedWalker, setSelectedWalker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('🟢 Admin socket connected');
    });

    socket.on('walkerLocation', (data) => {
      setWalkers((prev) => ({
        ...prev,
        [data.userId]: {
          ...data,
          updatedAt: new Date().toISOString(),
          isOnline: true,
        },
      }));
    });

   socket.on('walkerDisconnected', (userId) => {
  setWalkers((prev) => {
    if (!prev[userId]) return prev;
    return {
      ...prev,
      [userId]: {
        ...prev[userId],
        isOnline: false,
        updatedAt: new Date().toISOString(),
      },
    };
  });
});


    return () => {
      socket.off('connect');
      socket.off('walkerLocation');
      socket.off('walkerDisconnected');
    };
  }, []);

  const handleSelectWalker = (walker) => {
    setSelectedWalker(walker);

    if (mapRef.current) {
      mapRef.current.panTo({
        lat: walker.latitude,
        lng: walker.longitude,
      });
    }
  };

  useEffect(() => {
    if (selectedWalker && mapRef.current) {
      mapRef.current.panTo({
        lat: selectedWalker.latitude,
        lng: selectedWalker.longitude,
      });
    }
  }, [selectedWalker]);

  const filteredWalkers = Object.values(walkers).filter((w) =>
    w.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ height: '100vh', margin: 0 }}>
      <h2 style={{ textAlign: 'center', margin: '10px 0' }}>👣 Fleet Admin Dashboard</h2>

      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        <div style={{ flex: 3 }}>
          <LoadScript googleMapsApiKey="AIzaSyAZnyolQsMbtSbQY8-r_z_gMzQ1TfEoZMU">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={
                selectedWalker
                  ? { lat: selectedWalker.latitude, lng: selectedWalker.longitude }
                  : centerDefault
              }
              zoom={14}
              onLoad={(map) => (mapRef.current = map)}
            >
              {filteredWalkers.map((walker) => (
                <Marker
                 key={walker.userId + '-' + walker.isOnline}
                  position={{ lat: walker.latitude, lng: walker.longitude }}
                  label={walker.userId}
icon={{
  url: walker.isOnline
    ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    : 'http://maps.google.com/mapfiles/ms/icons/ltgray-dot.png', 
  scaledSize: new window.google.maps.Size(32, 32),
}}



                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>

        <div style={{ flex: 1, padding: 10, borderLeft: '1px solid #ccc', overflowY: 'auto' }}>
          <input
            type="text"
            placeholder="Search by User ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />

          <h4>🧍 Walkers ({filteredWalkers.length})</h4>

          {filteredWalkers.map((w) => (
            <div
              key={w.userId}
              onClick={() => handleSelectWalker(w)}
              style={{
                marginBottom: 10,
                padding: 10,
                background: selectedWalker?.userId === w.userId ? '#e0f7fa' : '#fff',
                border: `2px solid ${w.isOnline ? 'green' : 'grey'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <strong>{w.userId}</strong><br />
              📍 {w.latitude?.toFixed(5)}, {w.longitude?.toFixed(5)}<br />
              🕒 {new Date(w.updatedAt).toLocaleTimeString()}<br />
              Status: {w.isOnline ? '🟢 Online' : '⚪ Offline'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
