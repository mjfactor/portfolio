"use client"

import { Navigation } from "@/components/navigation"
import { ProjectsSection } from "@/components/projects-section"
import { AboutMe } from "@/components/about-me"
import { ChatBox } from "@/components/chat-box"
import { AnimatedBackground } from "@/components/animated-background"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navigation />
      <main className="relative z-10">
        <AboutMe />
        <ProjectsSection />
      </main>
      <Footer />
      {/* Floating Chat Widget */}
      <ChatBox />
    </div>
  )
}
