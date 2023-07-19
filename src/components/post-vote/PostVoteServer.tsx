import { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import PostVoteClient from "./PostVoteClient";
import { getAuthSession } from "@/lib/auth";

type Props = {
  postId: string;
  initialVotesAmt?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
};

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function PostVoteServer({
  postId,
  initialVotesAmt,
  initialVote,
  getData,
}: Props) {
  const session = await getAuthSession();

  let _votesAmt: number = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    await wait(2000);
    const post = await getData();

    if (!post) {
      return notFound();
    }

    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") {
        return acc + 1;
      }
      if (vote.type === "DOWN") {
        return acc - 1;
      }
      return acc;
    }, 0);

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id
    )?.type;
  } else {
    _votesAmt = initialVotesAmt!;
    _currentVote = initialVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVotesAmt={_votesAmt}
      initialVote={_currentVote}
    />
  );
}

export default PostVoteServer;
