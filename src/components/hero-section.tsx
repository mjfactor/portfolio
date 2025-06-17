"use client"

import { motion } from "framer-motion"
import { ChatBox } from "@/components/chat-box"

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to My Portfolio
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            I'm a passionate developer creating beautiful and functional web experiences. Let's chat about your next
            project!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <ChatBox />
        </motion.div>
      </div>
    </section>
  )
}
