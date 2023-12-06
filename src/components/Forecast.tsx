// components/Forecast.tsx

import React, { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { HighchartsReact } from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { ForecastDetails } from './ForecastDetails';

interface ForecastProps {
  latitude: number;
  longitude: number;
}

export interface ForecastDataType {
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

  const currentDate = new Date();

  forecastList.forEach((entry) => {
    const entryDate = new Date(entry.dt_txt);

    if (entryDate.getDate() !== currentDate.getDate()) {
      const date = entry.dt_txt.split(' ')[0];
      if (!groupedForecast[date]) {
        groupedForecast[date] = [];
      }
      groupedForecast[date].push(entry);
    }
  });

  return groupedForecast;
};

const Forecast: React.FC<ForecastProps> = ({ latitude, longitude }) => {
  const [forecastData, setForecastData] = useState<ForecastDataType>();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<{
    entry?: ForecastDataType['list'];
    isSelected: boolean;
  }>({ isSelected: false });

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

  const options = {
    title: {
      text: 'Upcoming Temperatures',
    },
    xAxis: {
      categories: Object.entries(groupedForecast).map(([date, entries]) =>
        getDayOfWeek(date),
      ),
      accessibility: {
        description: 'upcoming days of the week',
      },
    },
    yAxis: {
      title: {
        text: 'Temperature',
      },
      labels: {
        format: '{value}°',
      },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [
      {
        name: '',
        data: Object.entries(groupedForecast).map(([date, entries]) =>
          Math.round(entries[0].main.temp),
        ),
      },
    ],
  };

  return (
    <div>
      <Card className="flex gap-5 overflow-scroll p-2 m-2 grow w-[70%]">
        {Object.entries(groupedForecast).map(
          ([date, entries]: [string, ForecastDataType['list']], index) => (
            <Card
              key={index}
              className="flex flex-col justify-start items-center cursor-pointer p-4 w-1/4"
              onClick={() =>
                setSelectedEntry((prevSelectedEntry) => ({
                  entry: entries,
                  isSelected: prevSelectedEntry.entry
                    ? prevSelectedEntry.entry[0].dt_txt === entries[0].dt_txt
                      ? !prevSelectedEntry.isSelected
                      : prevSelectedEntry.isSelected
                    : false,
                }))
              }
            >
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  {getDayOfWeek(date)}
                </CardTitle>
                <CardDescription className="text-center"></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <p className="font-semibold text-2xl">
                    {Math.round(entries[0].main.temp)} °C
                  </p>
                  <Image
                    src={`https://openweathermap.org/img/wn/${entries[0].weather[0].icon}.png`}
                    alt="weather icon"
                    width={50}
                    height={50}
                  />
                  <p className="text-center">
                    {entries[0].weather[0].description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </Card>
      {selectedEntry.entry ? (
        selectedEntry.isSelected ? (
          <ForecastDetails
            selectedEntry={selectedEntry.entry}
          ></ForecastDetails>
        ) : (
          <div className="flex grow h-80">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        )
      ) : null}
    </div>
  );
};

export default Forecast;
