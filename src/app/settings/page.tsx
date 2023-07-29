import UserNameForm from "@/components/UserNameForm";
import UserAboutForm from "@/components/UserAboutForm";

import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Settings",
  description: "Manage your account",
};

async function page() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/sign-in");
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>

        <div className="grid gap-10">
          <UserNameForm
            user={{
              id: session.user.id,
              username: session.user.username || "",
            }}
          />
        </div>

        <div className="grid gap-8">
          <UserAboutForm
            user={{
              id: session.user.id,
              about: session.user.about || "",
            }}/>
        </div>
      </div>
    </div>
  );
}

export default page;
