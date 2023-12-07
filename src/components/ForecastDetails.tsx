import { ForecastDataType } from './Forecast';
import { Card } from './ui/card';
import Image from 'next/image';

interface ForecastDetailProps {
  selectedEntry: ForecastDataType['list'];
}

export const ForecastDetails = ({ selectedEntry }: ForecastDetailProps) => {
  return (
    <Card className="flex flex-col gap-2 overflow-y-auto p-2 m-2 grow w-[70%] h-[40%]">
      {selectedEntry.map((entry, entryIndex) => (
        <Card key={entryIndex} className="flex items-center justify-evenly">
          <p style={{ fontSize: '1rem', color: '#555' }}>
            {entry.dt_txt.split(' ')[1].slice(0, 5)}
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
          <p>{Math.round(entry.main.temp)} °C</p>
          <p>Feels Like: {Math.round(entry.main.feels_like)} °C</p>
        </Card>
      ))}
    </Card>
  );
};
