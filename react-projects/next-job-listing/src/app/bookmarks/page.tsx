import { Metadata } from "next";
import BookmarksClient from "./page.client";

export const metadata: Metadata = {
    title: "My Bookmarks | Job Listings",
    description: "View your bookmarked job opportunities",
};

export default function BookmarksPage() {
    return <BookmarksClient />;
}
