"use client"

import { useState } from "react"
import { ProjectsSection } from "@/components/projects-section"
import { AboutMe } from "@/components/about-me"
import { ChatBox } from "@/components/chat-box"
import { Footer } from "@/components/footer"

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background relative">
      <main className="relative z-10">
        <AboutMe onOpenChat={() => setIsChatOpen(true)} />
        <ProjectsSection />
      </main>
      <Footer />
      {/* Floating Chat Widget */}
      <ChatBox isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  )
}
