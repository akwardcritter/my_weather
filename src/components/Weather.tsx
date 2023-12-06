import { CurrentWeather } from './CurrentWeather';
import Forecast from './Forecast';

interface WeatherProps {
  longitude: number;
  latitude: number;
}

export const Weather = ({ longitude, latitude }: WeatherProps) => {
  return (
    <>
      <CurrentWeather
        latitude={latitude}
        longitude={longitude}
      ></CurrentWeather>
      <Forecast latitude={latitude} longitude={longitude} />
    </>
  );
};
