"use client";

import { useState, useEffect } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { signIn, useSession } from "next-auth/react";
import {
    useCreateBookmarkMutation,
    useDeleteBookmarkMutation,
    useGetBookmarksQuery,
} from "@/redux/services/opportunitiesApi";

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
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

    // RTK Query hooks for bookmark operations
    const [createBookmark, { isLoading: isCreating }] =
        useCreateBookmarkMutation();
    const [deleteBookmark, { isLoading: isDeleting }] =
        useDeleteBookmarkMutation();
    const { data: bookmarksData, refetch } = useGetBookmarksQuery(undefined, {
        skip: !isAuthenticated,
        refetchOnMountOrArgChange: true,
    });

    // Check if job is bookmarked when bookmarks data changes
    useEffect(() => {
        if (bookmarksData?.data) {
            const isJobBookmarked = bookmarksData.data.some(
                (bookmark: any) => bookmark.opportunityId === jobId.toString()
            );
            setIsBookmarked(isJobBookmarked);
        }
    }, [bookmarksData, jobId]);

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
                    username: "user",
                    password: "password",
                    callbackUrl: window.location.href,
                });
            }
            return;
        }

        try {
            // Toggle bookmark state immediately for better UX
            const newState = !isBookmarked;
            setIsBookmarked(newState);

            // Call the appropriate API based on the new state
            if (!newState) {
                // If we're removing a bookmark
                await deleteBookmark(jobId.toString());
            } else {
                // If we're adding a bookmark
                await createBookmark(jobId.toString());
            }

            // Refetch bookmarks to update the bookmarks page if it's open
            refetch().catch((err) => {
                console.error("Error refetching bookmarks:", err);
            });
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            // Revert to previous state if there was an error
            setIsBookmarked(!isBookmarked);
        }
    };

    const isLoading = isCreating || isDeleting;

    return (
        <button
            onClick={handleToggleBookmark}
            disabled={isLoading}
            className={`transition-colors duration-200 ${className}`}
            aria-label={
                isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
            }
        >
            {isBookmarked ? (
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
