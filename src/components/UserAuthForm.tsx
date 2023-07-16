"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Icons } from "./Icons";
import { toast } from "@/hooks/use-toast";

type Props = {} & React.HTMLAttributes<HTMLDivElement>;

/**
 * UserAuthForm component displays a form for user authentication.
 * It provides a button to log in with Google.
 *
 * @param className - Additional CSS class names for styling.
 * @param props - Additional HTML attributes to be spread to the root element.
 */
function UserAuthForm({ className, ...props }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Handles Google login functionality.
   * Triggers the sign-in process with Google authentication provider.
   * Displays a loading state while the login process is in progress.
   * Displays a toast notification if an error occurs during login.
   */
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
