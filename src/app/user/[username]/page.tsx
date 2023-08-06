import React from "react";
import { CommentsFeed } from "./user-post-comments";
import { db } from "@/lib/db";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

export async function CommentsPreloader({ username }: { username: string }) {
  const comments = await db.comment.findMany({
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
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

  if (comments.some((comment) => comment.post === undefined)) {
    console.log("Warning! one more comment.post is undefined", comments);
  }

  return <CommentsFeed username={username} initialComments={comments as any} />;
}

export default async function Home({
  params,
}: {
  params: { username: string };
}) {
  return (
    <>
      <h2 className="font-bold text-3xl md:text-4xl mb-6">
        u/{params.username}
      </h2>
      <div>
        <button
          type="button"
          className="font-semibold border-b-2 border-gray-700 pb-1"
        >
          Comments
        </button>
      </div>
      <div className="grid gap-y-4 gap-x-4 py-6">
        <CommentsPreloader username={params.username} />
      </div>
    </>
  );
}
