import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

/**
 * The code extends the existing `Session` and `JWT` types from the `next-auth` and `next-auth/jwt` modules.
 * It adds the `id` and `username` properties to both types, allowing them to be used in the application.
 */

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    username?: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      username?: string | null;
    };
  }
}
