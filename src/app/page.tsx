'use client';
import { InputForm, LocationDataType } from '@/components/InputForm';
import { LocationResults } from '@/components/LocationResults';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react';
import { Weather } from '@/components/Weather';

// inspired by https://www.freecodecamp.org/news/learn-react-by-building-a-weather-app/

export default function Home() {
  const [chosenLocation, setChosenLocation] = useState<LocationDataType>();
  const [locationResults, setLocationResults] = useState<LocationDataType[]>();

  const pullLocation = (response: LocationDataType[]) => {
    setLocationResults(response);
  };

  const choseLocation = (chosenLocation: LocationDataType) => {
    setChosenLocation(chosenLocation);
  };

  return (
    <div className="m-[4%] flex gap-5 max-h-screen">
      <div>
        <InputForm func={pullLocation}></InputForm>
        {locationResults ? (
          <>
            <Separator className="my-4"></Separator>
            <LocationResults
              func={choseLocation}
              response={locationResults}
            ></LocationResults>
          </>
        ) : null}
      </div>
      {chosenLocation ? (
        <Weather
          latitude={chosenLocation.lat}
          longitude={chosenLocation.lon}
        ></Weather>
      ) : null}
    </div>
  );
}
