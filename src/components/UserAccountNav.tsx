"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";

type Props = {
  user: Pick<User, "name" | "email" | "image">;
  username: string;
  about: string;
};

/**
 * UserAccountNav component displays a dropdown menu for user account navigation.
 * It includes options such as user profile, feed, creating a community, settings, and sign out.
 *
 * @param user - User object containing name, email, and image details.
 */
function UserAccountNav({ user, username, about }: Props) {
  return (
    <DropdownMenu>
      {/* DropdownMenuTrigger renders the user avatar as the trigger */}
      <DropdownMenuTrigger>
        <UserAvatar
          className="h-8 w-8"
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenuTrigger>

      {/* DropdownMenuContent contains the menu items */}
      <DropdownMenuContent className="bg-white" align="end">
        {/* User information section */}
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {/* Display user's name if available */}
            {user.name && <p className="font-medium">{user.name}</p>}
            {/* Display user's email if available */}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>

        {/* Menu items */}
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={{
              pathname:`/u/${username}`,
              query: {
                username: username,
                name: user.name,
                about: about,
              },
            }}
            as={`/u/${username}`}
          >
            User Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/r/create">Create Community</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign out option */}
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`,
            });
          }}
          className="cursor-pointer"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserAccountNav;
