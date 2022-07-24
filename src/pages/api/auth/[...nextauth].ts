import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, {
   secret: process.env.SECRET,

   adapter: PrismaAdapter(prisma),

   providers: [
      GithubProvider({
         clientId: process.env.GITHUB_ID,
         clientSecret: process.env.GITHUB_SECRET,
      }),
      EmailProvider({
         server: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
               user: process.env.SMTP_USER,
               pass: process.env.SMTP_PASSWORD,
            },
         },
         from: process.env.SMTP_FROM,
      }),
   ],

   callbacks: {
      session: async ({ session, token }) => {
         if (session?.user) {
            (session.user as any).id = token.uid;
         }
         return session;
      },
      jwt: async ({ user, token }) => {
         if (user) {
            token.uid = user.id;
         }
         return token;
      },
   },

   events: {
      createUser: async ({ user }) => {
         await prisma.linkCollection.create({
            data: {
               title: 'All',
               isArchive: true,
               user: {
                  connect: { id: user.id },
               },
            },
         });
      }
   },

   session: {
      jwt: true
   },

   jwt: {
      secret: process.env.JWT_SECRET,
      signingKey: process.env.JWT_SIGNING_KEY,
      // encryptionKey: process.env.JWT_ENCRYPTION_KEY,
   }
});

export default authHandler;