import { Redis } from "@upstash/redis/nodejs";

export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_SECRET!,
});
