import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

/**
 * Handles the HTTP POST request to subscribe a user to a subreddit.
 *
 * @param req - The incoming request object.
 * @returns A response indicating the success or failure of the subscription.
 */
export async function POST(req: Request) {
  try {
    // Get the authenticated session
    const session = await getAuthSession();

    // Check if the user is authenticated
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    // Check if the subscription already exists
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (subscriptionExists) {
      return new Response("Already subscribed", { status: 400 });
    }

    // Create a new subscription
    await db.subscription.create({
      data: {
        subredditId,
        userId: session.user.id,
      },
    });

    return new Response(subredditId);
  } catch (err) {
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return new Response("Invalid POST request data passed.", { status: 422 });
    }

    // Handle other errors
    return new Response("Could not subscribe, please try again later.", {
      status: 500,
    });
  }
}
