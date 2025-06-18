"use client"

import { useState, useEffect } from "react"

interface PerformanceLevel {
    level: 'high' | 'medium' | 'low' | 'minimal'
    particleCount: number
    shapeCount: number
    dotCount: number
    lineCount: number
    useBlur: boolean
    animationDuration: number
    useComplexAnimations: boolean
}

const PERFORMANCE_LEVELS: Record<string, PerformanceLevel> = {
    high: {
        level: 'high',
        particleCount: 12,
        shapeCount: 8,
        dotCount: 20,
        lineCount: 6,
        useBlur: true,
        animationDuration: 1,
        useComplexAnimations: true,
    },
    medium: {
        level: 'medium',
        particleCount: 6,
        shapeCount: 4,
        dotCount: 10,
        lineCount: 3,
        useBlur: false,
        animationDuration: 1.5,
        useComplexAnimations: true,
    },
    low: {
        level: 'low',
        particleCount: 3,
        shapeCount: 2,
        dotCount: 5,
        lineCount: 1,
        useBlur: false,
        animationDuration: 2,
        useComplexAnimations: false,
    },
    minimal: {
        level: 'minimal',
        particleCount: 1,
        shapeCount: 0,
        dotCount: 2,
        lineCount: 0,
        useBlur: false,
        animationDuration: 3,
        useComplexAnimations: false,
    },
}

function detectDeviceCapabilities(): PerformanceLevel {
    // Check if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    )

    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 4

    // Check if device has GPU acceleration hints
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    const hasWebGL = !!gl

    // Memory hints (if available)
    const deviceMemory = (navigator as any).deviceMemory || 4

    // Performance scoring
    let score = 0

    if (!isMobile) score += 2
    if (cores >= 8) score += 2
    else if (cores >= 4) score += 1

    if (hasWebGL) score += 2
    if (deviceMemory >= 8) score += 1

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) score = 0

    // Determine performance level
    if (score >= 6) return PERFORMANCE_LEVELS.high
    if (score >= 4) return PERFORMANCE_LEVELS.medium
    if (score >= 2) return PERFORMANCE_LEVELS.low
    return PERFORMANCE_LEVELS.minimal
}

function measureFrameRate(): Promise<number> {
    return new Promise((resolve) => {
        let frameCount = 0
        const startTime = performance.now()

        function countFrame() {
            frameCount++
            if (performance.now() - startTime < 1000) {
                requestAnimationFrame(countFrame)
            } else {
                resolve(frameCount)
            }
        }

        requestAnimationFrame(countFrame)
    })
}

export function usePerformance() {
    const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>(PERFORMANCE_LEVELS.medium)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function initializePerformance() {
            try {
                // Initial detection based on device capabilities
                const initialLevel = detectDeviceCapabilities()
                setPerformanceLevel(initialLevel)

                // Wait a bit for the page to settle, then measure actual performance
                setTimeout(async () => {
                    const frameRate = await measureFrameRate()

                    // Adjust based on actual performance
                    let adjustedLevel = initialLevel

                    if (frameRate < 30) {
                        // Poor performance, downgrade
                        if (initialLevel.level === 'high') adjustedLevel = PERFORMANCE_LEVELS.medium
                        else if (initialLevel.level === 'medium') adjustedLevel = PERFORMANCE_LEVELS.low
                        else if (initialLevel.level === 'low') adjustedLevel = PERFORMANCE_LEVELS.minimal
                    } else if (frameRate >= 55 && initialLevel.level !== 'high') {
                        // Good performance, potentially upgrade
                        if (initialLevel.level === 'medium') adjustedLevel = PERFORMANCE_LEVELS.high
                        else if (initialLevel.level === 'low') adjustedLevel = PERFORMANCE_LEVELS.medium
                    }

                    setPerformanceLevel(adjustedLevel)
                    setIsLoading(false)
                }, 2000)
            } catch (error) {
                console.warn('Performance detection failed, using medium level:', error)
                setPerformanceLevel(PERFORMANCE_LEVELS.medium)
                setIsLoading(false)
            }
        }

        initializePerformance()
    }, [])

    return { performanceLevel, isLoading }
}
