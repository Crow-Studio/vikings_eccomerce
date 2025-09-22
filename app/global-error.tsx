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
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Something went wrong
              </h1>
              <p className="text-muted-foreground">
                The application encountered an error.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => reset()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Try Again
              </button>
              <button
                type="button"
                onClick={handleGoHome}
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
