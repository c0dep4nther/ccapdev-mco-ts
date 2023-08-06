import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { UpdatePostValidator } from "@/lib/validators/post";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      postId : id,
      title,
      subredditId,
      content,
    } = UpdatePostValidator.parse(body);
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.post.update({
      data: {
        id,
        title,
        subredditId,
        content,
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