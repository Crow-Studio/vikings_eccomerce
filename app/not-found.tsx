import { Home,} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import GrainOverlay from "@/components/global/GrainOverlay"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden relative">
      <GrainOverlay />
      
      {/* Left side - Image (hidden on small devices) */}
      <div className="hidden lg:flex flex-1 bg-[#2A2A2A] items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="relative max-w-sm sm:max-w-md lg:max-w-lg">
          <Image
            src="/images/notFound.svg"
            alt="Page not found illustration"
            width={400}
            height={600}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
      {/* Right side - Content */}
      <div className="flex-1 flex flex-col">
        {/* Top section - Error message */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-primary">
          <div className="text-center max-w-lg">
            <div className="mb-6 sm:mb-8">
              <span className="inline-block text-7xl sm:text-8xl lg:text-9xl font-black text-white mb-4 tracking-tighter">
                404
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-black leading-tight mb-4 sm:mb-6">
              Oops! Page not found
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
        </div>
        
        {/* Bottom section - Navigation and quick links */}
        <div className="flex-1 bg-black flex flex-col justify-center p-6 sm:p-8 lg:p-12 text-white">
          <div className="max-w-md mx-auto lg:mx-0 w-full">
            <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed text-center lg:text-left">
              Don&apos;t worry! You can easily find what you&apos;re looking for by visiting our homepage or exploring our shop.
            </p>
            
            {/* Action button */}
            <div className="mb-10">
              <Link href="/" className="inline-block">
                <Button className="bg-white hover:bg-gray-200 text-black cursor-pointer font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Button>
              </Link>
            </div>
            
            {/* Quick navigation */}
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider text-center lg:text-left">
                Quick Links
              </h3>
              <nav className="flex flex-wrap justify-center lg:justify-start gap-6">
                <Link 
                  href="/products"
                  className="text-sm font-medium text-white hover:text-primary transition-colors duration-300"
                >
                  SHOP
                </Link>
                <Link 
                  href="/terms"
                  className="text-sm font-medium text-white hover:text-primary transition-colors duration-300"
                >
                  TERMS
                </Link>
                <Link 
                  href="/privacy"
                  className="text-sm font-medium text-white hover:text-primary transition-colors duration-300"
                >
                  PRIVACY POLICY
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}