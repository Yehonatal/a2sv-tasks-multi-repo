import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
      <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
      <Link 
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Back to Jobs
      </Link>
    </div>
  );
}
