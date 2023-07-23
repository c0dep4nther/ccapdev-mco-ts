"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { buttonVariants } from "./ui/Button";
import { ChevronLeft } from "lucide-react";

function ToFeedButton() {
  const pathname = usePathname();

  // if path is /r/mycom, turn into /
  // if path is /r/mycom/post/[postId], turn into /r/mycom

  const getSubredditPath = (pathname: string) => {
    const splitPath = pathname.split("/");
    if (splitPath.length === 3) {
      return "/";
    } else if (splitPath.length > 3) {
      return `/${splitPath[1]}/${splitPath[2]}`;
    } else {
      // default path, in case pathname does not match expected format
      return "/";
    }
  };
  const subredditPath = getSubredditPath(pathname);

  return (
    <a href={subredditPath} className={buttonVariants({ variant: "ghost" })}>
      <ChevronLeft className="h-4 w-4 mr-1" />
      {subredditPath === "/" ? "Back home" : "Back to community"}
    </a>
  );
}

export default ToFeedButton;
