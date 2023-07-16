"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Icons } from "./Icons";
import { toast } from "@/hooks/use-toast";

type Props = {} & React.HTMLAttributes<HTMLDivElement>;

function UserAuthForm({ className, ...props }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const googleLogin = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (err) {
      // toast notification
      toast({
        title: "Uh oh...",
        description: "Something went wrong logging in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      {isLoading ? (
        <Button type="button" size="sm" className="w-full" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Logging In
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          className="w-full"
          onClick={googleLogin}
        >
          <Icons.google className="h-4 w-4 mr-2" />
          Google
        </Button>
      )}
    </div>
  );
}

export default UserAuthForm;
