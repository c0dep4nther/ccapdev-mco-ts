import { z } from "zod";

/**
 * SubredditValidator is a Zod schema that validates the subreddit name.
 * It ensures that the name is a string with a minimum length of 3 and a maximum length of 21.
 */
export const SubredditValidator = z.object({
  name: z.string().min(3).max(21),
});

/**
 * SubredditSubscriptionValidator is a Zod schema that validates the subreddit subscription payload.
 * It ensures that the payload contains a subredditId property of type string.
 */
export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string(),
});

/**
 * CreateSubredditPayload is the inferred type from the SubredditValidator schema.
 * It represents the payload shape for creating a subreddit.
 */
export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;

/**
 * SubscribeToSubredditPayload is the inferred type from the SubredditSubscriptionValidator schema.
 * It represents the payload shape for subscribing to a subreddit.
 */
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>;
