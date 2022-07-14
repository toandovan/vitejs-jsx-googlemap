import { Loader } from '@googlemaps/js-api-loader';

const mapsLoader = (options = {}) => {
  return new Loader({
    apiKey: 'AIzaSyCIoNw02KgH_Huk9_aOD9VxtyXmMc_I6Sk',
    version: 'weekly',
    libraries: ['places'],
    ...options,
  });
};
export default mapsLoader;
