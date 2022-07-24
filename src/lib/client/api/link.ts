import { useEffect, useState } from "react";
import useSWR from "@lib/client/swr";

export const useLink = (): [
   string, () => Promise<void>, () => Promise<void>
] => {
   const { data, error } = useSWR('/api/token');
   const [apiToken, setApiToken] = useState('');

   const refreshApiToken = async (): Promise<void> => {
      const response = await fetch('/api/token', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.token === undefined) throw new Error('no token received');

      setApiToken(data.token);
   };

   const deleteApiToken = async (): Promise<void> => {
      await fetch('/api/token', {
         method: 'DELETE',
         headers: { 'Content-Type': 'application/json' }
      });

      setApiToken('');
   };

   useEffect(() => {
      if (!data?.token) return;
      setApiToken(data.token);
   }, [data]);

   return [
      apiToken,
      refreshApiToken,
      deleteApiToken,
   ];
};