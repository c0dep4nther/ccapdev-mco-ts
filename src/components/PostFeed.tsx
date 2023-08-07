"use client"

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import Post from "./Post";

type Props = {
  initialPosts: ExtendedPost[];
  subredditName?: string;
  authorId?: string;
};

function PostFeed({ initialPosts, subredditName, authorId }: Props) {
  const lastPostRef = useRef<HTMLLIElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const subredditQuery =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : "");

      const userQuery =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!authorId ? `&authorId=${authorId}` : "");

      const { data } = userQuery
        ? await axios.get(userQuery)
        : await axios.get(subredditQuery);

      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmt = (() => {
          if (post.votes && post.votes.length > 0) {
            let totalVotes = 0;
            for (const vote of post.votes) {
              if (vote.type === "UP") {
                totalVotes += 1;
              } else if (vote.type === "DOWN") {
                totalVotes -= 1;
              }
            }
            return totalVotes;
          }
          return 0;
        })();

        const currentVote = post.votes?.find(
          (vote) => vote.userId === session?.user.id
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                currentVote={currentVote}
                votesAmt={votesAmt}
                commentAmt={post.comments.length}
                post={post}
                subredditName={post.subreddit.name}
              />
            </li>
          );
        } else {
          return (
            <Post
              key={post.id}
              currentVote={currentVote}
              votesAmt={votesAmt}
              commentAmt={post.comments.length}
              post={post}
              subredditName={post.subreddit.name}
            />
          );
        }
      })}
    </ul>
  );
}

export default PostFeed;