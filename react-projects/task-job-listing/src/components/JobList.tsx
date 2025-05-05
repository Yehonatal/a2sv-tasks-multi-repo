import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../hooks/useGetJobs";
import JobCard from "./JobCard";
import type { Job } from "../hooks/useGetJobs";
import { FiChevronDown } from "react-icons/fi"; // Import chevron icon for dropdown

// Define possible sort keys
type SortKey =
    | "title"
    | "company"
    | "location"
    | "posted_on"
    | "deadline"
    | "relevant";

// Map sort keys to display text
const sortKeyToText: Record<SortKey, string> = {
    relevant: "Most relevant",
    posted_on: "Newest",
    deadline: "Deadline",
    title: "Title",
    company: "Company",
    location: "Location",
};

const JobList = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>("relevant");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const data = await getJobs();
                if (Array.isArray(data)) {
                    setJobs(data);
                } else {
                    console.warn("Fetched data is not an array:", data);
                    setJobs([]);
                }
                setError(null);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
                setError("Failed to load jobs.");
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Memoize the sorted jobs list
    const sortedJobs = useMemo(() => {
        if (sortKey === "relevant") return jobs; // No sorting for "Most relevant"

        const sortableJobs = [...jobs];
        sortableJobs.sort((a, b) => {
            let valA: string | number | Date;
            let valB: string | number | Date;

            switch (sortKey) {
                case "title":
                case "company":
                    valA = a[sortKey].toLowerCase();
                    valB = b[sortKey].toLowerCase();
                    break;
                case "location":
                    valA = a.about.location.toLowerCase();
                    valB = b.about.location.toLowerCase();
                    break;
                case "posted_on":
                case "deadline":
                    valA = new Date(a.about[sortKey]);
                    valB = new Date(b.about[sortKey]);
                    if (isNaN(valA.getTime())) valA = new Date(0);
                    if (isNaN(valB.getTime())) valB = new Date(0);
                    break;
                default:
                    return 0;
            }

            let comparison = 0;
            if (valA > valB) comparison = 1;
            else if (valA < valB) comparison = -1;

            return sortOrder === "asc" ? comparison : comparison * -1;
        });

        return sortableJobs;
    }, [jobs, sortKey, sortOrder]);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortKey = event.target.value as SortKey;
        setSortKey(newSortKey);
        setSortOrder(
            newSortKey === "posted_on" || newSortKey === "deadline"
                ? "desc"
                : "asc"
        );
    };

    if (loading) {
        return <div className="text-center p-10">Loading jobs...</div>;
    }

    if (error) {
        return (
            <div className="text-center p-10 text-red-500">Error: {error}</div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-4 sm:py-6">
            <div className="mb-4 sm:mb-6 md:mb-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start  gap-3 sm:gap-0">
                    <span className="text-gray-600 text-sm sm:text-base">
                        Showing {sortedJobs.length} results
                    </span>
                    <div className="relative flex items-center md:self-end self-auto">
                        <span className="text-xs sm:text-sm text-gray-500 mr-2">
                            Sort by:
                        </span>
                        <select
                            value={sortKey}
                            onChange={handleSortChange}
                            className="appearance-none bg-transparent px-2 pr-8 py-1 text-gray-900 text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="relevant">
                                {sortKeyToText.relevant}
                            </option>
                            <option value="posted_on">
                                {sortKeyToText.posted_on}
                            </option>
                            <option value="deadline">
                                {sortKeyToText.deadline}
                            </option>
                            <option value="title">{sortKeyToText.title}</option>
                            <option value="company">
                                {sortKeyToText.company}
                            </option>
                            <option value="location">
                                {sortKeyToText.location}
                            </option>
                        </select>
                        <FiChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                </div>
            </div>

            <div className="space-y-4 px-4 sm:px-6 lg:px-8 ">
                {sortedJobs.length > 0 ? (
                    sortedJobs.map((job) => (
                        <Link
                            key={job.id}
                            to={`/job/${job.id}`}
                            className="block no-underline text-inherit"
                        >
                            <JobCard job={job} />
                        </Link>
                    ))
                ) : (
                    <div className="text-center text-gray-500">
                        No jobs found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobList;
