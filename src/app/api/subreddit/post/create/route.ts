import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

/**
 * Handles the HTTP POST request for creating a new post.
 * It validates the request data, checks the user's authentication status, and creates a new post in the database.
 *
 * @param req - The request object containing the HTTP request details.
 * @returns A response indicating the success or failure of the post creation.
 */
export async function POST(req: Request) {
  try {
    // Check user authentication status
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse request body and validate post data
    const body = await req.json();
    const { subredditId, title, content } = PostValidator.parse(body);

    // Check if the user has a subscription to the subreddit
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("Subscribe to post", { status: 400 });
    }

    // Create a new post in the database
    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId,
      },
    });

    return new Response("OK");
  } catch (err) {
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return new Response("Invalid POST data passed.", { status: 422 });
    }

    // Handle other errors
    return new Response(
      "Could not post to subreddit at this time, please try again later.",
      {
        status: 500,
      }
    );
  }
}
