"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface Particle {
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
}

interface GeometricShape {
    id: number
    x: number
    y: number
    size: number
    rotation: number
    duration: number
    shape: 'circle' | 'triangle' | 'square'
}

export function AnimatedBackground() {
    // Generate random particles
    const particles = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 60 + 20,
            duration: Math.random() * 20 + 15,
            delay: Math.random() * 2,
        }))
    }, [])

    // Generate geometric shapes
    const shapes = useMemo(() => {
        const shapeTypes: ('circle' | 'triangle' | 'square')[] = ['circle', 'triangle', 'square']
        return Array.from({ length: 8 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 40 + 15,
            rotation: Math.random() * 360,
            duration: Math.random() * 25 + 20,
            shape: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        }))
    }, [])

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Animated gradient background */}
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 40% 40%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
                    ],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />

            {/* Floating particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-primary/10 blur-sm"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        x: ["-20px", "20px", "-20px"],
                        y: ["-30px", "30px", "-30px"],
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Geometric shapes */}
            {shapes.map((shape) => (
                <motion.div
                    key={shape.id}
                    className="absolute"
                    style={{
                        left: `${shape.x}%`,
                        top: `${shape.y}%`,
                    }}
                    animate={{
                        rotate: [shape.rotation, shape.rotation + 360],
                        x: ["-15px", "15px", "-15px"],
                        y: ["-10px", "20px", "-10px"],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: shape.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                    }}
                >
                    {shape.shape === 'circle' && (
                        <div
                            className="rounded-full border border-primary/20 bg-primary/5"
                            style={{ width: shape.size, height: shape.size }}
                        />
                    )}
                    {shape.shape === 'triangle' && (
                        <div
                            className="bg-primary/10"
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: `${shape.size / 2}px solid transparent`,
                                borderRight: `${shape.size / 2}px solid transparent`,
                                borderBottom: `${shape.size}px solid hsl(var(--primary) / 0.1)`,
                            }}
                        />
                    )}
                    {shape.shape === 'square' && (
                        <div
                            className="border border-primary/20 bg-primary/5 rotate-45"
                            style={{ width: shape.size, height: shape.size }}
                        />
                    )}
                </motion.div>
            ))}

            {/* Floating dots */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={`dot-${i}`}
                    className="absolute w-1 h-1 bg-primary/30 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                        duration: Math.random() * 4 + 2,
                        delay: Math.random() * 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
            ))}

            {/* Subtle animated lines */}
            {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                    key={`line-${i}`}
                    className="absolute bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                    style={{
                        width: `${Math.random() * 200 + 100}px`,
                        height: '1px',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        opacity: [0, 0.5, 0],
                        rotate: [0, 360],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: Math.random() * 15 + 10,
                        delay: Math.random() * 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    )
}
