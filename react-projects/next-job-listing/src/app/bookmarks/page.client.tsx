"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGetBookmarksQuery } from "@/redux/services/opportunitiesApi";
import JobCard from "@/components/JobCard";
import LoadingJobCard from "@/components/LoadingJobCard";
import { BsBookmarkFill } from "react-icons/bs";
import { Job } from "@/lib/type";

export default function BookmarksClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isAuthenticated = status === "authenticated";

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (status === "authenticated") {
            console.log("User is authenticated in bookmarks page:", session);
        }
    }, [status, router, session]);

    // Fetch bookmarks
    const {
        data: bookmarksData,
        isLoading,
        isError,
        error,
    } = useGetBookmarksQuery(undefined, {
        skip: !isAuthenticated,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <h1 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <BsBookmarkFill className="text-blue-600" />
                    My Bookmarks
                </h1>
                <div>
                    {[...Array(3)].map((_, index) => (
                        <LoadingJobCard key={index} />
                    ))}
                </div>
            </div>
        );
    }

    // Handle error state
    if (isError) {
        console.error("Error loading bookmarks:", error);

        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <h1 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <BsBookmarkFill className="text-blue-600" />
                    My Bookmarks
                </h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <p className="font-semibold">
                        Error loading bookmarks. Please try again later.
                    </p>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => router.push("/")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Back to Jobs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Map API bookmarks to Job objects with error handling
    const bookmarkedJobs: Job[] = [];

    try {
        // Check if bookmarksData exists and has data property
        if (bookmarksData?.data && Array.isArray(bookmarksData.data)) {
            // Map each bookmark to a Job object
            bookmarksData.data.forEach((bookmark: any) => {
                // Check if bookmark has opportunity property
                if (bookmark && bookmark.opportunity) {
                    const opportunity = bookmark.opportunity;

                    bookmarkedJobs.push({
                        id: opportunity.id || "unknown",
                        title: opportunity.title || "Untitled Job",
                        description:
                            opportunity.description ||
                            "No description available",
                        responsibilities:
                            typeof opportunity.responsibilities === "string"
                                ? opportunity.responsibilities.split("\n")
                                : [],
                        ideal_candidate: {
                            age: "",
                            gender: "",
                            traits:
                                typeof opportunity.idealCandidate === "string"
                                    ? opportunity.idealCandidate.split("\n")
                                    : [],
                        },
                        when_where: opportunity.whenAndWhere || "",
                        about: {
                            posted_on: opportunity.datePosted || "",
                            deadline: opportunity.deadline || "",
                            location:
                                Array.isArray(opportunity.location) &&
                                opportunity.location.length > 0
                                    ? opportunity.location[0]
                                    : "",
                            start_date: opportunity.startDate || "",
                            end_date: opportunity.endDate || "",
                            categories: opportunity.categories || [],
                            required_skills: opportunity.requiredSkills || [],
                        },
                        company: opportunity.orgName || "",
                        image: opportunity.logoUrl || "/job1.png",
                    });
                }
            });
        }
    } catch (err) {
        console.error("Error processing bookmarks data:", err);
        // If there's an error processing the data, we'll return an empty array
        // which will trigger the empty state UI
    }

    // Handle empty state
    if (bookmarkedJobs.length === 0) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <h1 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <BsBookmarkFill className="text-blue-600" />
                    My Bookmarks
                </h1>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <BsBookmarkFill className="mx-auto text-gray-400 w-12 h-12 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        No bookmarks yet
                    </h2>
                    <p className="text-gray-500 mb-4">
                        You haven't bookmarked any jobs yet. Browse jobs and
                        click the bookmark icon to save them for later.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Browse Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <BsBookmarkFill className="text-blue-600" />
                My Bookmarks
            </h1>
            <div className="space-y-4 sm:space-y-6">
                {bookmarkedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
}
