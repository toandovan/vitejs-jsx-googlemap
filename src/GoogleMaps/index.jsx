import React, { useEffect, useRef, useState } from 'react';
import uniqid from 'uniqid';
import mapsLoader from '../GoogleMaps/mapLoader';

const GoogleMaps = (props) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const mapElementId = useRef('map-' + uniqid());
  const autocompleteElementId = useRef('autocomplete-' + uniqid());

  // Load API
  useEffect(() => {
    mapsLoader()
      .load()
      .then(() => {
        setIsGoogleLoaded(true);
      });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (isGoogleLoaded) {
      setMap(
        new window.google.maps.Map(
          document.getElementById(mapElementId.current),
          props.mapsOptions
        )
      );
      setGeocoder(new window.google.maps.Geocoder());
    }
    // eslint-disable-next-line
  }, [isGoogleLoaded]);

  // Marker Start
  // Initialize Marker
  useEffect(() => {
    if (map) {
      setMarker(
        new window.google.maps.Marker({
          position: props.mapsOptions.center,
          map: map,
          draggable: true,
        })
      );
    }
    // eslint-disable-next-line
  }, [map]);

  // Marker Event
  useEffect(() => {
    let markerDragendListener;
    if (marker) {
      markerDragendListener = marker.addListener('dragend', (e) => {
        props.w3w.set('Loading...');
        const coords = e.latLng.toJSON();

        window.what3words.api
          .convertTo3wa(coords, 'en')
          .then(function (response) {
            props.w3w.set(response.words);
          })
          .catch((error) => {
            console.log(error);
          });

        geocoder.geocode({ location: coords }, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              props.address.set(results[0].formatted_address);
            } else {
              window.alert('No results found');
            }
          } else if (status === 'ZERO_RESULTS') {
            props.address.set('No Address Found');
          } else {
            props.address.set('Geocoder failed due to: ' + status);
          }
        });
      });
    }
    return () => {
      if (marker && markerDragendListener) {
        markerDragendListener.remove();
      }
    };
    // eslint-disable-next-line
  }, [marker]);

  // AutoComplete Start
  // Initialize Autocomplete
  useEffect(() => {
    if (isGoogleLoaded && props.autocomplete) {
      setAutocomplete(
        new window.google.maps.places.Autocomplete(
          document.getElementById(autocompleteElementId.current)
        )
      );
    }
  }, [isGoogleLoaded, props.autocomplete]);

  // Autocomplete Event
  useEffect(() => {
    let autocompletePlaceChangedListener;
    if (autocomplete && marker) {
      autocompletePlaceChangedListener = autocomplete.addListener(
        'place_changed',
        (e) => {
          const place = autocomplete.getPlace();

          if (place.geometry) {
            props.address.set(place.formatted_address);
            const coords = place.geometry.location.toJSON();

            // Set Map Center to Coords
            props.setMapsOptions((prev) => {
              return { ...prev, center: coords };
            });

            // Set Marker Position to Coords
            marker.setPosition(coords);

            props.w3w.set('Loading...');

            window.what3words.api
              .convertTo3wa(coords, 'en')
              .then(function (response) {
                props.w3w.set(response.words);
              });
          }
        }
      );
    }
    return () => {
      if (autocomplete && autocompletePlaceChangedListener) {
        autocompletePlaceChangedListener.remove();
      }
    };
    // eslint-disable-next-line
  }, [autocomplete, marker]);
  // AutoComplete End

  // Update mapOptions
  useEffect(() => {
    if (map) {
      map.setOptions({
        ...props.mapsOptions,
      });
    }
  }, [props.mapsOptions, map]);

  // Get Current Position from GeoLocation API
  useEffect(() => {
    if (map && marker) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Set Map Center to Coords
          props.setMapsOptions((prev) => {
            return { ...prev, center: coords };
          });

          // Set Marker Position to Coords
          marker.setPosition(coords);
        });
      }
    }
    // eslint-disable-next-line
  }, [map, marker]);

  return isGoogleLoaded ? (
    <div
      className={`map-container p-2 ${
        props.mapContainerClassNames ? props.mapContainerClassNames : ''
      }`}
    >
      {props.autocomplete && (
        <>
          <input
            id={autocompleteElementId.current}
            placeholder="Search Location..."
            className={`p-2 border focus:outline-none my-2 focus:ring inline-block w-full ${
              props.autocompleteClassNames ? props.autocompleteClassNames : ''
            }`}
          />
        </>
      )}

      <div
        id={mapElementId.current}
        className={`w-full h-80 mx-auto my-2 ${
          props.mapClassNames ? props.mapClassNames : ''
        }`}
      ></div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

GoogleMaps.propTypes = {
  w3w: function (props, propName, componentName) {
    if (
      !props[propName] ||
      props[propName].get === undefined ||
      props[propName].get === null ||
      props[propName].set === undefined ||
      props[propName].set === null
    ) {
      return new Error(
        `${propName} is Required!\n${propName} = { get: state, set: setState }`
      );
    }
  },
  address: function (props, propName, componentName) {
    if (
      !props[propName] ||
      props[propName].get === undefined ||
      props[propName].get === null ||
      props[propName].set === undefined ||
      props[propName].set === null
    ) {
      return new Error(
        `${propName} is Required!\n${propName} = { get: state, set: setState }`
      );
    }
  },
};

export default React.memo(GoogleMaps);
