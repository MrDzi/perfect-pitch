/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState, useEffect } from "react";

export enum HttpMethods {
  GET,
  POST,
}
interface UseFetchParams {
  url: string;
  method: HttpMethods;
  body?: { [key: string]: any } | null;
  params?: { [key: string]: string };
}

const useFetch = <T>({ url, method, body, params }: UseFetchParams): [T | null, Error | null, boolean] => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let response;
        switch (method) {
          case HttpMethods.GET: {
            response = await axios.get(url, { params });
            setData(response.data);
            return;
          }
          case HttpMethods.POST: {
            response = await axios.post(url, body, { params });
            setData(response.data);
            return;
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return [data, error, isLoading];
};

export default useFetch;
