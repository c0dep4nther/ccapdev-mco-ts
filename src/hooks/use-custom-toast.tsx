import Link from "next/link";
import { toast } from "./use-toast";
import { buttonVariants } from "@/components/ui/Button";

/**
 * useCustomToast is a custom hook that provides a loginToast function.
 * The loginToast function displays a toast notification with a message indicating that login is required.
 * It also includes an action button that redirects the user to the sign-in page when clicked.
 *
 * @returns An object containing the loginToast function.
 */
export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required.",
      description: "You must be logged in to do that.",
      variant: "destructive",
      action: (
        <Link
          href="/sign-in"
          onClick={() => dismiss()}
          className={buttonVariants({ variant: "ghost" })}
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
};
