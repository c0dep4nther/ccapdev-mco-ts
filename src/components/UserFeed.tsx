import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import React from "react";
import PostFeed from "./PostFeed";
import { PenLineIcon, MessageSquareIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"

type Props = {
  username: string | null | undefined;
};

async function UserFeed({ username }: Props) {
  const user = await db.user.findFirst({
    where: {
      username: username,
    },
  });

  const posts = await db.post.findMany({
    where: {
      authorId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  return (
    <>
      <Tabs defaultValue="posts" className="col-span-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">
            <PenLineIcon className="w-4 h-4 mr-2"/>
            Posts
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquareIcon className="w-4 h-4 mr-2"/>
            Comments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <PostFeed initialPosts={posts} authorId={user?.id} />
        </TabsContent>
        
        <TabsContent value="comments">

        </TabsContent>
      </Tabs>
    </>
  )
}

export default UserFeed;
