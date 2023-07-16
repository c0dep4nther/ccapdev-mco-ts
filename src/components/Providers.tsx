"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Providers component wraps the application with the necessary providers.
 *
 * @param children - The child components to be wrapped.
 */
const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
