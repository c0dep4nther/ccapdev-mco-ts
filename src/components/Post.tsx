"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./PostVoteClient";

interface PostProps {
  id: string;
  author: string;
  title: string;
  content: string;
  votesAmt: number;
  subredditName: string;
  commentAmt: number;
}

function Post({
  id,
  author,
  title,
  content,
  votesAmt,
  subredditName,
  commentAmt,
}: PostProps) {
  const pRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient postId={id} votesAmt={votesAmt} />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <>
                <a
                  className="underline text-zinc-900 text-sm underline-offset-2"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by u/{author}</span>{" "}
          </div>
          <a href={`/r/${subredditName}/post/${id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            <p className="text-sm leading-5">{content}</p>
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6">
        <Link
          href={`/r/${subredditName}/post/${id}`}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </Link>
      </div>
    </div>
  );
}

export default Post;
