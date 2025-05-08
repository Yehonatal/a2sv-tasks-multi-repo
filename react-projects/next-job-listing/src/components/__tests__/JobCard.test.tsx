// src/components/__tests__/JobCard.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Added for custom matchers
import JobCard from "../JobCard";
import { Job } from "@/lib/type";

// Mock next/image
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt || ""} />;
    },
}));

// Mock next/link
jest.mock("next/link", () => ({
    __esModule: true,
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => <a href={href}>{children}</a>,
}));

// Mock BookmarkButton component
jest.mock("../BookmarkButton", () => ({
    __esModule: true,
    default: () => <button>Bookmark</button>, // Simple mock
}));

describe("JobCard Component", () => {
    const mockJob: Job = {
        id: "1",
        title: "Software Engineer",
        description: "Develop amazing software.",
        responsibilities: ["Code", "Test", "Deploy"],
        image: "/job-image.png",
        company: "Tech Solutions Inc.",
        about: {
            // Fields according to Job.about type
            posted_on: "2024-01-10",
            deadline: "2024-11-30",
            location: "San Francisco, CA (HQ)",
            start_date: "2024-07-01",
            end_date: "N/A",
            categories: ["Engineering", "Technology"],
            required_skills: ["Problem Solving", "Teamwork"],
        },
        ideal_candidate: { age: "Any", gender: "Any", traits: ["Curious"] }, // From Job type
        when_where: "Mon-Fri, 9am-5pm PST", // From Job type
    };

    it("renders job details correctly", () => {
        render(<JobCard job={mockJob} />);

        expect(screen.getByText("Software Engineer")).toBeInTheDocument();
        expect(
            screen.getByText((content, element) => {
                if (!element) return false;
                const searchText =
                    /Tech Solutions Inc\.\s*•\s*San Francisco, CA \(HQ\)/i;
                const elementTextMatches = searchText.test(
                    element.textContent || ""
                );
                const noChildFullyMatches = Array.from(element.children).every(
                    (child) => !searchText.test(child.textContent || "")
                );
                return elementTextMatches && noChildFullyMatches;
            })
        ).toBeInTheDocument();
        // Single check for top-level description
        expect(
            screen.getByText(/Develop amazing software\./)
        ).toBeInTheDocument();
        // Check for the first category from about.categories
        expect(
            screen.getByText(mockJob.about!.categories[0])
        ).toBeInTheDocument();
    });

    it("renders placeholder image if job.image is not provided", () => {
        const jobWithoutImage: Job = {
            ...mockJob,
            image: undefined,
            about: { ...mockJob.about! }, // Deep copy about
        };
        render(<JobCard job={jobWithoutImage} />);
        const image = screen.getByAltText(jobWithoutImage.company + " logo");
        expect(image).toHaveAttribute("src", "/job1.png");
    });

    it("renders default text when core job details are missing", () => {
        const jobWithMissingDetails: Job = {
            ...mockJob, // Spread to keep other essential fields like id and about structure
            id: "details-missing-job",
            title: undefined,
            company: undefined,
            description: undefined,
            // Keep about from mockJob for now, or set specific location for this test if needed
            about: { ...mockJob.about! },
        };
        render(<JobCard job={jobWithMissingDetails} />);

        expect(screen.getByText("Job Title")).toBeInTheDocument();
        // For company and location, it's combined. Default company is "Company". Location from mockJob.about is "San Francisco, CA (HQ)"
        expect(
            screen.getByText((content, element) => {
                if (!element || element.tagName.toLowerCase() !== "p")
                    return false;
                const searchText = /Company\s*•\s*San Francisco, CA \(HQ\)/i; // Default company, existing location
                const elementTextMatches = searchText.test(
                    element.textContent || ""
                );
                const noChildFullyMatches = Array.from(element.children).every(
                    (child) => !searchText.test(child.textContent || "")
                );
                return elementTextMatches && noChildFullyMatches;
            })
        ).toBeInTheDocument();
        expect(
            screen.getByText("No description available")
        ).toBeInTheDocument();
    });

    it("renders 'Remote' and no categories when job.about is missing", () => {
        const jobWithoutAbout: Job = {
            ...mockJob,
            id: "about-missing-job",
            company: "Aboutless Inc.", // Give a unique company for this test
            about: undefined,
        };
        render(<JobCard job={jobWithoutAbout} />);

        // Check for default location "Remote"
        expect(
            screen.getByText((content, element) => {
                if (!element || element.tagName.toLowerCase() !== "p")
                    return false;
                // Company name is specific to this test, location defaults to "Remote"
                const searchText = /Aboutless Inc\.\s*•\s*Remote/i;
                return searchText.test(element.textContent || "");
            })
        ).toBeInTheDocument();

        // Check that the location tag also shows "Remote"
        expect(
            screen.getByText(/^Remote$/, { selector: "span.bg-green-50" })
        ).toBeInTheDocument();

        // Check that no category tags are rendered (mockJob.about.categories usually has 2)
        // We can check if any of the typical category texts exist. If not, it implies no categories.
        expect(
            screen.queryByText(mockJob.about!.categories[0])
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(mockJob.about!.categories[1])
        ).not.toBeInTheDocument();
    });
});
