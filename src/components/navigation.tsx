"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects")
    if (projectsSection) {
      projectsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div whileHover={{ scale: 1.05 }} className="text-xl font-bold">
          Portfolio
        </motion.div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={scrollToProjects} className="hover:bg-accent transition-colors">
            Projects
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  )
}
