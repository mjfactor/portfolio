"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import projects from "../projects.json"

export function ProjectsSection() {
  return (
    <section id="projects" className="border-t border-border/40 px-4 pb-24 pt-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">Selected work</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Projects</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A few experiments and products I&apos;ve built recently.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col overflow-hidden border-border/60 bg-card/70 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader className="p-0 pb-2">
                    <div className="h-[200px] w-full overflow-hidden border-b border-border/50">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={400}
                        height={180}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      />
                    </div>
                    <div className="px-6 pt-5">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription className="mt-2 text-sm line-clamp-3">
                        {project.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      {project.liveUrl && (
                        <Button asChild variant="default" size="sm">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button asChild variant="outline" size="sm">
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
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
