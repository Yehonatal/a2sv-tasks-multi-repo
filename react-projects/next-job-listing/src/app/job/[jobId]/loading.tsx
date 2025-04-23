export default function Loading() {
  return (
    <div className="p-4 md:p-8 font-sans bg-white text-gray-800 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
          
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-gray-200 mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-gray-200 mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-gray-200 mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
          
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3 mb-6">
            <div className="flex">
              <div className="w-5 h-5 rounded-full bg-gray-200 mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="flex">
              <div className="w-5 h-5 rounded-full bg-gray-200 mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-auto md:basis-1/3 lg:basis-1/4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
          
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          </div>
          
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded-full w-28"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
