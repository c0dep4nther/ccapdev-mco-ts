"use client";

import { User } from "@prisma/client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "./ui/Card";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  user: Pick<User, "id" | "image">;
};

function ProfilePictureEditor({ user }: Props) {

const router = useRouter();

const { mutate } = useMutation(
    async (image: Props) => await axios.put("/api/user/profile", image),
    {
      onError: (err) => {
        // Generic error message
        toast({
            title: "Something went wrong.",
            description: "Could not change profile picture.",
            variant: "destructive",
          });
      },
      onSuccess: () => {
        toast({
            description: "Your profile picture was successfully changed.",
        });

        router.refresh();
      },
    }
  );
const onSubmit = async (image: Props) => {
    mutate(image);
};

return (
    <>
        <Card>
        <CardHeader>
          <CardTitle>Your picture</CardTitle>
          <CardDescription>
            Click the button below to change your profile picture. You can change this at any time.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-1">
            <div className="">
                <Image
                alt="..."
                src={user.image as string}
                className="shadow-xl rounded-full h-auto align-middle border ml-3 max-w-150-px"
                width={100}
                height={100}
                priority
                />
            </div>
          </div>
        </CardContent>
          
        <CardFooter>
            <Button
            >
                Change Photo
            </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default ProfilePictureEditor;