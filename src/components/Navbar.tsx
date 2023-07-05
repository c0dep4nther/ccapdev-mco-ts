import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import React from "react";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";

async function Navbar() {
  const session = await getAuthSession();

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo here */}
        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="w-10 h-10 sm:h-8 sm:w-8" />
          <p className="hidden text-zinc-700 text-sm font-medium m:block">
            reddit clone
          </p>
        </Link>

        {/* search bar */}

        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
