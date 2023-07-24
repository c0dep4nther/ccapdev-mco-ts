import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  commentValidator,
  updateCommentValidator,
} from "@/lib/validators/comment";
import { z } from "zod";

// Handle create comment request.
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, text, replyToId } = commentValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    });

    return new Response("OK");
  } catch (err) {
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }

    // Handle other errors
    return new Response("Could not create comment, please try again later.", {
      status: 500,
    });
  }
}

// Handle update comment request.
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, postId, text, replyToId } = updateCommentValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.comment.update({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
      where: {
        id,
      },
    });

    return new Response("OK");
  } catch (err) {
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }

    // Handle other errors
    return new Response("Could not update comment, please try again later.", {
      status: 500,
    });
  }
}
