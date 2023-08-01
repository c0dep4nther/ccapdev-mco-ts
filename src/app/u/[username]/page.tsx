import React from 'react'
import Link from "next/link";

import { db } from "@/lib/db";
import UserFeed from "@/components/UserFeed";
import UserAvatar from "@/components/UserAvatar";
import { buttonVariants } from "@/components/ui/Button";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { User } from "@prisma/client";

export const metadata = {
    title: "User Profile",
    description: "Your Profile",
};

type Props = {
  params: {
    username: string;
  };
};

async function page({ params }: Props) {
  
  const { username } = params;  

  // Calls posts from the database
    const user = await db.user.findFirst({
        where: {
          username: username,
        },
        include: {
          Post: {
            include: {
              author: true,
              votes: true,
              comments: true,
              subreddit: true,
            },
            orderBy: {
              createdAt: "desc",
            }, // added to prevent duplicate posts
    
            take: INFINITE_SCROLLING_PAGINATION_RESULTS,
          },
        },
      });
      
      return (
      <div>
        <h1 className="font-bold text-3xl md:text-4xl">u/{username}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            {/* feed */}
            <UserFeed /> {/*TODO: PLACE USER_NAME PARAMS HERE TO FILTER*/}

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
                        {username}
                    </p>
                    <p className="font-semibold text-lg text-center items-center gap-1.5">
                        u/{username}
                    </p>
                </div>
                <div className="justify-between gap-x-4 py-3">
                    <p className="text-zinc-500 text-center items-center">
                        {username}
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