import Link from 'next/link';
import { FC } from 'react';
import style from './style.module.scss';
import { signOut } from 'next-auth/react';

type Props = {
   children: React.ReactNode;
}

const DashboardLayout: FC<Props> = ({ children }) => {
   return (
      <>
         <header className={style.header}>
            <Link href="/">Linklet</Link>
            <nav>
               <button onClick={() => signOut({
                  redirect: true,
                  callbackUrl: window.location.origin
               })}>
                  Sign Out
               </button>
            </nav>
         </header>
         <main className={style.main}>
            {children}
         </main>
         <footer className={style.footer}>
            <small>Footer</small>
         </footer>
      </>
   );
};

export default DashboardLayout;