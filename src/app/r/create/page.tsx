"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {};

function Page({}: Props) {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: createcommunity, isLoading } = useMutation({
    // Mutation function for creating a subreddit
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };

      const { data } = await axios.post("/api/subreddit", payload);
      return data as string;
    },
    onError: (err) => {
      // Error handling for different error scenarios
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "This subreddit already exists.",
            description: "Please choose a different subreddit name.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: "Invalid subreddit name.",
            description: "Please choose a name between 3 and 21 characters.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      // Generic error message
      toast({
        title: "Something went wrong.",
        description: "Could not create subreddit.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      // Redirect to the created subreddit page on success
      router.push(`/r/${data}`);
    },
  });

  return (
    <div>
      <div className="container flex items-center h-full max-w-3xl mx-auto">
        <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Create a Community</h1>
          </div>

          <hr className="bg-zinc-500 h-px" />

          <div>
            <p className="text-lg font-medium">Name</p>
            <p className="text-xs pb-2">
              Community names including capitalization cannot be changed.
            </p>

            <div className="relative">
              <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
                r/
              </p>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-6"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>

            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Community
              </Button>
            ) : (
              <Button
                disabled={input.length === 0}
                onClick={() => createcommunity()}
              >
                Create Community
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
