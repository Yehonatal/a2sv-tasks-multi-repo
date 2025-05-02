"use client";

export default function LoadingJobCard() {
    return (
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm flex flex-row gap-3 sm:gap-5 animate-pulse">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div className="flex-grow flex flex-col space-y-3 w-full sm:w-auto">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="flex flex-wrap gap-2 pt-2">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>
            </div>
        </div>
    );
}
