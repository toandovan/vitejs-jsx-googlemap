import { useState } from 'react';
import GoogleMaps from './GoogleMaps';

export default function App() {
  const [w3w, setW3W] = useState('');
  const [address, setAddress] = useState('');
  const [mapsOptions, setMapsOptions] = useState({
    center: { lat: 51.5074, lng: 0.1278 },
    zoom: 15,
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite'],
    },
    streetViewControl: false,
  });

  return (
    <div className="App">
      <p>What3Words: {w3w}</p>
      <p>address: {address}</p>
      <GoogleMaps
        mapsOptions={mapsOptions}
        setMapsOptions={setMapsOptions}
        mapContainerClassNames="w-3/4 mx-auto h-screen"
        mapClassNames="h-4/6"
        w3w={{ get: w3w, set: setW3W }}
        address={{ get: address, set: setAddress }}
        autocomplete
      />
    </div>
  );
}
