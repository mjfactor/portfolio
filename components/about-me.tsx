"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, MessageCircle } from "lucide-react"
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
  siCoda,
  siSpringboot,
  siSpring
} from "simple-icons"

interface AboutMeProps {
  onOpenChat: () => void
}

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

export function AboutMe({ onOpenChat }: AboutMeProps) {
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
    { name: "Spring Boot", icon: siSpringboot },
    { name: "Spring AI", icon: siSpring },
    { name: "C++", icon: siCplusplus },
    { name: "MongoDB", icon: siMongodb },
  ]

  return (
    <>
      {/* Hero Section with Background */}
      <section className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 h-[500px] w-full overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              src="/images/space-background.jpg"
              alt="Space background"
              className="object-cover"
              fill
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/65 via-background/90 to-background" />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative mx-auto max-w-6xl px-4 pt-40 lg:pt-70 pb-12">
          <div className="relative pb-8">
            {/* Profile Section */}
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left">
              {/* Profile Logo */}
              <div className="mb-6 h-40 w-40 overflow-hidden rounded-full border-4 border-background shadow-xl lg:mb-0 lg:mr-8 flex items-center justify-center bg-background">
                <Image
                  src="/images/logo.png"
                  alt="Profile Logo"
                  className="object-contain"
                  width={120}
                  height={120}
                  priority
                />
              </div>

              {/* Name, Title, Description, and Buttons Section */}
              <div className="flex-1 lg:flex lg:justify-between lg:gap-8">
                <div className="lg:flex-1">
                  <h1 className="text-3xl font-bold sm:text-4xl text-foreground">
                    Emjay Factor
                  </h1>
                  <p className="mt-2 text-xl text-muted-foreground">
                    Aspiring AI/Software Engineer
                  </p>

                  {/* Badges */}
                  <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span className="text-primary">💻</span>
                      Full-Stack Development
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span className="text-primary">🤖</span>
                      AI Integration
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span className="text-primary">☁️</span>
                      Cloud Computing
                    </Badge>
                  </div>

                  {/* Bio Section */}
                  <div className="mt-6 max-w-2xl mx-auto lg:mx-0">
                    <p className="text-muted-foreground">
                      I'm passionate about building intelligent software solutions.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row lg:flex-col justify-center gap-3 lg:justify-start">
                  <Button
                    onClick={onOpenChat}
                    variant="default"
                    className="bg-primary hover:bg-primary/90 transition-colors"
                  >
                    <MessageCircle size={18} className="mr-2" />
                    Chat
                  </Button>
                  <Button
                    asChild
                    variant="outline"
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
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16"
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
          </div>
        </div>
      </section>
    </>
  )
}
