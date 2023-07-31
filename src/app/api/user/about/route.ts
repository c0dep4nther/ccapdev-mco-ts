import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AboutValidator } from "@/lib/validators/about";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = AboutValidator.parse(body);

    const about = await db.user.findFirst({
      where: {
        about: name,
      },
    });

    // update about
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        about: name,
      },
    });

    return new Response("OK");
  } catch (err) {
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }

    // Handle other errors
    return new Response("Could not udpdate about you, please try again later.", {
      status: 500,
    });
  }
}
