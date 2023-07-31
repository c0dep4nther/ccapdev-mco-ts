import { z } from "zod";

export const DisplayNameValidator = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[\s\S]*$/),
});

export type DisplayNameRequest = z.infer<typeof DisplayNameValidator>;
