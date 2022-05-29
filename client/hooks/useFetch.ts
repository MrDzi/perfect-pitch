/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState, useEffect } from "react";
import { HttpMethods } from "../types/types";
import usePrevious from "./usePrevious";

interface UseFetchParams {
  url: string;
  method: HttpMethods;
  body?: { [key: string]: any } | null;
  params?: { [key: string]: string };
  wait?: boolean;
}

const useFetch = <T>({ url, method, body, params, wait }: UseFetchParams): [T | null, Error | null, boolean] => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loaded, setLoaded] = useState(false);
  const prevWait = usePrevious<boolean | undefined>(wait);

  useEffect(() => {
    if (wait === undefined || (prevWait && !wait)) {
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
          setLoaded(true);
        }
      })();
    }
  }, [wait]);

  return [data, error, loaded];
};

export default useFetch;
