import useSWRLib, { SWRConfiguration } from 'swr';

const fetcher = async (
   input: RequestInfo,
   init?: RequestInit,
   ...args: any[]
) => {
   const response = await fetch(input, init);
   return response.json();
}

export default function useSWR(url: string, config?: SWRConfiguration) {
   return useSWRLib(url, fetcher, config);
};