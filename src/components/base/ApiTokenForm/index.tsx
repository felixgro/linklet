import { FC } from 'react';
import { useApiToken } from '@lib/client/api/token';
import style from './style.module.scss';

const ApiTokenForm: FC = () => {
   const [apiToken, refreshApiToken, deleteApiToken] = useApiToken();

   return (
      <>
         <label>Auth key: {apiToken !== '' ? apiToken : 'no token'}</label><br />
         <button role="button" onClick={() => refreshApiToken()}>Generate new key</button>
         <span>--</span>
         <button role="button" onClick={() => deleteApiToken()}>Delete key</button>
      </>
   );
}

export default ApiTokenForm;