"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, MessageCircle, X, Trash2 } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"

// Custom components for ReactMarkdown
const markdownComponents = {
  a: ({ href, children, ...props }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors duration-200 font-medium"
      {...props}
    >
      {children}
    </a>
  ),
  p: ({ children }: any) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),
  strong: ({ children }: any) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }: any) => (
    <em className="italic text-muted-foreground">{children}</em>
  )
}


// Helper function to format tool names for display
const formatToolName = (toolName: string): string => {
  return toolName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim();
};

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)


  const { messages, input, handleInputChange, handleSubmit, status, error, setMessages } = useChat({
    onError: (error) => {
      console.error("Chat error:", error)
    },
    maxSteps: 3,
    initialMessages: [{
      id: "1",
      role: "system",
      content: "👋 Hey there! I'm Emjay's AI assistant. I can help you learn about his background, projects, skills, and experience. "
    }]
  })

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
        role: "system",
        content: "👋 Hey there! I'm Emjay's AI assistant. I can help you learn about his background, projects, skills, and experience. Feel free to ask me anything about his portfolio, GitHub projects, or professional journey!"
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
              onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl mx-auto"
            >
              <Card className="h-[70vh] md:h-[80vh] max-h-[700px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg">Let's Chat!</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearMessages}
                      title="Clear messages"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
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
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >                          <div
                          className={`max-w-[85%] p-3 rounded-lg overflow-hidden ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                        >
                            {/* Render message parts if available, otherwise fall back to content */}
                            {message.parts && message.parts.length > 0 ? (
                              <div className="space-y-2">
                                {message.parts.map((part, partIndex) => {
                                  switch (part.type) {
                                    case 'text':
                                      return (
                                        <div key={partIndex} className="text-sm prose prose-sm max-w-none dark:prose-invert prose-p:m-0 prose-p:leading-relaxed">
                                          <ReactMarkdown components={markdownComponents}>{part.text}</ReactMarkdown>
                                        </div>
                                      );
                                    case 'tool-invocation':
                                      const { toolInvocation } = part;
                                      return (
                                        <div key={partIndex} className="space-y-2">                                          {toolInvocation.state === 'partial-call' && (
                                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <div className="flex space-x-1">
                                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                            </div>
                                            <span>Preparing {formatToolName(toolInvocation.toolName)}...</span>
                                          </div>
                                        )}
                                          {toolInvocation.state === 'call' && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                              <div className="flex space-x-1">
                                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
                                              </div>
                                              <span>🔧 Calling {formatToolName(toolInvocation.toolName)}...</span>
                                            </div>
                                          )}
                                          {toolInvocation.state === 'result' && (
                                            <div className="text-xs text-muted-foreground mb-1">
                                              <span className="inline-flex items-center gap-1">
                                                ✅ <span className="font-medium">{formatToolName(toolInvocation.toolName)}</span> completed
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    default:
                                      return null;
                                  }
                                })}
                              </div>) : (
                              // Backward compatibility: show content if no parts
                              <div className="text-sm prose prose-sm max-w-none dark:prose-invert prose-p:m-0 prose-p:leading-relaxed">
                                <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>                    {/* Show loading indicator when AI is responding */}
                    {(status === 'submitted' || status === 'streaming') && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[85%] p-3 rounded-lg bg-muted overflow-hidden">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                            </div>                            <span className="text-sm text-muted-foreground">
                              {(() => {
                                // Check if the last message has any tool invocations in progress
                                const lastMessage = messages[messages.length - 1];
                                if (lastMessage?.parts) {
                                  const toolInvocations = lastMessage.parts.filter(part => part.type === 'tool-invocation');
                                  const activeTool = toolInvocations.find(part =>
                                    part.toolInvocation?.state === 'call' || part.toolInvocation?.state === 'partial-call'
                                  );
                                  if (activeTool) {
                                    return `Using ${formatToolName(activeTool.toolInvocation.toolName)}...`;
                                  }
                                }
                                return "AI is thinking...";
                              })()}
                            </span>
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
                      placeholder="Ask me about Emjay's projects, skills, or experience..."
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
          </motion.div>)}
      </AnimatePresence>
    </>
  )
}
