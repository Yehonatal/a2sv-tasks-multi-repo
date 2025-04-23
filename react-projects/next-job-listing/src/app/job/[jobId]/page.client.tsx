"use client";

import { BsCheckCircle } from "react-icons/bs";
import { FiClock, FiMapPin, FiCalendar } from "react-icons/fi";
import { useGetOpportunityByIdQuery } from "@/redux/services/opportunitiesApi";
import { notFound } from "next/navigation";
import { formatDate } from "@/hooks/useTimeFormat";

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

interface JobPageClientProps {
    jobId: string;
}

export default function JobPageClient({ jobId }: JobPageClientProps) {
    const { data, isLoading, error } = useGetOpportunityByIdQuery(
        jobId.toString()
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        notFound()
    }

    if (!data || !data.data) {
        notFound();
    }

    const job = data.data;

    const mappedJob = {
        id: job.id,
        title: job.title,
        description: job.description,
        responsibilities: typeof job.responsibilities === 'string' 
            ? job.responsibilities.split('\n') 
            : [],
        ideal_candidate: {
            age: '',
            gender: '',
            traits: typeof job.idealCandidate === 'string' 
                ? job.idealCandidate.split('\n') 
                : []
        },
        when_where: job.whenAndWhere,
        about: {
            posted_on: formatDate(job.datePosted),
            deadline: formatDate(job.deadline),
            location: Array.isArray(job.location) && job.location.length > 0 
                ? job.location[0] 
                : '',
            start_date: formatDate(job.startDate),
            end_date: formatDate(job.endDate),
            categories: job.categories || [],
            required_skills: job.requiredSkills || []
        },
        company: job.orgName || '',
        image: job.logoUrl || ''
    };

    const tagBaseClass =
        "inline-block px-4 py-1 rounded-full mr-2 mb-2 text-sm font-medium";
    const skillTagClass = `${tagBaseClass} bg-purple-100 text-purple-800 font-normal`;

    return (
        <div className="p-4 md:p-8 font-sans bg-white text-gray-800">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="flex-1">
                    <SectionTitle>Description</SectionTitle>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        {mappedJob.description}
                    </p>

                    <SectionTitle>Responsibilities</SectionTitle>
                    <ul className="list-none p-0 space-y-3 mb-6">
                        {mappedJob.responsibilities.map(
                            (resp: string, index: number) => (
                                <li key={index} className="flex items-center">
                                    <BsCheckCircle className="w-5 h-4 mr-3 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-600">
                                        {resp}
                                    </span>
                                </li>
                            )
                        )}
                    </ul>

                    <SectionTitle>Ideal Candidate</SectionTitle>
                    <ul className="list-none p-0 space-y-3 mb-6">
                        {mappedJob.ideal_candidate.traits.map(
                            (trait: string, index: number) => (
                                <li key={index} className="flex">
                                    <span className="font-semibold w-5 h-5 mr-1 flex-shrink-0 text-black">
                                        •
                                    </span>
                                    <span className="font-semibold text-gray-700">
                                        {trait}
                                    </span>
                                </li>
                            )
                        )}
                    </ul>

                    <SectionTitle>When & Where</SectionTitle>
                    <div className="flex items-center">
                        <SidebarIcon icon={FiMapPin} />
                        <span className="text-gray-600">
                            {mappedJob.when_where || mappedJob.about.location}
                        </span>
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
                                    {mappedJob.about.posted_on}
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
                                    {mappedJob.about.deadline}
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
                                    {mappedJob.about.location}
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
                                    {mappedJob.about.start_date}
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
                                    {mappedJob.about.end_date}
                                </p>
                            </div>
                        </div>
                    </div>

                    <SectionTitle>Categories</SectionTitle>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {mappedJob.about.categories.map(
                            (cat: string, index: number) => (
                                <span
                                    key={index}
                                    className={`${tagBaseClass} ${getCategoryColorClasses(
                                        index
                                    )}`}
                                >
                                    {cat}
                                </span>
                            )
                        )}
                    </div>

                    <SectionTitle>Required Skills</SectionTitle>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {mappedJob.about.required_skills.map(
                            (skill: string, index: number) => (
                                <span key={index} className={skillTagClass}>
                                    {skill}
                                </span>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
