'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios, { AxiosResponse, AxiosError } from 'axios';

const FormSchema = z.object({
  city: z.string(),
});

export interface InputFormProps {
  func: (response: LocationDataType[]) => void;
}

export interface LocationDataType {
  name: string;
  local_names: {
    [lang: string]: string;
  };
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export const InputForm = ({ func }: InputFormProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      city: '',
    },
  });

  const fetchLocation = async (city: string) => {
    try {
      const response: AxiosResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_GEO}/direct?q=${city}&limit=5&APPID=${process.env.NEXT_PUBLIC_REACT_APP_API_KEY}`,
      );
      const responseData: LocationDataType[] = response.data;
      console.log('Response: ', responseData);

      func(responseData);
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isAxiosError(err)) {
        console.error('Axios error: ', err.message);
      } else {
        throw new Error('different error than axios');
      }
    }
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("You've submitted: ", data.city);
    fetchLocation(data.city);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
              <FormDescription>Look for your local weather.</FormDescription>
            </FormItem>
          )}
        ></FormField>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
