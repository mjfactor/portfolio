"use client"

import { vapi } from "@/lib/vapi"
import { useEffect, useState } from "react"

type ConnectionState = "idle" | "connecting" | "connected" | "error"

export function useVapi() {
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [connectionState, setConnectionState] = useState<ConnectionState>("idle")

    useEffect(() => {
        const onSpeechStart = () => setIsSpeaking(true)
        const onSpeechEnd = () => setIsSpeaking(false)
        const onCallStart = () => setConnectionState("connected")
        const onCallEnd = () => {
            setConnectionState("idle")
            setIsSpeaking(false)
        }
        const onError = (error: any) => {
            console.error("Vapi error:", error)
            setConnectionState("error")
            setIsSpeaking(false)
        }

        vapi.on("speech-start", onSpeechStart)
        vapi.on("speech-end", onSpeechEnd)
        vapi.on("call-start", onCallStart)
        vapi.on("call-end", onCallEnd)
        vapi.on("error", onError)

        return () => {
            vapi.off("speech-start", onSpeechStart)
            vapi.off("speech-end", onSpeechEnd)
            vapi.off("call-start", onCallStart)
            vapi.off("call-end", onCallEnd)
            vapi.off("error", onError)
        }
    }, [])

    const startCall = async () => {
        if (connectionState !== "idle") return

        try {
            setConnectionState("connecting")
            await vapi.start({
                model: {
                    provider: "openai",
                    model: "gpt-4",
                    messages: [
                        {
                            role: "system",
                            content: "You are a text-to-speech assistant. Only speak the exact text provided to you.",
                        },
                    ],
                },
                voice: {
                    provider: "11labs",
                    voiceId: "burt",
                },
            })
        } catch (error) {
            console.error("Error starting call:", error)
            setConnectionState("error")
        }
    }

    const stopCall = () => {
        if (connectionState === "connected") {
            vapi.stop()
        }
    }

    const speak = (message: string) => {
        if (connectionState === "connected") {
            // Don't end the call - keep the session active
            vapi.say(message, false)
        }
    }

    return {
        isSpeaking,
        speak,
        connectionState,
        startCall,
        stopCall,
        isConnected: connectionState === "connected"
    }
}
