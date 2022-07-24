import type { FC } from 'react';
import { useSession } from "next-auth/react";
import { useEffect } from 'react';
import style from './style.module.scss';

const postLink = async (url: string) => {
   const response = await fetch('/api/link', {
      method: 'POST',
      body: JSON.stringify(url),
      headers: { 'Content-Type': 'application/json' },
   });

   return await response.json();
};

const LinkForm: FC = () => {
   const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      const url = new FormData(evt.currentTarget).get('url') as string;
      postLink(url).then(res => console.log(res));
   };

   return (
      <form onSubmit={handleSubmit}>
         <label htmlFor="url">Add new Link</label><br />
         <input type="url" name="url" id="url" />
         <button type="submit">Add Link</button>
      </form>
   );
}

export default LinkForm;