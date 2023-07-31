"use client";

import { DisplayNameRequest, DisplayNameValidator } from "@/lib/validators/displayname";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import React from "react";
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
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
  user: Pick<User, "id" | "name">;
};

function DisplayNameForm({ user }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<DisplayNameRequest>({
    resolver: zodResolver(DisplayNameValidator),
    defaultValues: {
      name: user.name || "",
    },
  });
  const router = useRouter();

  const { mutate: updateDisplayName, isLoading } = useMutation({
    mutationFn: async ({ name }: DisplayNameRequest) => {
      const payload: DisplayNameRequest = {
        name,
      };

      const { data } = await axios.patch("/api/user/displayname", payload);
      return data;
    },
    onError: (err) => {
      // Generic error message
      return toast({
        title: "Something went wrong.",
        description: "Could not change display name.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your display name was successfully changed.",
      });

      router.refresh();
    },
  });

  return (
    <form onSubmit={handleSubmit((e) => updateDisplayName(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Your display name</CardTitle>
          <CardDescription>
            Please enter a display name for your account. You can change this at
            any time.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative grid gap-1">

            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px]"
              size={32}
              {...register("name")}
            />

            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Change display name
            </Button>
          ) : (
            <Button>Change display name</Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}

export default DisplayNameForm;