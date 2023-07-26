import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import React from "react";
import PostFeed from "./PostFeed";
import { getAuthSession } from "@/lib/auth";

async function UserFeed() {
    const session = await getAuthSession();
    const userId = session?.user?.id;
  
    const userPosts = await db.post.findMany({
        where: {
          author: {
            id: userId,
            },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          votes: true,
          author: true,
          comments: true,
          subreddit: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      });

  return <PostFeed initialPosts={userPosts} />;
}

export default UserFeed;
