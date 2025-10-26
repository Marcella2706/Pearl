"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { ChatLayout } from "@/components/chatbox/Chat-Layout"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, Stethoscope } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatDetailPage() {
  const params = useParams()
  const chatId = params.id as string
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await fetch(`/api/chats/${chatId}`)
        const data = await response.json()
        setMessages(data.messages || [])
      } catch (error) {
        console.error("Error fetching chat:", error)
      } finally {
        setIsFetching(false)
      }
    }
    fetchChat()
  }, [chatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })
      const data = await response.json()
      if (data.reply) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <ChatLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      </ChatLayout>
    )
  }

  return (
    <ChatLayout>
      <div className="flex flex-col h-full bg-neutral-950 text-neutral-100">
        {/* Header */}
        <div className=" p-4 md:p-6 flex-shrink-0 bg-neutral-950 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <Stethoscope className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-neutral-100">JIVIKA</h1>
              <p className="text-sm text-neutral-400">Doctor AI Assistant</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-neutral-950">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-neutral-500">
              <p>Start a conversation with JIVIKA</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-100"
                  }`}
                >
                  <p className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-2xl">
                <Loader2 className="animate-spin text-indigo-500" size={20} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className=" p-4 md:p-6 bg-neutral-950 backdrop-blur flex-shrink-0">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFilesChange={(files) => setSelectedFiles(files)}
              selectedFiles={selectedFiles}
              onRemoveFile={(index) => {
                if (!selectedFiles) return
                const arr = Array.from(selectedFiles)
                arr.splice(index, 1)
                const dataTransfer = new DataTransfer()
                arr.forEach((f) => dataTransfer.items.add(f))
                setSelectedFiles(dataTransfer.files)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Ask JIVIKA anything..."
              className="min-h-[80px] resize-none bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder:text-neutral-500 text-sm md:text-base"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 md:px-4 self-end rounded-lg"
              size="icon"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </Button>
            <p className="text-xs text-neutral-500 mt-1">Press Shift + Enter for new line</p>
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}
