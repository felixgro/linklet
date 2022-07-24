import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken, JWT } from 'next-auth/jwt';

export const getJWT = async (req: NextApiRequest, res: NextApiResponse): Promise<JWT> => {
   const token = await getToken({
      signingKey: process.env.JWT_SIGNING_KEY,
      req,
   });

   if (!token || !token.uid) {
      res.status(401).json({ error: 'unauthorized' });
      throw new Error(`unauthorized api request to ${req.url}`);
   }

   return token;
}