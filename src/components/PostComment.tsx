"use client";

import { Comment, CommentVote, User } from "@prisma/client";
import React, { useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "./CommentVotes";
import { Button } from "./ui/Button";
import { Loader2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest, UpdateCommentRequest } from "@/lib/validators/comment";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

type Props = {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
};

function PostComment({ comment, votesAmt, currentVote, postId }: Props) {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [editInput, setEditInput] = useState<string>(comment.text);
  const [savedText, setSavedText] = useState<string>(comment.text);

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(
        "/api/subreddit/post/comment",
        payload
      );
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong.",
        description: "Your comment was not posted. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
      setInput("");
    },
  });

  const { mutate: editComment, isLoading: isEditLoading } = useMutation({
    mutationFn: async ({
      id,
      postId,
      text,
      replyToId,
    }: UpdateCommentRequest) => {
      const payload: UpdateCommentRequest = {
        id,
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.post("/api/subreddit/post/comment", payload);
      setSavedText(text);
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong.",
        description: "Your comment was not updated. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      router.refresh();
      setIsEditing(false);
      setEditInput(variables.text);
    },
  });

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />

        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
          {comment.createdAt.getTime() !== comment.updatedAt.getTime() && (
            <p className="max-h-40 truncate text-xs text-zinc-500">(edited)</p>
          )}
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{savedText}</p>

      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes
          commentId={comment.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote}
        />

        <Button
          onClick={() => {
            if (!session) {
              return router.push("/sign-in");
            }
            setIsEditing(false);
            setIsReplying(true);
          }}
          variant="ghost"
          size="sm"
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Reply
        </Button>

        {/* Show edit button only if this comment is ours. */}
        {typeof session?.user.id === "string" &&
          session.user.id === comment.authorId && (
            <Button
              onClick={() => {
                if (!session) {
                  return router.push("/sign-in");
                }
                setIsReplying(false);
                setIsEditing(true);
              }}
              variant="ghost"
              size="sm"
            >
              <MessageSquare className="h-4 w-4 mr-1.5" />
              Edit
            </Button>
          )}

        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your Comment</Label>

            <div className="mt-2 gap-2">
              <Textarea
                id="comment"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />

              <div className="mt-2 flex justify-end">
                <Button
                  tabIndex={-1}
                  variant="ghost"
                  onClick={() => {
                    setIsReplying(false);
                    setInput("");
                  }}
                >
                  Cancel
                </Button>
                {isLoading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Post
                  </Button>
                ) : (
                  <Button
                    disabled={input.length === 0}
                    onClick={() => {
                      if (!input) return;
                      postComment({
                        postId,
                        text: input,
                        replyToId: comment.replyToId ?? comment.id,
                      });
                    }}
                  >
                    Post
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {isEditing ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Editing comment</Label>

            <div className="mt-2 gap-2">
              <Textarea
                id="comment"
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />

              <div className="mt-2 flex justify-end">
                <Button
                  tabIndex={-1}
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setEditInput(comment.text);
                  }}
                >
                  Cancel
                </Button>
                {isEditLoading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Update
                  </Button>
                ) : (
                  <Button
                    disabled={editInput.length === 0}
                    onClick={() => {
                      if (!editInput) return;
                      editComment({
                        id: comment.id,
                        postId,
                        text: editInput,
                        replyToId: comment.replyToId,
                      });
                    }}
                  >
                    Update
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PostComment;
