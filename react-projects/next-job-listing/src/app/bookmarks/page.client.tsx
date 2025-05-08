"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import JobCard from "@/components/JobCard";
import LoadingJobCard from "@/components/LoadingJobCard";
import { BsBookmarkFill } from "react-icons/bs";
import { Job } from "@/lib/type";
import { getBookmarks } from "@/utils/bookmarkApi";

export default function BookmarksClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isAuthenticated = status === "authenticated";
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [bookmarkedJobs, setBookmarkedJobs] = useState<Job[]>([]);

    // Get the access token from the session
    const accessToken =
        session?.user?.accessToken || session?.user?.data?.accessToken;
    // Redirect unauthenticated users
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    // Fetch bookmarks when authenticated
    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!isAuthenticated || !accessToken) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const bookmarks = await getBookmarks(accessToken);

                if (Array.isArray(bookmarks) && bookmarks.length > 0) {
                    const jobDetailsPromises = bookmarks.map(
                        async (bookmark: any) => {
                            if (bookmark && bookmark.eventID) {
                                try {
                                    const res = await fetch(
                                        `https://akil-backend.onrender.com/opportunities/${bookmark.eventID}`,
                                        {
                                            headers: {
                                                Authorization: `Bearer ${accessToken}`,
                                                "Content-Type":
                                                    "application/json",
                                            },
                                        }
                                    );
                                    if (!res.ok) {
                                        return null; // Skip this job if details can't be fetched
                                    }
                                    const opportunityData = await res.json();
                                    const opportunity = opportunityData.data;

                                    if (opportunity) {
                                        return {
                                            id:
                                                opportunity.id ||
                                                bookmark.eventID, // Fallback to eventID if opportunity.id is missing
                                            title:
                                                opportunity.title ||
                                                "Untitled Job",
                                            description:
                                                opportunity.description ||
                                                "No description available",
                                            responsibilities:
                                                typeof opportunity.responsibilities ===
                                                "string"
                                                    ? opportunity.responsibilities.split(
                                                          "\\n"
                                                      )
                                                    : Array.isArray(
                                                          opportunity.responsibilities
                                                      )
                                                    ? opportunity.responsibilities
                                                    : [],
                                            ideal_candidate: {
                                                age:
                                                    opportunity.idealCandidate
                                                        ?.age || "", // Assuming idealCandidate might be an object
                                                gender:
                                                    opportunity.idealCandidate
                                                        ?.gender || "",
                                                traits:
                                                    typeof opportunity.idealCandidate ===
                                                    "string"
                                                        ? opportunity.idealCandidate.split(
                                                              "\\n"
                                                          )
                                                        : Array.isArray(
                                                              opportunity
                                                                  .idealCandidate
                                                                  ?.traits
                                                          )
                                                        ? opportunity
                                                              .idealCandidate
                                                              .traits
                                                        : [],
                                            },
                                            when_where:
                                                opportunity.whenAndWhere || "",
                                            about: {
                                                posted_on:
                                                    opportunity.datePosted ||
                                                    bookmark.datePosted ||
                                                    "",
                                                deadline:
                                                    opportunity.deadline || "",
                                                location:
                                                    Array.isArray(
                                                        opportunity.location
                                                    ) &&
                                                    opportunity.location
                                                        .length > 0
                                                        ? opportunity.location.join(
                                                              ", "
                                                          ) // Join if it's an array
                                                        : typeof opportunity.location ===
                                                          "string"
                                                        ? opportunity.location
                                                        : bookmark.location ||
                                                          "",
                                                start_date:
                                                    opportunity.startDate || "",
                                                end_date:
                                                    opportunity.endDate || "",
                                                categories:
                                                    opportunity.categories ||
                                                    [],
                                                required_skills:
                                                    opportunity.requiredSkills ||
                                                    [],
                                            },
                                            company:
                                                opportunity.orgName ||
                                                bookmark.orgName ||
                                                "",
                                            image:
                                                opportunity.logoUrl ||
                                                bookmark.logoUrl ||
                                                "/job1.png",
                                            isBookmarked: true,
                                        };
                                    }
                                } catch (err) {
                                    return null; // Skip on error
                                }
                            }
                            return null;
                        }
                    );

                    const resolvedJobsDetails = await Promise.all(
                        jobDetailsPromises
                    );
                    const validJobs = resolvedJobsDetails.filter(
                        (job) => job !== null
                    ) as Job[];

                    const uniqueJobsMap = new Map<string, Job>();
                    validJobs.forEach((job) => {
                        if (job && typeof job.id === "string") {
                            if (!uniqueJobsMap.has(job.id)) {
                                uniqueJobsMap.set(job.id, job);
                            }
                        } else if (job && typeof job.id === "number") {
                            const stringId = job.id.toString();
                            if (!uniqueJobsMap.has(stringId)) {
                                uniqueJobsMap.set(stringId, job);
                            }
                        }
                    });
                    const deDuplicatedJobs = Array.from(uniqueJobsMap.values());

                    setBookmarkedJobs(deDuplicatedJobs);
                    setIsError(false);
                } else {
                    setBookmarkedJobs([]);
                    setIsError(false);
                }
            } catch (error) {
                console.error("Error fetching bookmarks:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookmarks();
    }, [isAuthenticated, accessToken]);

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
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <h1 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <BsBookmarkFill className="text-blue-600" />
                    My Bookmarks
                </h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <p className="font-semibold">
                        Error loading bookmarks. This might be due to an
                        authentication issue.
                    </p>
                    <p className="mt-2">
                        Please try logging out and logging back in, then refresh
                        this page.
                    </p>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Refresh Page
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Back to Jobs
                        </button>
                    </div>
                </div>
            </div>
        );
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
