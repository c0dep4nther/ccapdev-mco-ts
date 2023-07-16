"use client";

import React, { startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
};

/**
 * SubscribeLeaveToggle component provides a button to subscribe or unsubscribe from a subreddit.
 *
 * @param subredditId - The ID of the subreddit.
 * @param subredditName - The name of the subreddit.
 * @param isSubscribed - Indicates whether the user is already subscribed to the subreddit.
 */
function SubscribeLeaveToggle({
  subredditId,
  subredditName,
  isSubscribed,
}: Props) {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  // Mutation for subscribing to a subreddit
  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Uh oh...",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed!",
        description: `You are now subscribed to r/${subredditName}.`,
      });
    },
  });

  // Mutation for unsubscribing from a subreddit
  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Uh oh...",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Unsubscribed!",
        description: `You are now unsubscribed from r/${subredditName}.`,
      });
    },
  });

  // Render the appropriate button based on the subscription status and loading states
  return isSubscribed ? (
    isUnsubLoading ? (
      <Button className="w-full mt-1 mb-4" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Leave community
      </Button>
    ) : (
      <Button onClick={() => unsubscribe()} className="w-full mt-1 mb-4">
        Leave community
      </Button>
    )
  ) : isSubLoading ? (
    <Button className="w-full mt-1 mb-4" disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Join to post
    </Button>
  ) : (
    <Button onClick={() => subscribe()} className="w-full mt-1 mb-4">
      Join to post
    </Button>
  );
}

export default SubscribeLeaveToggle;
