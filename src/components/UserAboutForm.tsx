"use client";

import { User } from "@prisma/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";

import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
  user: Pick<User, "id" | "about">;
};

function UserAboutForm({ user } : Props) {
  const {
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      about: user.about || "",
    }
  });

  const [input, setInput] = useState<string>("");
  const router = useRouter();
  
  const { mutate: updateAbout, isLoading } = useMutation({
    onError: (err) => {
      // Error handling for different error scenarios (about string above length limit)
      // TODO
      

      // Generic error message
      return toast({
        title: "Something went wrong.",
        description: "Could not change about.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your changes were successfully saved.",
      });

      router.refresh();
    },
  });
  
  return (
    // TODO: <form onSubmit={handleSubmit((e) => updateAbout(e))}>
      <Card>
        <CardHeader>
          <CardTitle>About You (Optional)</CardTitle>
          <CardDescription>
            Please enter a brief description of yourself shown on your profile. You can change this at
            any time.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
            </div>

            <Label className="sr-only" htmlFor="about">
              About You
            </Label>
            <div className="mt-2">
              <Textarea
                id="about"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="About You (Optional)"
              />
              <span className="text-sm text-zinc-400 ">Maximum of 200 characters only</span>
            </div>
            
            {errors?.about && (
              <p className="px-1 text-xs text-red-600">{}</p>
            )}
          </div>
        </CardContent>
          
        <CardFooter>
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Save changes
            </Button>
          ) : (
              <Button>Save changes</Button>
          )}
        </CardFooter>
      </Card>
    //</form>
  );
}

export default UserAboutForm;
