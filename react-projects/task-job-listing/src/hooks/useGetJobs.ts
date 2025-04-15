import jobsData from "../data/jobs.json"; // Import the JSON data directly

// Define the Job interface based on jobs.json structure
// (This could be moved to a shared types file later)
export interface Job {
    id: number; // Added id based on index
    title: string;
    description: string;
    responsibilities: string[];
    ideal_candidate: {
        age: string;
        gender: string;
        traits: string[];
    };
    when_where: string;
    about: {
        posted_on: string;
        deadline: string;
        location: string;
        start_date: string;
        end_date: string;
        categories: string[];
        required_skills: string[];
    };
    company: string;
    image: string;
}

// Type assertion for the imported data if needed, assuming structure is correct
const typedJobsData: { job_postings: Omit<Job, "id">[] } = jobsData;

export async function getJobs(): Promise<Job[]> {
    // Process the imported data directly
    try {
        // Add id based on array index
        const jobsWithId = typedJobsData.job_postings.map((job, index) => ({
            ...job,
            id: index,
        }));
        // Simulate async behavior if needed, or return directly
        // await new Promise(resolve => setTimeout(resolve, 0)); // Optional: Keep async nature
        return jobsWithId;
    } catch (error) {
        console.error("Error processing job data:", error);
        return []; // Return empty array on error
    }
}
