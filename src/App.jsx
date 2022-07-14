import { useEffect, useState } from 'react';
import './App.css';
import { Loader } from '@googlemaps/js-api-loader';
function App() {
  const [count, setCount] = useState(0);
  const loader = new Loader({
    apiKey: '',
    version: 'weekly',
    libraries: ['places'],
  });
  useEffect(() => {
    loader.loadCallback((e) => {
      if (e) {
        console.log(e);
      } else {
        new google.maps.Map(document.getElementsByClassName('map'), mapOptions);
      }
    });
  });
  const mapOptions = {
    center: {
      lat: 0,
      lng: 0,
    },
    zoom: 4,
  };

  return <div className="Map"></div>;
}

export default App;
