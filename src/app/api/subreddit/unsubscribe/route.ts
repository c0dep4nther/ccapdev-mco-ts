import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

/**
 * Handles the HTTP POST request to unsubscribe a user from a subreddit.
 *
 * @param req - The incoming request object.
 * @returns A response indicating the success or failure of the unsubscription.
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

    // Check if the subscription exists
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("You are not subscribed to this subreddit", {
        status: 400,
      });
    }

    // Check if the user is the creator of the subreddit
    const subreddit = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    });

    if (subreddit) {
      return new Response(
        "You cannot unsubscribe from a subreddit you created",
        { status: 400 }
      );
    }

    // Delete the subscription
    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user.id,
        },
      },
    });

    return new Response(subredditId);
  } catch (err) {
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }

    // Handle other errors
    return new Response("Could not unsubscribe, please try again later.", {
      status: 500,
    });
  }
}
