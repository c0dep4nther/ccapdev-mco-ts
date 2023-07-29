import { redirect } from "next/navigation";
import React from 'react'
import Link from "next/link";

import { User } from "next-auth";
import UserFeed from "@/components/UserFeed";
import UserAvatar from "@/components/UserAvatar";
import { buttonVariants } from "@/components/ui/Button";
import { authOptions, getAuthSession } from "@/lib/auth";

export const metadata = {
    title: "User Profile",
    description: "Your Profile",
};

type Props = {
    user: Pick<User, "name" | "email" | "image">;
  };

async function page({ user }: Props) {
    const session = await getAuthSession();

      return (
      <div>
        <h1 className="font-bold text-3xl md:text-4xl">Your profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            {/* feed */}
            {<UserFeed />}

            {/* Profile bar */}
            <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="bg-sky-300 px-6 py-4">
                {/* TODO: }
                <UserAvatar 
                    className="h-8 w-8"
                    user={{
                        image: user.image || null,
                    }}
                /> */}
                <p className="font-semibold py-3 text-center items-center gap-1.5">place dp here</p>
            </div>

            <dl className="-my-3 divide-y divide-gray-300 px-6 py-4 text-sm leading-6">
                <div className="justify-between gap-x-4 py-3">
                    <p className="font-semibold text-2xl text-center items-center gap-0.5">
                        {session?.user.name}
                    </p>
                    <p className="font-semibold text-lg text-center items-center gap-1.5">
                        u/{session?.user.username}
                    </p>
                </div>
                <div className="justify-between gap-x-4 py-3">
                    <p className="text-zinc-500 text-center items-center">
                        {/*TODO: {session?.user.about}*/}
                    </p>
                </div>

                <Link
                    className={buttonVariants({className: "w-full mb-6",})} href={`/settings`} > Edit Profile
                </Link>
                
            </dl>
            </div>
        </div>
      </div>
      );
}

export default page