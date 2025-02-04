import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-pink-50 border-t border-pink-200">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <Heart className="h-5 w-5 text-pink-500 mr-2" />
          <span className="text-sm text-gray-600">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>
        <nav className="flex space-x-4">
          <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  )
}