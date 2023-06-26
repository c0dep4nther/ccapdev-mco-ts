"use client";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "./ui/Button";
import { Icons } from "./Icons";
import { Loader2 } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  const googleLogin = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (error) {
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
