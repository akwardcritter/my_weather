// components/Forecast.tsx

import React, { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Image from 'next/image';

interface ForecastProps {
  latitude: number;
  longitude: number;
}

interface ForecastDataType {
  list: {
    dt_txt: string;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h': number;
    };
    sys: {
      pod: string;
    };
  }[];
}

const groupForecastByDay = (forecastList: ForecastDataType['list']) => {
  const groupedForecast: { [date: string]: ForecastDataType['list'] } = {};

  forecastList.forEach((entry) => {
    const date = entry.dt_txt.split(' ')[0];
    if (!groupedForecast[date]) {
      groupedForecast[date] = [];
    }
    groupedForecast[date].push(entry);
  });

  return groupedForecast;
};

const Forecast: React.FC<ForecastProps> = ({ latitude, longitude }) => {
  const [forecastData, setForecastData] = useState<ForecastDataType>();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/forecast?lat=${latitude}&lon=${longitude}&units=metric&APPID=${process.env.NEXT_PUBLIC_REACT_APP_API_KEY}`,
        );

        const responseData: ForecastDataType = response.data;
        setForecastData(responseData);
        console.log('Forecast data: ', responseData);
      } catch (error) {
        const err = error as AxiosError;
        if (axios.isAxiosError(err)) {
          console.error('Axios error: ', err.message);
        } else {
          throw new Error('Different error than axios');
        }
      }
    };

    fetchForecast();
  }, [latitude, longitude]);

  const groupedForecast = forecastData
    ? groupForecastByDay(forecastData.list)
    : {};

  const getDayOfWeek = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    const date = new Date(dateString.replace(/-/g, '/'));
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '16px',
        overflowX: 'auto',
      }}
    >
      {Object.entries(groupedForecast).map(([date, entries], index) => (
        <div
          key={index}
          style={{
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedDay(selectedDay === date ? null : date)}
        >
          <h3 style={{ fontSize: '1.5rem', margin: '8px 0' }}>
            {getDayOfWeek(date)}
          </h3>
          {selectedDay === date ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
                marginTop: '16px',
              }}
            >
              {entries.map((entry, entryIndex) => (
                <div
                  key={entryIndex}
                  style={{
                    textAlign: 'center',
                    flex: '0 0 auto',
                    padding: '16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                  }}
                >
                  <p style={{ fontSize: '1rem', color: '#555' }}>
                    {entry.dt_txt.split(' ')[1]}
                  </p>
                  <Image
                    src={`https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`}
                    alt="weather icon"
                    width={50}
                    height={50}
                  />
                  <p style={{ fontSize: '1rem', color: '#555' }}>
                    {entry.weather[0].description}
                  </p>
                  <p
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      margin: '8px 0',
                    }}
                  >
                    {Math.round(entry.main.temp)} °C
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <p>Feels Like: {Math.round(entry.main.feels_like)} °C</p>
                    <p>Wind Speed: {entry.wind.speed} m/s</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Image
                src={`https://openweathermap.org/img/wn/${entries[0].weather[0].icon}.png`}
                alt="weather icon"
                width={50}
                height={50}
              />
              <p style={{ fontSize: '1rem', color: '#555' }}>
                {entries[0].weather[0].description}
              </p>
              <p
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: '8px 0',
                }}
              >
                {Math.round(entries[0].main.temp)} °C
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Forecast;
