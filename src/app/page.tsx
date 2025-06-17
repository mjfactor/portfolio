"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ProjectsSection } from "@/components/projects-section"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <ProjectsSection />
      </main>
      <footer className="py-8 text-center text-muted-foreground">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          © 2024 Portfolio. Built with Next.js & Framer Motion.
        </motion.p>
      </footer>
    </div>
  )
}
