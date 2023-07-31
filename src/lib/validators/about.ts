import { z } from "zod";

export const AboutValidator = z.object({
  name: z
    .string()
    .max(200)
    .regex(/^[\s\S]*$/),
});

export type AboutRequest = z.infer<typeof AboutValidator>;
