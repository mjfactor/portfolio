"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, MessageCircle, X } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, status, error } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Hi! I'm excited to learn about your project. How can I help you today?"
      }
    ]
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status !== 'ready') return
    handleSubmit(e)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && status === 'ready') {
        const form = e.currentTarget.closest('form')
        if (form) {
          handleSubmit(e as any)
        }
      }
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Start a Conversation
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
              className="w-full max-w-md"
            >
              <Card className="h-[500px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg">Let's Chat!</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
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
                      disabled={status !== 'ready'}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={status !== 'ready' || !input.trim()}
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
