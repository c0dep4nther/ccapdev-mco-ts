import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

async function JoinedSubreddits() {
  // Get the current user's auth session
  const session = await getAuthSession();

  const userSubscriptions = await db.subscription.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      subreddit: true,
    },
    orderBy: {
        subreddit: {
            name: "asc",
        }
    }
  });

  return (
    <>
      <ul>
        {userSubscriptions.map((subscription) => (
          <a key={subscription.subreddit.id} href={`/r/${subscription.subreddit.name}`}>
            <li className="px-2 hover:bg-slate-200 hover:rounded-md py-1 font-semibold">
              r/{subscription.subreddit.name}
            </li>
          </a>
        ))}
      </ul>
    </>
  );
}

export default JoinedSubreddits;
