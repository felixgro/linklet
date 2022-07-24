import type { NextApiRequest, NextApiResponse } from 'next';
import type { JWT } from 'next-auth/jwt';
import { randomUUID } from 'crypto';
import { getJWT } from '@lib/jwt';
import prisma from '@lib/prisma';

type TokenResponse = {
   error?: any;
   token?: string;
}


export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse<TokenResponse>
) {
   // acts as auth middleware for all http methods of this route
   const jwt = await getJWT(req, res);

   switch (req.method) {
      case 'GET': return GET(req, res, jwt);
      case 'POST': return POST(req, res, jwt);
      case 'DELETE': return DELETE(req, res, jwt);
      default:
         return res.status(405).json({ error: 'method-not-allowed' });
   }
}


const GET = async (
   req: NextApiRequest,
   res: NextApiResponse<TokenResponse>,
   jwt: JWT
) => {
   const apiToken = await prisma.apiToken.findFirst({
      where: { userId: jwt.uid as string }
   });

   return res.status(200).json({ token: apiToken ? apiToken.token! : '' });
};


const POST = async (
   req: NextApiRequest,
   res: NextApiResponse<TokenResponse>,
   jwt: JWT
) => {
   const freshApiToken = randomUUID();

   await prisma.apiToken.upsert({
      where: { userId: jwt.uid as string },
      create: { userId: jwt.uid as string, token: freshApiToken },
      update: { token: freshApiToken },
   });

   return res.status(200).json({ token: freshApiToken });
};


const DELETE = async (
   req: NextApiRequest,
   res: NextApiResponse<TokenResponse>,
   jwt: JWT
) => {
   try {
      await prisma.apiToken.delete({
         where: { userId: jwt.uid as string }
      });
   } finally {
      return res.status(200).json({ token: '' });
   }
};