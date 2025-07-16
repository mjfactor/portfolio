"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import {
  siTypescript,
  siNpm,
  siReact,
  siGooglecloud,
  siNextdotjs,
  siNodedotjs,
  siPython,
  siLangchain,
  siPostgresql,
  siDocker,
  siVercel,
  siGithub,
  siGooglegemini,
  siAuchan,
  siRedis,
  siCplusplus,
  siMongodb,
  siPhp,
  siCoda
} from "simple-icons"

// Simple Icons React component wrapper
interface SimpleIconProps {
  icon: any
  size?: number
  className?: string
}

function SimpleIcon({ icon, size = 16, className = "" }: SimpleIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={icon.path} />
    </svg>
  )
}

export function AboutMe() {
  const skills = [
    { name: "TypeScript", icon: siTypescript },
    { name: "React", icon: siReact },
    { name: "Google Cloud", icon: siGooglecloud },
    { name: "Next.js", icon: siNextdotjs },
    { name: "Node.js", icon: siNodedotjs },
    { name: "C#", icon: siCoda },
    { name: "NPM", icon: siNpm },
    { name: "Python", icon: siPython },
    { name: "LangChain", icon: siLangchain },
    { name: "PostgreSQL", icon: siPostgresql },
    { name: "Docker", icon: siDocker },
    { name: "PHP", icon: siPhp },
    { name: "Vercel", icon: siVercel },
    { name: "Google AI Studio", icon: siGooglegemini },
    { name: "Vercel AI Sdk", icon: siVercel },
    { name: "Microsoft Azure", icon: siAuchan },
    { name: "Github", icon: siGithub },
    { name: "Express.js", icon: siNodedotjs },
    { name: "Redis", icon: siRedis },
    { name: "C++", icon: siCplusplus },
    { name: "MongoDB", icon: siMongodb },
  ]

  const focusAreas = [
    {
      title: "AI Integration",
      description: "Building intelligent applications with LLMs, embeddings, and AI-powered features",
      icon: "🤖"
    },
    {
      title: "Full-Stack Development",
      description: "End-to-end web applications using modern frameworks and best practices",
      icon: "💻"
    },
    {
      title: "Cloud Computing",
      description: "Experience with cloud services and deployment",
      icon: "☁️"
    }
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
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight pb-2">
            Emjay Factor
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-foreground">
            AI Applications • Software Applications • Full-Stack Development
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            I'm passionate about building intelligent software solutions .
          </p>

          {/* Resume Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="hover:bg-primary/10 transition-colors"
            >
              <a
                href="/Emjay_Factor_Resume.pdf"
                download="Emjay_Factor_Resume.pdf"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Download size={18} />
                Download Resume
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold text-center mb-8 text-foreground">
            Technologies & Tools that I Used
          </h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {skills.map((skill, index) => {
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Badge variant="secondary" className="text-sm py-2 px-4 hover:bg-primary/20 transition-colors flex items-center gap-2">
                    <SimpleIcon icon={skill.icon} size={16} className="text-primary" />
                    {skill.name}
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
