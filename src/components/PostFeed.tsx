"use client";

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect } from "react";
import Post from "./Post";

type Props = {
  initialPosts: ExtendedPost[];
  subredditName?: string;
};

function PostFeed({ initialPosts, subredditName }: Props) {
  const lastPostRef = React.useRef<HTMLLIElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;
  
  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        // NOTE: For some reason, when initalPosts is generated using a <Link>
        // navigation, comment.post will be missing on all the initial posts.
        // As a workaround, we don't try to display anything when this occurs.
        //
        // This might be an issue related to Next.js serialization behavior.
        if (post.votes === undefined)
          return <Fragment key={post.id}></Fragment>;

        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") {
            return acc + 1;
          }

          if (vote.type === "DOWN") {
            return acc - 1;
          }

          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                currentVote={currentVote}
                votesAmt={votesAmt}
                commentAmt={post.comments.length}
                post={post}
                subredditName={post.subreddit.name}
              />
            </li>
          );
        } else {
          return (
            <Post
              key={post.id}
              currentVote={currentVote}
              votesAmt={votesAmt}
              commentAmt={post.comments.length}
              post={post}
              subredditName={post.subreddit.name}
            />
          );
        }
      })}
    </ul>
  );
}

export default PostFeed;

// import React from "react";
// import Post from "./Post";

// interface PostFeedProps {
//   subredditName: string;
// }

// function PostFeed() {
//   return (
//     <ul className="flex flex-col col-span-2 space-y-6">
//       <Post
//         id="1"
//         author="itsmadeline"
//         title="The Blind Side"
//         content="OMG, 'The Blind Side' is seriously amazing! It's a heartwarming film that made me laugh, cry, and cheer all at once. Sandra Bullock is a total boss as Leigh Anne Tuohy, the strong and caring mom who changes Michael Oher's life. The movie tackles important issues like racism and privilege, while also showing the power of kindness and teamwork. It's inspiring and emotional, and you definitely need to watch it ASAP!
//         "
//         commentAmt={1}
//         subredditName="horror"
//         votesAmt={1}
//       />
//       <Post
//         id="2"
//         author="cooldude25"
//         title="The notebook "
//         content="Alright, guys, I recently watched 'The Notebook,' and let me tell you, it's not just a sappy romance flick. This movie surprised me with its deep and touching story. Ryan Gosling and Rachel McAdams deliver incredible performances as Noah and Allie, two lovers from different backgrounds. The film takes you on an emotional rollercoaster as their love is tested through time and circumstances.
//         "
//         commentAmt={1}
//         subredditName="comedy"
//         votesAmt={2}
//       />
//       <Post
//         id="3"
//         author="crushthesurfer"
//         title="The Avengers"
//         content="Duuude, 'The Avengers' is totally gnarly! It's like an epic ocean current that pulls you in and doesn't let go. This flick brings together Earth's mightiest heroes, and let me tell you, the action is off the charts! The Avengers assemble to battle against the baddest villains, and the fight scenes are mind-blowing."
//         commentAmt={1}
//         subredditName="drama"
//         votesAmt={3}
//       />
//       <Post
//         id="4"
//         author="CriticalEye42"
//         title="Transformers: Age of Extinction"
//         content="'Transformers: Age of Extinction' disappoints with a convoluted plot, shallow characters, and excessive CGI spectacle. The performances feel uninspired, and the humor falls flat. The relentless action becomes tiresome, overshadowing any coherent storytelling. It lacks the charm and excitement of its predecessors, leaving audiences wanting more."
//         commentAmt={1}
//         subredditName="random"
//         votesAmt={4}
//       />
//       <Post
//         id="5"
//         author="moviefan420"
//         title="Morbius"
//         content="Amazing, 'Morbius' is truly one of the movies of all time. I had one of the moments of all time too when I looked at the movie."
//         commentAmt={1}
//         subredditName="eccentric"
//         votesAmt={5}
//       />
//     </ul>
//   );
// }

// export default PostFeed;
