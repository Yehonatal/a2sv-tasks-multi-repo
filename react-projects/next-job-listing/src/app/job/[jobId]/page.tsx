import { Metadata } from "next";
import JobPageClient from "./page.client";

export function generateMetadata(): Promise<Metadata> {
    return Promise.resolve({
        title: "Job Details",
        description: "View job details and apply",
    });
}

export default async function JobPage({ params }: { params: { jobId: string } }) {
    const { jobId } = await params;
    return <JobPageClient jobId={jobId} />;
}
