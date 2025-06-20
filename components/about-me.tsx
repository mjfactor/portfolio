"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code2,
  Component,
  Globe,
  Server,
  Brain,
  Link,
  Palette,
  Database,
  Container,
  Cloud,
  Zap,
  GitBranch,

} from "lucide-react"

export function AboutMe() {
  const skills = [
    "TypeScript", "React", "Next.js", "Node.js", "Python", "LangChain/LangGraph", "PostgreSQL",
    "Docker", "Vercel", "Google AI Studio", "Vercel AI Sdk",
  ]

  const skillIcons = {
    "TypeScript": Code2,
    "React": Component,
    "Next.js": Globe,
    "Google AI Studio": Brain,
    "Node.js": Server,
    "Python": Code2,
    "LangChain/LangGraph": Link,
    "PostgreSQL": Database,
    "Docker": Container,
    "Vercel": Zap,
    "GitHub Actions": GitBranch,
    "Vercel AI Sdk": Brain,
  }

  const focusAreas = [
    {
      title: "AI Integration",
      description: "Building intelligent applications with LLMs, embeddings, and AI-powered features",
      icon: "🤖"
    },
    {
      title: "Full-Stack Development",
      description: "End-to-end web applications using modern frameworks ",
      icon: "💻"
    },
  ]

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-30">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Hi, I'm Emjay
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-foreground">
            AI Applications • Software Applications • Deployment
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            I'm passionate about building intelligent software solutions .
          </p>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold text-center mb-8 text-foreground">
            Technologies & Tools
          </h3>          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {skills.map((skill, index) => {
              const IconComponent = skillIcons[skill as keyof typeof skillIcons]
              return (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Badge variant="secondary" className="text-sm py-2 px-4 hover:bg-primary/20 transition-colors flex items-center gap-2">
                    <IconComponent size={16} className="text-primary" />
                    {skill}
                  </Badge>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold text-center mb-8 text-foreground">
            What I Do
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {focusAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-border/50 hover:border-primary/30">
                  <CardHeader className="text-center pb-2">
                    <div className="text-4xl mb-2">{area.icon}</div>
                    <CardTitle className="text-xl">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-muted-foreground leading-relaxed">
                      {area.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
