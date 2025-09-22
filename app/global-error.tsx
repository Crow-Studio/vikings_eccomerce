"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    // Global error must include html and body tags
    <html lang="en" className="h-full">
      <body className="h-full bg-white font-sans">
        <div className="min-h-screen flex items-center justify-center p-6 relative bg-white">
          <div className="text-center max-w-2xl mx-auto space-y-4 sm:space-y-6">
            {/* Error Icon/Symbol */}
            <div className="mb-4">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-black bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent leading-none">
                ⚠️
              </span>
            </div>
            
            {/* Heading and Description */}
            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                Something went wrong
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                The application encountered an unexpected error. Please try again or return home.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => reset()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex-1 sm:flex-none"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={handleGoHome}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex-1 sm:flex-none"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}