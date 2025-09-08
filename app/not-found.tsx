import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next.link"
import Image from "next/image"
import GrainOverlay from "@/components/global/GrainOverlay"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-white">
      <GrainOverlay />
      
      <div className="text-center max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {/* 404 Number */}
        <div className="mb-4">
          <span className="text-6xl sm:text-7xl lg:text-8xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent leading-none">
            404
          </span>
        </div>
        
        {/* Heading and Description */}
        <div className="space-y-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
            Page Not Found
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            {"The page you're looking for doesn't exist or has been moved."}
          </p>
        </div>
        
        {/* Illustration */}
        <div className="hidden sm:block max-w-xs mx-auto py-4">
          <Image
            src="/images/notFound.svg"
            alt="Page not found illustration"
            width={250}
            height={150}
            className="w-full h-auto object-contain opacity-80"
            priority
          />
        </div>
        
        {/* Back to Home Button */}
        <div className="pt-2">
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}