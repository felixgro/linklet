import type { NextApiRequest, NextApiResponse } from 'next';
import type { JWT } from 'next-auth/jwt';
import type { Link } from '@prisma/client';
import { randomUUID } from 'crypto';
import { getJWT } from '@lib/jwt';
import prisma from '@lib/prisma';

type LinkResponse = {
   error?: any;
   token?: string;
   links?: Link[];
}

const getArchiveCollection = async (jwt: JWT) => {
   // Get archive collection
   let archiveCollection = await prisma.linkCollection.findFirst({
      where: { userId: jwt.uid as string, isArchive: true },
   });

   // create archive collection if it doesn't exist
   if (!archiveCollection) {
      archiveCollection = await prisma.linkCollection.create({
         data: {
            userId: jwt.uid as string,
            title: 'All',
            isArchive: true,
         }
      });
   }

   return archiveCollection;
};

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse<LinkResponse>
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
   res: NextApiResponse<LinkResponse>,
   jwt: JWT
) => {
   const archiveCollection = await getArchiveCollection(jwt);

   // Get all links in archive collection
   const links = await prisma.link.findMany({
      where: { collectionId: archiveCollection.id },
   });

   return res.status(200).json({ links });
};


const POST = async (
   req: NextApiRequest,
   res: NextApiResponse<LinkResponse>,
   jwt: JWT
) => {
   const url = req.body;

   if (typeof url !== 'string' || url.length < 3) {
      return res.status(400).json({ error: 'invalid-request' });
   }

   const archiveCollection = await getArchiveCollection(jwt);

   const newLink = await prisma.link.create({
      data: {
         url,
         collectionId: archiveCollection.id,
      }
   });

   return res.status(200).json({ links: [newLink] });
};


const DELETE = async (
   req: NextApiRequest,
   res: NextApiResponse<LinkResponse>,
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