

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';



const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/744/744465.png',
  iconSize: [40, 40],   
  iconAnchor: [20, 40], 
});



const Recenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position]);
  return null;
};

function Map() {
  const [position, setPosition] = useState(null); 
  const [path, setPath] = useState([]); 

  
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/location');
        const { latitude, longitude } = res.data;
        const newPosition = [latitude, longitude]; 
        console.log('New vehicle position:', newPosition); 
        setPosition(newPosition); 
        setPath(prev => [...prev, newPosition]); 
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation(); 
    const interval = setInterval(fetchLocation, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={position || [17.385044, 78.486671]} 
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {position && (
          <>
            <Marker position={position} icon={carIcon} />
            <Polyline positions={path} color="blue" />
            <Recenter position={position} />
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default Map;
