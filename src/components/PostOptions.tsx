"use client";
import React, { useRef, useState } from "react";
import { formatTimeToNow } from "@/lib/utils";
import Editor from "@/components/Editor";
import CommentVotes from "./CommentVotes";
import { Button } from "./ui/Button";
import { Loader2, MessageSquare, XSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { useMutation } from "@tanstack/react-query";
import {
  UpdatePostRequest,
  DeletePostRequest,
} from "@/lib/validators/post";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";



type Props = {
  postId: string;
  authorId: string | undefined;
  subredditId: string;
};

function PostOptions({ postId, authorId, subredditId }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
//   const [editInput, setEditInput] = useState<string>(comment.text);
//   const [savedText, setSavedText] = useState<string>(comment.text);


  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: deletePost, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async ({ postId }: DeletePostRequest) => {
      const payload: DeletePostRequest = {
        postId,
      };

      const { data } = await axios.delete("/api/subreddit/post/delete", {
        data: payload,
      });
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong.",
        description: "Your post could not be deleted. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsDeleteDialogOpen(false);
    },
  });

 

  return (


      <div className="flex gap-2 items-center flex-wrap mt-4">

    {/* Show edit button only if this comment is ours. */}
    {typeof session?.user.id === "string" &&
          session.user.id === authorId && (
            <>
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

              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      if (!session) {
                        return router.push("/sign-in");
                      }
                      setIsReplying(false);
                      setIsEditing(false);
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    <XSquare className="h-4 w-4 mr-1.5" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete post?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete your post? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="secondary"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Keep
                    </Button>
                    <Button
                      disabled={isDeleteLoading}
                      onClick={() =>
                        deletePost({
                          postId: postId,
                        })
                      }
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}


        {isEditing ? (
          <div className="grid w-full gap-1.5">
            

            <div className="mt-2 gap-2">
              <Editor subredditId={subredditId} isEditing={true} postId={postId}/>

              <div className="mt-2 flex justify-end">
                <Button
                  tabIndex={-1}
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full" form="edit-form">
                  
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
 );
}

export default PostOptions;
