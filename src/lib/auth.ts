import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";
import { nanoid } from "nanoid";

/**
 * authOptions defines the configuration options for NextAuth.
 * It specifies the adapter, session strategy, pages, providers, and callbacks.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    /**
     * session callback is called whenever a session is created or updated.
     * It updates the session user object with additional properties from the token.
     */
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },

    /**
     * jwt callback is called whenever a JSON Web Token is created.
     * It fetches the user from the database and updates the token with additional properties.
     */
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      if (!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },

    /**
     * redirect callback is called after a successful sign-in or sign-up.
     * It specifies the redirect URL after authentication.
     */
    redirect() {
      return "/";
    },
  },
};

/**
 * getAuthSession is a utility function that returns the server session.
 * It uses the authOptions defined above to retrieve the server session.
 */
export const getAuthSession = () => getServerSession(authOptions);
