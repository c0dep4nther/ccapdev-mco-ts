"use client"

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { formatTimeToNow } from "@/lib/utils";
import { useIntersection } from "@mantine/hooks";
import { Comment, Post, Subreddit, User, Vote } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import React, { Fragment, useEffect } from "react";

type ExtendedComments = (Comment & {
  post: Post & {
    subreddit: Subreddit;
    author: User;
    votes: Vote[];
  };
})[];

function CommentsFeed({ initialComments, username }:
{
    initialComments: ExtendedComments;
    username: string | null | undefined;
}){
  const lastPostRef = React.useRef<HTMLLIElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        `/api/comments/by-user/${username}?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`
      );

      return data as ExtendedComments;
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialComments], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const comments = data?.pages.flatMap((page) => page) ?? initialComments;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {comments.map((comment) => {
        if (comment.post === undefined)
          return <Fragment key={comment.id}></Fragment>;

        const votesAmt = comment.post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") {
            return acc + 1;
          }

          if (vote.type === "DOWN") {
            return acc - 1;
          }

          return acc;
        }, 0);

        return (
          <div key={comment.id} className="rounded-b-lg bg-white shadow">
            <Link
              href={`/r/${comment.post.subreddit.name}/post/${comment.postId}`}
              className="grid grid-cols-[2rem_1fr] px-3 py-3 bg-gray-50 border border-gray-50"
            >
              <div className="flex justify-center items-center">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <span className="font-medium">u/{username}</span>{" "}
                <span className="text-gray-500">commented on </span>
                <span className="font-medium text-gray-700">
                  {comment.post.title}
                </span>{" "}
                ·{" "}
                <span className="font-semibold">
                  r/{comment.post.subreddit.name}
                </span>{" "}
                ·{" "}
                <span className="text-gray-500">
                  Posted by u/{comment.post.author.username}
                </span>
              </div>
            </Link>
            <div className="grid grid-cols-1 px-3 pt-3 pb-3 rounded-b-lg border border-white">
              <div>
                <div className="text-sm mb-1">
                  u/{username}{" "}
                  <span className="text-gray-500">
                    {votesAmt} points ·{" "}
                    {formatTimeToNow(new Date(comment.post.createdAt))}
                  </span>
                </div>
                <div>{comment.text}</div>
              </div>
            </div>
          </div>
        );
      })}
    </ul>
  );
}

export default CommentsFeed;