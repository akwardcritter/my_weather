import { useState } from 'react';
import { LocationDataType } from './InputForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface LocationResultsProps {
  response: LocationDataType[];
  func: (chosenLocation: LocationDataType) => void;
}

export const LocationResults = ({ response, func }: LocationResultsProps) => {
  return (
    <ScrollArea className="w-96 h-52 whitespace-nowrap rounded-md border">
      {response.map((entry, index) => (
        // eslint-disable-next-line react/jsx-key
        <Card key={index} onClick={() => func(entry)} className="mb-2">
          <CardHeader>
            <CardTitle>{entry.name}</CardTitle>
            <CardDescription>{entry.country}</CardDescription>
          </CardHeader>
          <CardContent>{entry.state}</CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
};
