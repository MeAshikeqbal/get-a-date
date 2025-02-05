import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/Navbar"
import type { Metadata } from "next"
import type React from "react"
import { Footer } from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Get a date",
    template: "%s | Get a date",
  },
  description: "Create personalized date invites for any occasion",
  keywords: ["date", "invites", "personalized", "love", "romance", "social"],
  authors: [{ name: "Get a date Team" }],
  creator: "Get a date",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://getadate.ink"),
  openGraph: {
    title: "Get a date - Personalized Invites",
    description: "Create and send personalized date invites to your special someone.",
    url: "/",
    siteName: "Get a date",
    images: [
      {
        url: "/api/og?title=Get a date",
        width: 1200,
        height: 630,
        alt: "Get a date - Personalized Invites",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get a date - Personalized Invites",
    description: "Create and send personalized date invites to your special someone.",
    images: ["/api/og?title=Get a date"],
    creator: "@getadate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Get A date",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Get A date" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}

