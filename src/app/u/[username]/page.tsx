import { User } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import React from 'react'
import Link from "next/link";

import UserFeed from "@/components/UserFeed";
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

    

    const posts = await db.post.findMany({
        where: {}

    });
    
      return (
      <div>
        <h1 className="font-bold text-3xl md:text-4xl">Your profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            {/* feed */}
            {<UserFeed />}

            {/* Profile bar */}
            {/*}
            <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="bg-emerald-100 px-6 py-4">
                <p className="font-semibold py-3 flex items-center gap-1.5">
                <HomeIcon className="w-4 h-4" />
                Home
                </p>
            </div>

            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                    Your personal Film Fusion homepage. Come here to check in with
                    your favorite communities.
      ``````````</p>
                </div>
            </dl>
            </div> */}
        </div>
      </div>
      );
}

export default page