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
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import useAvatarStore from "@/app/store/avatarStore";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";


type Props = {
  user: Pick<User, "id" | "image">;
};

function ProfilePictureEditor({ user }: Props) {
    const isBrowser = typeof window !== "undefined";
    
    const { avatar, setAvatar } = useAvatarStore((state) => ({
        avatar: state.avatar,
        setAvatar: state.setAvatar,
    }));
    
    const cloudinaryWidget = isBrowser &&
    (window as any).cloudinary?.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "facebook", "instagram", "camera", "url"],
        multiple: false,
        cropping: true,
        showAdvancedOptions: false,
        croppingAspectRatio: 1,
        folder: "demo_uw_folder",
      },
      (error: unknown, result: any) => {
        if (!error && result && result.event === "success") {
          const image = result.info.secure_url;
          axios
            .put("/api/users/avatar", { image })
            .then(function (response) {
              console.log(response.data);
              setAvatar(response.data.image);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        if (error) console.log("widget error", error);
      }
    );

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
                src={avatar || (user.image as string)}
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
                id="upload_widget"
                onClick={() => cloudinaryWidget.open()}>
                Change Photo
            </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default ProfilePictureEditor;