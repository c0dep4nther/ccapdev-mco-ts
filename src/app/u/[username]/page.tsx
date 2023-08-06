import React from "react";
import Link from "next/link";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import UserFeed from "@/components/UserFeed";
import UserAvatar from "@/components/UserAvatar";
import ScrollToTop from "@/components/ScrolltoTop";
import { buttonVariants } from "@/components/ui/Button";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { User } from "@prisma/client";
import { notFound } from "next/navigation";

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
  const session = await getAuthSession();

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

  if (!user) {
    return notFound();
  }

  return (
    <div>
      <h1 className="font-bold text-3xl md:text-4xl">u/{username}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* feed */}
        <UserFeed username={user?.username} />

        <div>
          {/* Profile bar */}
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="bg-sky-300 px-6 py-4 flex justify-center items-center">
              <UserAvatar 
                className="h-24 w-24 justify-center items-center"
                user={{
                  image: user.image || null,
                }}
              />
            </div>

            <dl className="-my-3 divide-y divide-gray-300 px-6 py-4 text-sm leading-6">
              <div className="justify-between gap-x-4 py-3">
                <p className="font-semibold text-2xl text-center items-center gap-0.5">
                  {user.name}
                </p>
                <p className="font-semibold text-lg text-center items-center gap-1.5">
                  u/{username}
                </p>
              </div>
              <div className="justify-between gap-x-4 py-3">
                <p className="text-zinc-500 text-center items-center">
                  {user.about}
                </p>
              </div>

              {session?.user.username == user.username ? 
                <Link
                  className={buttonVariants({ className: "w-full mb-6" })}
                  href={`/settings`}
                >
                  {" "}
                  Edit Profile
                </Link> : null }
            </dl>
          </div>
          <ScrollToTop />
        </div>
      </div>
    </div>
  );
}

export default page;