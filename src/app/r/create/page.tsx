"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Page() {
  const router = useRouter();
  const [input, setInput] = useState<string>("");

  return (
    <div>
      {" "}
      <div className="container flex items-center h-full max-w-3xl mx-auto">
        <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Create a Community</h1>
          </div>

          <hr className="bg-red-500 h-px" />

          <div>
            <p className="text-lg font-medium">Name</p>
            <p className="text-xs pb-2">
              Community names including capitalization cannot be changed.
            </p>
            <div className="relative">
              <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
                r/
              </p>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-6"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button disabled={input.length === 0}>Create Community</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
