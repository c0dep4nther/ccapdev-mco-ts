import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DisplayNameValidator } from "@/lib/validators/displayname";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = DisplayNameValidator.parse(body);

    const displayname = await db.user.findFirst({
      where: {
        name: name,
      },
    });

    // update display name
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name,
      },
    });

    return new Response("OK");
  } catch (err) {
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }

    // Handle other errors
    return new Response("Could not update display name, please try again later.", {
      status: 500,
    });
  }
}
