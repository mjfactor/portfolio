import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Emjay's Portfolio",
  description: "A modern portfolio website showcasing creative projects and development skills.",
  keywords: ["portfolio", "developer", "web development", "projects"],
  authors: [{ name: "Emjay" }],
  metadataBase: new URL('https://portfolio-emjay-factor.vercel.app/'), // Replace with your actual domain
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://portfolio-emjay-factor.vercel.app/', // Replace with your actual domain
    title: "Emjay's Portfolio",
    description: "A modern portfolio website showcasing creative projects and development skills with AI-powered chat assistant.",
    siteName: "Emjay's Portfolio",
    images: [
      {
        url: 'https://portfolio-emjay-factor.vercel.app/opengraph-image.png', // Ensure this path is correct
        width: 1200,
        height: 630,
        alt: "Emjay's Portfolio - AI Applications • Software Applications • Deployment",
      },
    ],
  }
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
