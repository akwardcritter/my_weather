import { CurrentWeather } from './CurrentWeather';
import Forecast from './Forecast';

interface WeatherProps {
  longitude: number;
  latitude: number;
}

export const Weather = ({ longitude, latitude }: WeatherProps) => {
  return (
    <div className="flex grow gap-5">
      <CurrentWeather
        latitude={latitude}
        longitude={longitude}
      ></CurrentWeather>
      <Forecast latitude={latitude} longitude={longitude} />
    </div>
  );
};
