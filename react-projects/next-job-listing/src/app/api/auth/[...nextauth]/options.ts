import NextAuth, { NextAuthOptions, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        // Akil Login Provider
        CredentialsProvider({
            id: "akillogin",
            name: "Akil Login",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "email@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required.");
                }
                try {
                    const res = await fetch(
                        "https://akil-backend.onrender.com/login",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                            }),
                        }
                    );

                    const user = await res.json();

                    if (!res.ok) {
                        throw new Error(
                            user?.message ||
                                "Failed to login. Please check your credentials."
                        );
                    }

                    if (user && user.data) {
                        // Ensure user and user.data exist
                        return {
                            id: user.data._id,
                            ...user.data,
                            role: user.data.role || "user",
                        };
                    } else {
                        return null;
                    }
                } catch (error: any) {
                    throw new Error(
                        error.message || "Login failed. Please try again."
                    );
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User | any }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.role = user.role || "user";

                if (user.accessToken) {
                    token.apiAccessToken = user.accessToken;
                } else if (user.data?.accessToken) {
                    token.apiAccessToken = user.data.accessToken;
                } else {
                }
            }
            return token;
        },
        async session({
            session,
            token,
        }: {
            session: Session | any;
            token: JWT | any;
        }) {
            if (!session.user) session.user = {};

            (session.user as any).id = token.id as string;
            (session.user as any).email = token.email as string;
            (session.user as any).name = token.name as string;
            (session.user as any).role = token.role as string;
            if (token.picture) {
                (session.user as any).image = token.picture as string;
            }

            if (token.apiAccessToken) {
                (session.user as any).accessToken =
                    token.apiAccessToken as string;
            } else {
            }

            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET, // Removed fallback, should be set in .env
};
