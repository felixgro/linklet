import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';

const Test: NextPage = () => {
   const { data: session, status } = useSession({ required: false });

   if (status === 'loading') {
      return <p>Loading...</p>;
   }

   if (status === 'authenticated') {
      return (
         <>
            <div>Welcome!</div>
            <button onClick={() => signOut()}>Sign out</button>
         </>
      );
   } else {
      return <>
         <div>Ew.. Stranger!</div>
         <button onClick={() => signIn()}>Sign In</button>
      </>;
   }
}

export default Test;
