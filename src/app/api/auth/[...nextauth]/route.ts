import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// Create an instance of NextAuth with the provided authentication options
const handler = NextAuth(authOptions);

// Export the NextAuth instance as GET and POST handlers
export { handler as GET, handler as POST };
