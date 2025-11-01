"use client"

import { ChatLayout } from "@/app/components/chatbox/Chat-Layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import MessageComponent, { MessageData } from "@/app/components/Common/MessageComponent"
import { Send, Loader2, Stethoscope, Bot } from "lucide-react"
import { useParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { uploadImageToS3, UploadResult } from "@/lib/aws" 
import { Kbd } from "@/components/ui/kbd"
import { getAuthToken } from "@/lib/auth-utils"

interface StreamChunk {
  type: "message" | "prediction" | "error" | "image"
  content: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isThinking?: boolean
  imageUrl?: string
  messageType?: "text" | "image" | "text_with_image"
  isPrediction?: boolean
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
      if (!chatId) return
      setIsFetching(true)
      try {

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/sessions/${chatId}/messages`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        )
        
        const fetchedMessages: Message[] = response.data.map((msg: any) => ({
          id: msg.id,
          role: msg.role === "human" ? "user" : "assistant",
          content: msg.content,
          timestamp: new Date(msg.created_at), 
          // If your backend stored images as ai content URLs, you may want to set messageType/imageUrl here.
        }))
        
        setMessages(fetchedMessages)
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
    if (!input.trim() && (!selectedFiles || selectedFiles.length === 0)) return

    let imageUrl = "";
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0]; 
      try {
        const uploadResult: UploadResult = await uploadImageToS3(file);
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else {
          console.error("Image upload failed:", uploadResult.error);
          return;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    let messageType: "text" | "image" | "text_with_image" = "text";
    if (imageUrl && input.trim()) {
      messageType = "text_with_image";
    } else if (imageUrl) {
      messageType = "image";
    } 

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      imageUrl: imageUrl || undefined,
      messageType,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setSelectedFiles(null) 
    setIsLoading(true)

    const assistantId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "", 
      timestamp: new Date(),
      isThinking: true, 
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      const requestBody: any = {
        content: userMessage.content,
      };

      if (imageUrl) {
        requestBody.imageURL = imageUrl;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/sessions/${chatId}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify(requestBody),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error("No response body")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let partialData = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }

          partialData += decoder.decode(value, { stream: true })
          const lines = partialData.split("\n")
          partialData = lines.pop() || ""

          for (const line of lines) {
            if (!line.trim()) continue
            
            try {
              const chunk: StreamChunk = JSON.parse(line)
              
              if (chunk.type === "message" || chunk.type === "prediction") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantId
                      ? { 
                          ...msg, 
                          content: msg.content + chunk.content, 
                          isThinking: false,
                          isPrediction: chunk.type === "prediction" ? true : msg.isPrediction
                        }
                      : msg
                  )
                )
              } else if (chunk.type === "image") {
                // Create a separate assistant message for each image chunk so they display correctly.
                const imgMessage: Message = {
                  id: (Date.now() + Math.random()).toString(),
                  role: "assistant",
                  content: "", // optional caption could be added
                  timestamp: new Date(),
                  imageUrl: chunk.content,
                  messageType: "image",
                  isThinking: false,
                }
                setMessages((prev) => [...prev, imgMessage])
              } else if (chunk.type === "error") {
                console.warn("Stream error received:", chunk.content)
                if (chunk.content !== "the connection is closed") {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantId
                        ? { ...msg, content: msg.content + `\n\n[ERROR: ${chunk.content}]`, isThinking: false }
                        : msg
                    )
                  )
                }
              }
            } catch (e) {
              console.error("Error parsing stream chunk:", line, e)
            }
          }
        }
      } catch (readerError) {
        console.error("Stream reading error:", readerError)
      } finally {
        // Ensure assistant thinking flag is cleared
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId && msg.isThinking
              ? { ...msg, isThinking: false }
              : msg
          )
        )
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: "Sorry, an error occurred. Please try again.", isThinking: false }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilesChange = (files: FileList | null) => setSelectedFiles(files)

  const handleRemoveFile = (index: number) => {
    if (!selectedFiles) return
    const arr = Array.from(selectedFiles)
    arr.splice(index, 1)
    const dataTransfer = new DataTransfer()
    arr.forEach((f) => dataTransfer.items.add(f))
    setSelectedFiles(dataTransfer.files)
  }

  if (isFetching) {
    return (
      <ChatLayout>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-accent" size={32} />
            <p className="text-foreground-muted text-sm">Loading conversation...</p>
          </div>
        </div>
      </ChatLayout>
    )
  }

  return (
    <ChatLayout>
      <div className="flex flex-col h-full bg-background text-foreground">
        <div className="p-4 md:p-6 shrink-0 bg-background backdrop-blur border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-foreground/10 rounded-lg">
              <Stethoscope className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">JIVIKA</h1>
              <p className="text-sm text-foreground-muted">Doctor AI Assistant</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-background">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-foreground-muted">
              <div className="p-4 bg-foreground/10 rounded-full mb-4">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Start a conversation</h3>
              <p className="text-center max-w-md">Ask JIVIKA any health-related questions and get AI-powered medical assistance.</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 md:p-6 bg-background backdrop-blur shrink-0">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            <div className="flex">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Ask JIVIKA anything..."
                className="min-h-20 resize-none"
                disabled={isLoading}
                selectedFiles={selectedFiles}
                onFilesChange={handleFilesChange}
                onRemoveFile={handleRemoveFile}
              />
              <Button
                onClick={handleSendMessage}
                disabled={(!input.trim() && (!selectedFiles || selectedFiles.length === 0)) || isLoading}
                className="bg-accent hover:bg-accent-hover text-background mb-5 ml-2 px-4 md:px-4 self-end"
                size="icon"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </Button>
            </div>

            <p className="text-xs text-foreground-muted mt-1">
              Press <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd> for new line
            </p>
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}