import JobList from "../JobList";

const OpportunitiesDashboard = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-gray-900 mb-1 sm:mb-2">
                Opportunities
            </h1>
            <JobList />
        </div>
    );
};

export default OpportunitiesDashboard;
