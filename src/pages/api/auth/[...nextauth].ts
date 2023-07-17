import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import { loginUser } from "@/services/auth-service";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const user = await loginUser(credentials);
                if (user) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user /*account, profile, email, credentials */ }) {
            if (user) return true;
            return "/api/auth/login";
        },
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token }) {
            session.user = token;
            return session;
        },
    },
};

export default NextAuth(authOptions);