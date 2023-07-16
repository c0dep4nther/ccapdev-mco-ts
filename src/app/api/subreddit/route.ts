import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

/**
 * Handles the HTTP POST request to create a new subreddit.
 *
 * @param req - The incoming request object.
 * @returns A response indicating the success or failure of the subreddit creation.
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
    const { name } = SubredditValidator.parse(body);

    // Check if the subreddit already exists
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExists) {
      return new Response("Subreddit already exists", { status: 409 });
    }

    // Create the new subreddit
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // Create a subscription for the creator
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });

    return new Response(subreddit.name);
  } catch (err) {
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }

    // Handle other errors
    return new Response("Could not create subreddit", { status: 500 });
  }
}
