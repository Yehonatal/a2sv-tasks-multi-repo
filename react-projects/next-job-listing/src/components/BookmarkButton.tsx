"use client";

import { useState, useEffect } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { signIn, useSession } from "next-auth/react";
import { BookmarkCrud } from "@/utils/bookmarkApi"; // Removed getBookmarks
import { useGetBookmarksQuery } from "@/redux/services/opportunitiesApi"; // Added Redux hook

interface BookmarkButtonProps {
    jobId: string | number;
    isBookmarked?: boolean;
    className?: string;
    size?: number;
}

const BookmarkButton = ({
    jobId,
    isBookmarked: initialIsBookmarked = false,
    className = "",
    size = 20,
}: BookmarkButtonProps) => {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const [currentIsBookmarked, setCurrentIsBookmarked] = useState(initialIsBookmarked);
    const [isLoading, setIsLoading] = useState(false);

    // Get the access token from the session
    const accessToken =
        session?.user?.accessToken || session?.user?.data?.accessToken;

    // Get global bookmarks data from Redux store
    const { data: bookmarksData, isLoading: isLoadingBookmarks } = useGetBookmarksQuery(undefined, {
        skip: !isAuthenticated, // Skip query if not authenticated
    });

    useEffect(() => {
        if (isAuthenticated && bookmarksData) {
            const isJobInGlobalBookmarks = bookmarksData.data.some(
                (bookmark: any) => bookmark.eventID === jobId.toString()
            );
            setCurrentIsBookmarked(isJobInGlobalBookmarks);
        } else if (!isAuthenticated) {
            setCurrentIsBookmarked(false); // Not bookmarked if not logged in
        }
        // If !bookmarksData but initialIsBookmarked is true (from SSR or parent), trust it initially.
        // The above will correct it once bookmarksData loads.
    }, [isAuthenticated, bookmarksData, jobId, initialIsBookmarked]);

    // Synchronize with initialIsBookmarked prop if it changes from parent
    useEffect(() => {
        setCurrentIsBookmarked(initialIsBookmarked);
    }, [initialIsBookmarked]);

    // Handle bookmark toggle
    const handleToggleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            // Show login prompt or modal
            const confirmLogin = window.confirm(
                "You need to be logged in to bookmark jobs. Would you like to log in?"
            );
            if (confirmLogin) {
                signIn("credentials", {
                    callbackUrl: window.location.href,
                });
            }
            return;
        }

        if (!accessToken) {
            return;
        }

        setIsLoading(true);
        try {
            // Toggle bookmark state immediately for better UX
            const newState = !currentIsBookmarked;
            setCurrentIsBookmarked(newState);

            // Call the bookmark utility function
            const success = await BookmarkCrud(
                jobId.toString(),
                accessToken,
                currentIsBookmarked // Pass the state *before* toggle
            );

            if (!success) {
                // If the operation failed, revert the UI state
                setCurrentIsBookmarked(!newState);
            }
        } catch (error) {
            // Revert to previous state if there was an error
            setCurrentIsBookmarked(!currentIsBookmarked);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleBookmark}
            disabled={isLoading}
            className={`transition-colors duration-200 ${className}`}
            aria-label={
                currentIsBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
            }
        >
            {currentIsBookmarked ? (
                <BsBookmarkFill size={size} className="text-blue-600" />
            ) : (
                <BsBookmark
                    size={size}
                    className="text-gray-500 hover:text-blue-600"
                />
            )}
        </button>
    );
};

export default BookmarkButton;
