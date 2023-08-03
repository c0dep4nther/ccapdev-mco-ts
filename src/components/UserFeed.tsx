import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import React from "react";
import PostFeed from "./PostFeed";

type Props = {
  username: string | null | undefined;
};

async function UserFeed({ username }: Props) {
  const user = await db.user.findFirst({
    where: {
      username: username,
    },
  });

  const posts = await db.post.findMany({
    where: {
      authorId: user?.id,
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

  return <PostFeed initialPosts={posts} authorId={user?.id} />;
}

export default UserFeed;
