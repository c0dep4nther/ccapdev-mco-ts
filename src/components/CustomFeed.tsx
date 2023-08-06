import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import React from "react";
import PostFeed from "./PostFeed";
import { getAuthSession } from "@/lib/auth";
import { SparklesIcon, UserCheckIcon, CalendarClockIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"

async function CustomFeed() {
  const session = await getAuthSession();

  // Get posts from popular posts (most votes)
  const posts_popular = await db.post.findMany({
    orderBy: {
      votes: {
        _count: 'desc'
      }
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  // Following Tab
  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      subreddit: true,
    },
  });

  // Get posts from followed communities
  const posts_following = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map(({ subreddit }) => subreddit.id),
        },
      },
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

  // Get latest posts from all communities
  const posts_latest = await db.post.findMany({
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
      <Tabs defaultValue="popular" className="col-span-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="popular">
            <SparklesIcon className="w-4 h-4 mr-2"/>
            Popular
          </TabsTrigger>
          <TabsTrigger value="following">
            <UserCheckIcon className="w-4 h-4 mr-2"/>
            Following
          </TabsTrigger>
          <TabsTrigger value="latest">
            <CalendarClockIcon className="w-4 h-4 mr-2"/>
            Latest
          </TabsTrigger>
        </TabsList>

        <TabsContent value="popular">
          <PostFeed initialPosts={posts_popular} />
        </TabsContent>

        <TabsContent value="following">
          <PostFeed initialPosts={posts_following} />
        </TabsContent>

        <TabsContent value="latest">
          <PostFeed initialPosts={posts_latest} />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default CustomFeed;
