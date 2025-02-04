import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/Navbar"
import type { Metadata } from "next"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Your Valentine",
  description: "Create personalized Valentine's Day invites",
  keywords: ["Valentine's Day", "invites", "personalized", "love", "romance"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name or Company",
  openGraph: {
    title: "Your Valentine - Personalized Invites",
    description: "Create and send personalized Valentine's Day invites to your loved ones.",
    images: [{ url: "/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Valentine - Personalized Invites",
    description: "Create and send personalized Valentine's Day invites to your loved ones.",
    images: ["/twitter-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}

