// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    // fetch all posts
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

	const { firstName, lastName, bio } = req.body;
	const processedData = {
		name: firstName + " " + lastName,
		bio
	};
    try {
      const result = await db.user.update({
        where: {
          email: session?.user?.email || "",
        },
        data: {
          ...processedData
        },
      });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(403).json({ error: error.message });
    }
  }
}