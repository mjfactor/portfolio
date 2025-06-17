"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ProjectsSection } from "@/components/projects-section"
import { HeroSection } from "@/components/hero-section"
import { ChatBox } from "@/components/chat-box"
import { AnimatedBackground } from "@/components/animated-background"

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navigation />
      <main className="relative z-10">
        <HeroSection />
        <ProjectsSection />
      </main>
      {/* Floating Chat Widget */}
      <ChatBox />
    </div>
  )
}
