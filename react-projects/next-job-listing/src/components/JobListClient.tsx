"use client";

import { useState, useMemo } from "react";
import JobCard from "./JobCard";
import JobSorting from "./JobSorting";
import LoadingJobCard from "./LoadingJobCard";
import { useGetAllOpportunitiesQueryWithRefetch } from "@/redux/services/opportunitiesApi";
import { MdRefresh } from "react-icons/md";
import { CgFileDocument } from "react-icons/cg";

export default function JobListClient() {
    const [sortOption, setSortOption] = useState<string>("newest");

    // Use RTK Query to fetch jobs with the refetch capability
    const {
        data: opportunitiesData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useGetAllOpportunitiesQueryWithRefetch();

    // Get jobs from the API response with proper type checking
    const jobs = useMemo(() => {
        if (!opportunitiesData) {
            console.log("No opportunities data received");
            return [];
        }

        console.log("Opportunities data received:", opportunitiesData);

        // The API returns data in a different format than expected
        // The actual data is in opportunitiesData.data
        const jobsData = opportunitiesData.data;

        if (!jobsData) {
            console.log("No data property in opportunities data");
            return [];
        }

        // Ensure we have a valid array of jobs
        if (!Array.isArray(jobsData)) {
            console.error(
                "Expected jobs data to be an array, but got:",
                typeof jobsData
            );
            return [];
        }

        // Map the API response to match our Job type
        return jobsData.map((job) => ({
            id: job.id,
            title: job.title,
            description: job.description,
            responsibilities:
                typeof job.responsibilities === "string"
                    ? job.responsibilities.split("\n")
                    : [],
            ideal_candidate: {
                age: "",
                gender: "",
                traits:
                    typeof job.idealCandidate === "string"
                        ? job.idealCandidate.split("\n")
                        : [],
            },
            when_where: job.whenAndWhere,
            about: {
                posted_on: job.datePosted,
                deadline: job.deadline,
                location:
                    Array.isArray(job.location) && job.location.length > 0
                        ? job.location[0]
                        : "",
                start_date: job.startDate,
                end_date: job.endDate,
                categories: job.categories || [],
                required_skills: job.requiredSkills || [],
            },
            company: job.orgName || "",
            image: job.logoUrl || "",
        }));
    }, [opportunitiesData]);

    // Memoize sorted jobs to improve performance
    const sortedJobs = useMemo(() => {
        if (!jobs.length) return [];

        const validJobs = jobs.filter((job) => {
            return Boolean(
                job &&
                    (job.about?.posted_on || job.about?.deadline) &&
                    job.title
            );
        });

        // Create a copy of the valid jobs to sort
        const list = [...validJobs];

        // Sort based on the selected option
        return list.sort((a, b) => {
            try {
                switch (sortOption) {
                    case "newest":
                        const dateA = new Date(a.about?.posted_on || 0);
                        const dateB = new Date(b.about?.posted_on || 0);
                        return dateB.getTime() - dateA.getTime();
                    case "oldest":
                        const dateC = new Date(a.about?.posted_on || 0);
                        const dateD = new Date(b.about?.posted_on || 0);
                        return dateC.getTime() - dateD.getTime();
                    case "a-z":
                        return (a.title || "").localeCompare(b.title || "");
                    case "z-a":
                        return (b.title || "").localeCompare(a.title || "");
                    default:
                        return 0;
                }
            } catch (error) {
                console.error("Error sorting jobs:", error);
                return 0;
            }
        });
    }, [jobs, sortOption]);

    const handleSortChange = (value: string) => {
        setSortOption(value);
    };

    const handleRefresh = () => {
        refetch();
    };

    // Render loading state
    if (isLoading) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <LoadingJobCard />
                <LoadingJobCard />
                <LoadingJobCard />
            </div>
        );
    }

    // Render error state
    if (isError) {
        return (
            <div className="space-y-4">
                <div className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-red-500 font-medium">
                            Error loading job listings
                        </p>
                        <p className="text-sm text-gray-600 max-w-md">
                            {error instanceof Error
                                ? error.message
                                : "Please try again later."}
                        </p>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <MdRefresh className="w-5 h-5" />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Render empty state
    if (sortedJobs.length === 0) {
        return (
            <div className="space-y-4">
                <div className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                        <CgFileDocument className="w-12 h-12 text-gray-400" />
                        <p className="text-lg font-medium text-gray-900">
                            No job listings found
                        </p>
                        <p className="text-sm text-gray-600 max-w-md">
                            There are currently no job listings that match your
                            criteria.
                        </p>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <MdRefresh className="w-5 h-5" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Render job listings
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-600">
                        Showing {sortedJobs.length}{" "}
                        {sortedJobs.length === 1 ? "result" : "results"}
                    </p>
                    {isFetching && (
                        <span className="text-xs text-blue-600">
                            Refreshing...
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="text-blue-600  hover:text-blue-800 transition-colors"
                        aria-label="Refresh listings"
                        disabled={isFetching}
                    >
                        <MdRefresh
                            className={`w-5 h-5 ${
                                isFetching ? "animate-spin" : ""
                            }`}
                        />
                    </button>
                    <JobSorting
                        onSortChange={handleSortChange}
                        selectedOption={sortOption}
                    />
                </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
                {sortedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
}
