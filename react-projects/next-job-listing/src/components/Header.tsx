"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { BsBookmarkFill } from "react-icons/bs";

export default function Header() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    const handleCredentialsLogin = () => {
        signIn("credentials", {
            callbackUrl: window.location.href,
        });
    };

    const handleLogout = () => {
        // Just sign out - NextAuth will handle the session cleanup
        signOut({ callbackUrl: "/" });
    };

    return (
        <header className="bg-white shadow-sm py-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold">
                        JOB
                    </Link>
                    {isAuthenticated && (
                        <Link
                            href="/bookmarks"
                            className="flex items-center gap-2 text-gray-600 "
                        >
                            <BsBookmarkFill className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                My Bookmarks
                            </span>
                        </Link>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {isAuthenticated && (
                        <div className="flex items-center gap-2">
                            {session?.user?.image && (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                            <span className="text-sm text-gray-600 hidden sm:inline">
                                {session?.user?.name || "User"}
                            </span>
                        </div>
                    )}
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCredentialsLogin}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Demo Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
