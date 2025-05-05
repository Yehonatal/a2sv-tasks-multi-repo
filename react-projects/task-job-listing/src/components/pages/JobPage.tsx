import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getJobs } from "../../hooks/useGetJobs";
import type { Job } from "../../hooks/useGetJobs";
import { BsCheckCircle } from "react-icons/bs";
import { FiClock, FiMapPin, FiCalendar } from "react-icons/fi";

const categoryColors = [
    { bg: "bg-orange-100", text: "text-orange-700" },
    { bg: "bg-teal-100", text: "text-teal-700" },
];

const getCategoryColorClasses = (index: number): string => {
    const { bg, text } = categoryColors[index % categoryColors.length];
    return `${bg} ${text}`;
};

const SidebarIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
    <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 rounded-full">
        <Icon className="w-4 h-4 text-green-600" />
    </span>
);

const JobPage = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            if (!jobId) {
                setError("Job ID not found.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const allJobs = await getJobs();
                const numericJobId = parseInt(jobId, 10);
                const foundJob = allJobs.find((j) => j.id === numericJobId);

                if (foundJob) {
                    setJob(foundJob);
                } else {
                    setError("Job not found.");
                }
            } catch (err) {
                console.error("Failed to fetch job:", err);
                setError("Failed to load job details.");
                setJob(null);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    if (loading) {
        return <div className="p-10 text-center">Loading job details...</div>;
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-500">Error: {error}</div>
        );
    }

    if (!job) {
        return <div className="p-10 text-center">Job not found.</div>;
    }

    const tagBaseClass =
        "inline-block px-4 py-1 rounded-full mr-2 mb-2 text-sm font-medium";
    const skillTagClass = `${tagBaseClass} bg-purple-100 text-purple-800 font-normal `;

    return (
        <div className="p-4 md:p-8 font-sans bg-white text-gray-800">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="flex-1">
                    <SectionTitle>Description</SectionTitle>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        {job.description}
                    </p>

                    <SectionTitle>Responsibilities</SectionTitle>
                    <ul className="list-none p-0 space-y-3 mb-6">
                        {job.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-center">
                                <BsCheckCircle className="w-5 h-4 mr-3 text-green-500 flex-shrink-0" />
                                <span className="text-gray-600">{resp}</span>
                            </li>
                        ))}
                    </ul>

                    <SectionTitle>Ideal Candidate we want</SectionTitle>
                    <ul className="list-none p-0 space-y-3 mb-6">
                        {job.ideal_candidate.traits.map((trait, index) => {
                            const parts = trait.split(":");
                            if (parts.length > 1) {
                                // If there's a colon, split into bold part and regular part
                                const boldPart = parts[0] + ":";
                                const restPart = parts
                                    .slice(1)
                                    .join(":")
                                    .trim();
                                return (
                                    <li key={index} className="flex">
                                        <span className="font-semibold w-5 h-5 mr-1 flex-shrink-0 text-black">
                                            •
                                        </span>
                                        <div>
                                            <span className="font-bold ">
                                                {boldPart}
                                            </span>
                                            <span className="text-gray-600">
                                                {restPart}
                                            </span>
                                        </div>
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={index} className="flex ">
                                        <span className="font-semibold w-5 h-5 mr-1 flex-shrink-0 text-black">
                                            •
                                        </span>
                                        <span className="font-semibold text-gray-700">
                                            {trait}
                                        </span>
                                    </li>
                                );
                            }
                        })}
                    </ul>

                    <SectionTitle>When & Where</SectionTitle>
                    <div className="flex items-center">
                        <SidebarIcon icon={FiMapPin} />
                        <span className="text-gray-600">{job.when_where}</span>
                    </div>
                </div>

                <div className="w-full md:w-auto md:basis-1/3 lg:basis-1/4">
                    <SectionTitle>About</SectionTitle>
                    <div className="space-y-4 text-sm mb-6">
                        <div className="flex items-center">
                            <SidebarIcon icon={FiClock} />
                            <div>
                                <p className="text-gray-500 text-xs">
                                    Posted On
                                </p>
                                <p className="font-semibold text-gray-700">
                                    {job.about.posted_on}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <SidebarIcon icon={FiClock} />
                            <div>
                                <p className="text-gray-500 text-xs">
                                    Deadline
                                </p>
                                <p className="font-semibold text-gray-700">
                                    {job.about.deadline}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <SidebarIcon icon={FiMapPin} />
                            <div>
                                <p className="text-gray-500 text-xs">
                                    Location
                                </p>
                                <p className="font-semibold text-gray-700">
                                    {job.about.location}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <SidebarIcon icon={FiCalendar} />
                            <div>
                                <p className="text-gray-500 text-xs">
                                    Start Date
                                </p>
                                <p className="font-semibold text-gray-700">
                                    {job.about.start_date}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <SidebarIcon icon={FiCalendar} />
                            <div>
                                <p className="text-gray-500 text-xs">
                                    End Date
                                </p>
                                <p className="font-semibold text-gray-700">
                                    {job.about.end_date}
                                </p>
                            </div>
                        </div>
                    </div>

                    <SectionTitle>Categories</SectionTitle>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {job.about.categories.map((cat, index) => (
                            <span
                                key={index}
                                className={`${tagBaseClass} ${getCategoryColorClasses(
                                    index
                                )}`}
                            >
                                {cat}
                            </span>
                        ))}
                    </div>

                    <SectionTitle>Required Skills</SectionTitle>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {job.about.required_skills.map((skill, index) => (
                            <span key={index} className={skillTagClass}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionTitle = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <h2
        className={`text-xl font-extrabold text-gray-800 mb-4 ${
            className || ""
        }`}
    >
        {children}
    </h2>
);

export default JobPage;
