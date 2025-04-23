"use client";

import { Job } from "@/lib/type";
import Image from "next/image";
import Link from "next/link";

interface JobCardProps {
    job: Job;
}

const locationTagStyle = "bg-green-50 text-green-700 border border-green-100";
const categoryTagStyles = [
    "border border-orange-300 text-orange-500 bg-white",
    "border border-blue-300 text-blue-500 bg-white",
];

const getCategoryTagStyle = (index: number): string => {
    return categoryTagStyles[index % categoryTagStyles.length];
};

const JobCard = ({ job }: JobCardProps) => {
    // Use properties from the Job interface
    const imageSrc = job.image || "/job1.png";
    const location = job.about?.location || "Remote";
    const categories = job.about?.categories || [];

    return (
        <Link href={`/job/${job.id}`} className="block">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-row gap-3 sm:gap-5">
                <Image
                    src={imageSrc}
                    alt={`${job.company || "Company"} logo`}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain flex-shrink-0 rounded-lg"
                    width={64}
                    height={64}
                />
                <div className="flex-grow flex flex-col space-y-2 w-full sm:w-auto">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 sm:text-left">
                        {job.title || "Job Title"}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 sm:text-left">
                        {job.company || "Company"}{" "}
                        <span className="mx-1">•</span> {location}
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed line-clamp-2 sm:line-clamp-3 sm:text-left">
                        {job.description || "No description available"}
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start pt-2 gap-2 sm:gap-0">
                        <div className="flex flex-wrap gap-2 sm:justify-start w-full sm:w-auto">
                            <span
                                className={`px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${locationTagStyle}`}
                            >
                                {location.includes("Addis Ababa")
                                    ? "In Person"
                                    : "Remote"}
                            </span>

                            <span className="hidden sm:inline-block mx-2 text-gray-300">
                                |
                            </span>

                            {categories.slice(0, 2).map((category, index) => (
                                <span
                                    key={index}
                                    className={`px-3 sm:px-4 py-1 rounded-full text-xs font-medium ${getCategoryTagStyle(
                                        index
                                    )}`}
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default JobCard;
