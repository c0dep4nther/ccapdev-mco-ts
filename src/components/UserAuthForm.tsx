"use client";

import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import * as React from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/Button";
import { useToast } from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  const googleLogin = async () => {
    setIsLoading(true);

    try {
      throw new Error(); // remove this line once you've implemented the google login
      await signIn("google");
    } catch (error) {
      //   toast notification
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
      <Button
        type="button"
        size="sm"
        className="w-full"
        onClick={googleLogin}
        disabled={isLoading}
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Google
      </Button>
    </div>
  );
}

export default UserAuthForm;
