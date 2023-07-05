import React from "react";
import { Button } from "./ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostVoteClientProps {
  postId: string;
  votesAmt: number;
}

function PostVoteClient({ postId, votesAmt }: PostVoteClientProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      {/* upvote */}
      <Button size="sm" variant="ghost" aria-label="upvote">
        <ArrowBigUp className={cn("h-5 w-5 text-zinc-700")} />
      </Button>

      {/* score */}
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmt}
      </p>

      {/* downvote */}
      <Button
        size="sm"
        className={cn("text-emerald-500")}
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigDown className={cn("h-5 w-5 text-zinc-700")} />
      </Button>
    </div>
  );
}

export default PostVoteClient;
