import { db } from "@/lib/db";

async function TopSubreddits() {
  
  const topSubreddits = await db.subreddit.findMany({
    take: 5,
    orderBy: {
      subscribers: {
        _count: 'desc'
      }
    },
  });

  let index: number = 1;

  return (
    <>
      <ul>
        {topSubreddits.map(subreddit => (
          <a key={subreddit.id} href={`/r/${subreddit.name}`}>
            <li className="px-2 hover:bg-slate-200 hover:rounded-md py-1 font-semibold">
              <span className="mr-5">{index++}</span>
              r/{subreddit.name}
            </li>
          </a>
        ))}
      </ul>
    </>
  );
};

export default TopSubreddits;