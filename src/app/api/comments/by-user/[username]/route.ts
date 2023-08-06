import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(
  req: Request,
  context: {
    params: {
      username: string;
    };
  }
) {
  const url = new URL(req.url);

  try {
    const { limit, page, username } = z
      .object({
        limit: z.string(),
        page: z.string(),
        username: z.string(),
      })
      .parse({
        username: context.params.username,
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    const comments = await db.comment.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      where: {
        AND: [
          {
            author: {
              username,
            },
          },
          {
            isDeleted: false,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        post: {
          include: {
            subreddit: true,
            author: true,
            votes: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(comments));
  } catch (err) {
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }

    // Handle other errors
    return new Response("Could not fetch more posts.", { status: 500 });
  }
}
