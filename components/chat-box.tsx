"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, MessageCircle, X, Trash2, Play, Mic, MicOff } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVapi } from "@/hooks/use-vapi"

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, status, error, setMessages } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Hi! What do want to know about Emjay?"
      }
    ],
    onError: (error) => {
      console.error("Chat error:", error)
    }
  })
  const { isSpeaking, speak, connectionState, startCall, stopCall, isConnected } = useVapi()

  const handleSpeak = (message: string) => {
    if (isConnected) {
      speak(message)
    }
  }

  const handleVoiceToggle = () => {
    if (connectionState === "connected") {
      stopCall()
    } else if (connectionState === "idle" || connectionState === "error") {
      startCall()
    }
  }

  // Cleanup call when chat is closed
  const handleClose = () => {
    if (connectionState === "connected") {
      stopCall()
    }
    setIsOpen(false)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === 'submitted' || status === 'streaming') return
    handleSubmit(e)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && status !== 'submitted' && status !== 'streaming') {
        const form = e.currentTarget.closest('form')
        if (form) {
          handleSubmit(e as any)
        }
      }
    }
  }

  const clearMessages = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hi! What do want to know about Emjay?"
      }
    ])
  }

  return (
    <>
      {/* Floating Chat Widget */}
      <motion.div
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
          <span className="sr-only">Open chat</span>
        </Button>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-auto"
            >
              <Card className="h-[500px] md:h-[600px] flex flex-col">                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Let's Chat!</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={connectionState === "connected" ? "default" : "outline"}
                    size="sm"
                    onClick={handleVoiceToggle}
                    disabled={connectionState === "connecting"}
                    title={
                      connectionState === "connected"
                        ? "Stop voice session"
                        : connectionState === "connecting"
                          ? "Connecting..."
                          : "Start voice session"
                    }
                  >
                    {connectionState === "connecting" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent" />
                    ) : connectionState === "connected" ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                    <span className="ml-1 text-xs">
                      {connectionState === "connected"
                        ? "Voice On"
                        : connectionState === "connecting"
                          ? "Connecting"
                          : "Voice Off"
                      }
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearMessages}
                    title="Clear messages"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex items-center gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>                          {message.role === "assistant" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSpeak(message.content)}
                              disabled={!isConnected || isSpeaking}
                              title={
                                !isConnected
                                  ? "Start voice session first"
                                  : isSpeaking
                                    ? "Speaking..."
                                    : "Play message"
                              }
                            >
                              <Play className={`h-4 w-4 ${isSpeaking ? "animate-pulse" : ""} ${!isConnected ? "opacity-50" : ""}`} />
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Show loading indicator when AI is responding */}
                    {(status === 'submitted' || status === 'streaming') && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-sm text-muted-foreground">AI is typing...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Input */}
                  <form onSubmit={onSubmit} className="flex gap-2">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={status === 'submitted' || status === 'streaming'}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={status === 'submitted' || status === 'streaming' || !input.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>

                  {/* Error display */}
                  {error && (
                    <div className="text-red-500 text-sm mt-2">
                      Error: {error.message}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
