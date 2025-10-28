"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChatLayout } from "@/components/chatbox/Chat-Layout"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Stethoscope, Loader2 } from "lucide-react"

const SUGGESTIONS = [
  "What are symptoms of flu?",
  "How to manage stress?",
  "Tips for better sleep",
  "Common cold remedies",
]

export default function ChatPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const username = "User"

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initialMessage: message }),
      })
      const data = await response.json()
      if (data.chatId) router.push(`/chat/${data.chatId}`)
    } catch (error) {
      console.error("Error creating chat:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => setMessage(suggestion)

  return (
    <ChatLayout>
      <div className="flex flex-col h-full bg-gray-950">
        {/* Header */}
        <div className="p-4 md:p-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-900/30 rounded-lg">
              <Stethoscope className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-100">JIVIKA</h1>
              <p className="text-sm text-gray-400">Your AI Doctor Assistant</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-400">
                Hello, {username}
              </h2>
              <p className="text-base md:text-lg text-gray-400">
                How can I help you today?
              </p>
            </div>

            {/* Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="p-4 rounded-lg bg-gray-900 border border-gray-800 hover:border-indigo-500 hover:bg-gray-800 transition-all text-left group"
                >
                  <p className="text-gray-100 group-hover:text-indigo-400 transition-colors text-sm md:text-base">
                    {s}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className=" p-4 md:p-6 bg-gray-950 flex-shrink-0">
          <div className="max-w-2xl mx-auto flex flex-col gap-2">
            <div className="flex">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
                placeholder="Ask me anything about your health..."
                className="min-h-[80px] resize-none bg-gray-900 border border-gray-800 text-gray-100 placeholder:text-gray-500 text-sm md:text-base"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white mb-5 ml-2 px-4 md:px-4 self-end"
                size="icon"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Press Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}
