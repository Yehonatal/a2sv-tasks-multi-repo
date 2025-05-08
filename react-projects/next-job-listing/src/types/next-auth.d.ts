import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            accessToken?: string;
            data?: {
                accessToken?: string;
            };
        };
    }

    interface User {
        accessToken?: string;
        data?: {
            accessToken?: string;
        };
    }
}
