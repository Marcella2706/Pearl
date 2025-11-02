"use client"

import { ChatLayout } from "@/app/components/chatbox/Chat-Layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import MessageComponent from "@/app/components/Common/MessageComponent"
import { Send, Loader2, Stethoscope, Bot, HeartPulse, Image as ImageIcon, File as FileIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { uploadImageToS3, UploadResult } from "@/lib/aws"
import { Kbd } from "@/components/ui/kbd"
import { getAuthToken } from "@/lib/auth-utils"
import { HeartForm } from "./HeartForm"

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
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedTag, setSelectedTag] = useState<"heart" | "xray" | null>(null)


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      const firstFile = selectedFiles[0];
      const isImage = firstFile.type.startsWith("image/");
      if (isImage) {
        setSelectedTag("xray");
      } else {
        setSelectedTag(null);
      }
    } else {
      setSelectedTag(null);
    }
  }, [selectedFiles]);
  

  const handleSendMessage = async () => {
    if (!input.trim() && (!selectedFiles || selectedFiles.length === 0)) return
    let imageUrl = ""
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0]
      try {
        const uploadResult: UploadResult = await uploadImageToS3(file)
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url
        } else {
          console.error("Image upload failed:", uploadResult.error)
          return
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        return
      }
    }
    let messageType: "text" | "image" | "text_with_image" = "text"
    if (imageUrl && input.trim()) messageType = "text_with_image"
    else if (imageUrl) messageType = "image"
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
    setSelectedTag(null)
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
      const requestBody: any = { content: userMessage.content }
      if (imageUrl) requestBody.imageURL = imageUrl
      if (selectedTag === "heart") requestBody.tag = "heart"
      else if (selectedTag === "xray") requestBody.tag = "xray"
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
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      if (!response.body) throw new Error("No response body")
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let partialData = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
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
                        isPrediction: chunk.type === "prediction" ? true : msg.isPrediction,
                      }
                    : msg
                )
              )
            } else if (chunk.type === "image") {
              const imgMessage: Message = {
                id: (Date.now() + Math.random()).toString(),
                role: "assistant",
                content: "",
                timestamp: new Date(),
                imageUrl: chunk.content,
                messageType: "image",
                isThinking: false,
              }
              setMessages((prev) => [...prev, imgMessage])
            } else if (chunk.type === "error") {
              if (chunk.content !== "the connection is closed") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantId
                      ? {
                          ...msg,
                          content: msg.content + `\n\n[ERROR: ${chunk.content}]`,
                          isThinking: false,
                        }
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
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId && msg.isThinking ? { ...msg, isThinking: false } : msg
        )
      )
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
      setSelectedTag(null)
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
    if (arr.length === 0) setSelectedTag(null)
  }

  const handleTagClick = (tag: "heart" | "xray") => {
    if (selectedTag === tag) {
      setSelectedTag(null)
      if (tag === "xray") setSelectedFiles(null)
      return
    }
    setSelectedTag(tag)
    if (tag === "heart") setSelectedFiles(null)
    else if (tag === "xray" && fileInputRef.current) fileInputRef.current.click()
  }

  const handleHeartSubmit = (prompt: string) => {
    setInput(prompt)
    setSelectedTag(null)
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
              <p className="text-center max-w-md">
                Ask JIVIKA any health-related questions and get AI-powered medical assistance.
              </p>
            </div>
          ) : (
            messages.map((message) => <MessageComponent key={message.id} message={message} />)
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 md:p-6 bg-background backdrop-blur shrink-0">
          <div className="max-w-4xl mx-auto flex flex-col gap-3">
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-2">
                {Array.from(selectedFiles).map((file, index) => {
                  const isImage = file.type.startsWith("image/")
                  const isPDF = file.type === "application/pdf"
                  return (
                    <div
                      key={index}
                      className="relative w-20 h-20 border rounded-lg overflow-hidden group flex items-center justify-center bg-foreground/5"
                    >
                      {isImage && (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="object-cover w-full h-full"
                        />
                      )}
                      {isPDF && (
                        <div className="flex flex-col items-center justify-center text-center p-2">
                          <FileIcon className="w-6 h-6 text-red-600 mb-1" />
                          <p className="text-[10px] text-foreground-muted font-medium truncate max-w-16">
                            {file.name}
                          </p>
                        </div>
                      )}
                      {!isImage && !isPDF && (
                        <div className="flex flex-col items-center justify-center text-center p-2">
                          <FileIcon className="w-6 h-6 text-muted-foreground mb-1" />
                          <p className="text-[10px] text-foreground-muted font-medium truncate max-w-16">
                            {file.name}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[20px] leading-none opacity-80 hover:opacity-100 transition"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
            <input
              type="file"
              accept="image/*,application/pdf"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                const files = e.target.files
                if (files && files.length > 0) setSelectedFiles(files)
              }}
            />
            <div className="flex items-end relative">
              <Textarea
                ref={(el) => {
                  if (el) {
                    el.style.height = "auto"
                    el.style.height = `${el.scrollHeight}px`
                  }
                }}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  const el = e.target
                  el.style.height = "auto"
                  el.style.height = `${el.scrollHeight}px`
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Ask JIVIKA anything..."
                className="min-h-20 max-h-60 resize-none overflow-y-auto transition-all"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={
                  (!input.trim() && (!selectedFiles || selectedFiles.length === 0)) || isLoading
                }
                className="bg-accent hover:bg-accent-hover text-background ml-2 px-4 md:px-4 self-end mb-1"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} className="text-foreground"/>
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedTag === "heart" ? "default" : "outline"}
                onClick={() => handleTagClick("heart")}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                disabled={isLoading}
              >
                <HeartPulse className="w-4 h-4" /> Heart
              </Button>
              <Button
                size="sm"
                variant={selectedTag === "xray" ? "default" : "outline"}
                onClick={() => handleTagClick("xray")}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                disabled={isLoading}
              >
                <ImageIcon className="w-4 h-4" /> X-ray / Wound Image
              </Button>
            </div>
            <p className="text-xs text-foreground-muted mt-1">
              Press <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd> for new line
            </p>
          </div>
        </div>
      </div>
      {selectedTag === "heart" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-lg">
            <HeartForm
              isOpen={true}
              onClose={() => setSelectedTag(null)}
              onSubmit={handleHeartSubmit}
            />
          </div>
        </div>
      )}
    </ChatLayout>
  )
}
