import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simulated auth: any email with password "password" works
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        // Accept any email with password "password"
        if (password === "password") {
          return {
            id: "demo-user",
            name: email.split("@")[0],
            email: email,
            image: null,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        /^\/(en|es)\/(profile|bets)/.test(nextUrl.pathname) ||
        nextUrl.pathname.startsWith("/profile") ||
        nextUrl.pathname.startsWith("/bets");

      if (isProtected && !isLoggedIn) {
        return false; // Redirect to sign-in
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
