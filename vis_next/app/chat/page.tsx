"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatLayout } from "../components/chatbox/Chat-Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Stethoscope, Loader2 } from "lucide-react";
import axios from "axios";
const SUGGESTIONS = [
  "What are symptoms of flu?",
  "How to manage stress?",
  "Tips for better sleep",
  "Common cold remedies",
];

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const username = "User";

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/sessions`, 
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('__Pearl_Token')}`,
        },
      }
      );
      const data = await response.data;
      if (data.id) {
        const messageResponse = await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/sessions/${data.id}/chat`, 
        {
          content: message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('__Pearl_Token')}`,
          },
        }
        );
        const messageData = await messageResponse.data;
        router.push(`/chat/${data.chatId}`);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setIsLoading(false);
    }
  };
  interface ChangeEvent {
    target: HTMLTextAreaElement;
  }

  interface FilesChangeHandler {
    (files: FileList | null): void;
  }

  interface RemoveFileHandler {
    (index: number): void;
  }

  interface KeyDownEvent {
    key: string;
    shiftKey: boolean;
    preventDefault: () => void;
  }

  const handleChange: (e: ChangeEvent) => void = (e) =>
    setMessage(e.target.value);

  const handleFilesChange: FilesChangeHandler = (files) =>
    setSelectedFiles(files);

  const handleRemoveFile: RemoveFileHandler = (index) => {
    if (!selectedFiles) return;
    const arr = Array.from(selectedFiles);
    arr.splice(index, 1);
    const dataTransfer = new DataTransfer();
    arr.forEach((f) => dataTransfer.items.add(f));
    setSelectedFiles(dataTransfer.files);
  };

  const handleKeyDown = (e: KeyDownEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => setMessage(suggestion);

  return (
    <ChatLayout>
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="p-4 md:p-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Stethoscope className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                JIVIKA
              </h1>
              <p className="text-sm text-muted-foreground">
                Your AI Doctor Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Hello, {username}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                How can I help you today?
              </p>
            </div>

            {/* Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="p-4 rounded-lg bg-card border border-border hover:border-primary hover:bg-accent transition-all text-left group"
                >
                  <p className="text-foreground group-hover:text-primary transition-colors text-sm md:text-base">
                    {s}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className=" p-4 md:p-6 bg-background shrink-0">
          <div className="max-w-2xl mx-auto flex flex-col gap-2">
            <div className="flex">
              <Textarea
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your health..."
                className="min-h-20 resize-none"
                disabled={isLoading}
                selectedFiles={selectedFiles}
                onFilesChange={handleFilesChange}
                onRemoveFile={handleRemoveFile}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground mb-5 ml-2 px-4 md:px-4 self-end"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </Button>
            </div>

            {/* File input and selected files list (separate from Textarea to avoid passing unknown props)
            <div className="flex items-center justify-between gap-4 mt-2">
              <input
                type="file"
                multiple
                onChange={(e) => handleFilesChange((e.target as HTMLInputElement).files)}
                className="text-sm text-muted-foreground"
                disabled={isLoading}
              />
              <div className="flex-1">
                {selectedFiles && selectedFiles.length > 0 && (
                  <ul className="flex gap-2 overflow-x-auto mt-1">
                    {Array.from(selectedFiles).map((f, idx) => (
                      <li key={idx} className="bg-card border border-border px-2 py-1 rounded text-xs text-foreground flex items-center gap-2">
                        <span className="truncate max-w-[200px]">{f.name}</span>
                        <button
                          onClick={() => handleRemoveFile(idx)}
                          className="text-xs text-destructive hover:underline"
                          type="button"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div> */}

            <p className="text-xs text-muted-foreground mt-1">
              Press Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}
