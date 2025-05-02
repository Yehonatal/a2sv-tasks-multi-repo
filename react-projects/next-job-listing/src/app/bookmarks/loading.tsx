"use client";

import LoadingJobCard from "@/components/LoadingJobCard";
import { BsBookmarkFill } from "react-icons/bs";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <BsBookmarkFill className="text-blue-600" />
                My Bookmarks
            </h1>
            <div className="space-y-4 sm:space-y-6">
                {[...Array(3)].map((_, index) => (
                    <LoadingJobCard key={index} />
                ))}
            </div>
        </div>
    );
}
