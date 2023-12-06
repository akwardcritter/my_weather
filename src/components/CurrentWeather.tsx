import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Skeleton } from './ui/skeleton';

export interface WeatherDataType {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number; //condition id
      main: string; // Group of weather parameters (rain, snow, clouds etc)
      description: string; // weather condition within the group
      icon: string; //weather icon id
    },
  ];
  base: string;
  main: {
    temp: number; // Temp, Metric: Celsius
    feels_like: number; //human perception of temperature, Metric: Celsius
    temp_min?: number; // min temp at the moment
    temp_max?: number; // max temp at the moment
    pressure: number; //atmospheric pressure at sea level, hPa
    humidity: number; //Humidity in %
    sea_level?: number; //atmospheric pressure at sea level, hPa
    grnd_level?: number; //atmospheric pressure at ground level, hPa
  };
  visibility: number;
  wind: {
    speed: number; // wind speed, Metric: m/sec
    deg: number; // Wind direction, degrees (meterological)
    gust: number; // wind gust, metric: m/sec
  };
  clouds: {
    all: number; //cloudiness in %
  };
  rain?: {
    OneHour?: number; // rain volume for last 1 hour, mm
    ThreeHours?: number; // rain volume for last three hours, mm
  };
  snow?: {
    OneHour?: number; //snow volume for last 1 hour, mm
    ThreeHours?: number; // snow volume for last three hours, mm
  };
  dt: number; // Time of data calculation, unix UTC
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number; //unix, UTC
    sunset: number; //unix, UTC
  };
  timezone: number; //shift in seconds from UTC
  id: number;
  name: string; //city name
  cod: number;
}

interface CurrentWeatherProps {
  longitude: number;
  latitude: number;
}

export const CurrentWeather = ({
  longitude,
  latitude,
}: CurrentWeatherProps) => {
  const [currentWeatherData, setCurrentWeatherData] =
    useState<WeatherDataType>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/weather/?lat=${latitude}&lon=${longitude}&units=metric&APPID=${process.env.NEXT_PUBLIC_REACT_APP_API_KEY}`,
        );
        const responseData: WeatherDataType = response.data;
        setCurrentWeatherData(responseData);
        console.log('weather: ', responseData);
      } catch (error) {
        const err = error as AxiosError;
        if (axios.isAxiosError(err)) {
          console.error('Axios error: ', err.message);
        } else {
          throw new Error('different error than axios');
        }
      }
    };
    fetchData();
  }, [latitude, longitude]);

  return (
    <>
      {currentWeatherData ? (
        <Card className="flex flex-col justify-center items-center min-w-fit">
          <CardHeader>
            <CardTitle className="text-center">Current Weather</CardTitle>
            <CardDescription className="text-center">
              in {currentWeatherData.name}, {currentWeatherData.sys.country}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <p className="font-semibold text-6xl">
                {Math.round(currentWeatherData.main.temp)} °C
              </p>
              <Image
                src={`https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`}
                alt="cloudy"
                width={50}
                height={50}
              ></Image>
              <p className="text-center">
                {currentWeatherData.weather[0].description}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
};
