"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChatLayout } from "../components/chatbox/Chat-Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Stethoscope, 
  Loader2, 
  HeartPulse, 
  ImageIcon, 
  Activity,
  Droplet,
  Scale,
  ClipboardList,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { getAuthToken } from "@/lib/auth-utils";
import { Kbd } from "@/components/ui/kbd";
import { uploadImageToS3, UploadResult } from "@/lib/aws";
import { HeartForm } from "./HeartForm";
import { DiabetesForm } from "./DiabetesForm";
import { SymptomForm } from "./SymptomForm";
import { BMIForm } from "./BMIForm";
import { BloodPressureForm } from "./BloodPressureForm";
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
  const [selectedTag, setSelectedTag] = useState<"heart" | "xray" | "diabetes" | "symptoms" | "bmi" | "bloodpressure" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!message.trim() && (!selectedFiles || selectedFiles.length === 0)) return
    
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
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/sessions/`, 
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      }
      );
      const data = await response.data;
      if (data.id) {
        const requestBody: any = { content: message }
        if (imageUrl) requestBody.imageURL = imageUrl
        if (selectedTag === "heart") requestBody.tag = "heart"
        else if (selectedTag === "xray") requestBody.tag = "xray"
        const messageResponse = await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/sessions/${data.id}/chat`, requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
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
   const handleTagClick = (tag: "heart" | "xray" | "diabetes" | "symptoms" | "bmi" | "bloodpressure") => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      if (tag === "xray") setSelectedFiles(null);
      return;
    }
    setSelectedTag(tag);
    if (tag === "heart" || tag === "diabetes" || tag === "symptoms" || tag === "bmi" || tag === "bloodpressure") {
      setSelectedFiles(null);
    } else if (tag === "xray" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFormSubmit = (prompt: string) => {
    setMessage(prompt);
    setSelectedTag(null);
  };
  const handleSuggestionClick = (suggestion: string) => setMessage(suggestion);

  return (
    <ChatLayout>
      <div className="flex flex-col h-full bg-background">
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
                fileInputRef={fileInputRef}
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
             <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 text-xs px-3 py-1 rounded-full"
                    disabled={isLoading}
                  >
                    <Activity className="w-4 h-4" />
                    {selectedTag ? (
                      selectedTag === "heart" ? "Heart Health" :
                      selectedTag === "diabetes" ? "Diabetes" :
                      selectedTag === "symptoms" ? "Symptoms" :
                      selectedTag === "bmi" ? "BMI Calculator" :
                      selectedTag === "bloodpressure" ? "Blood Pressure" :
                      "X-ray / Wound"
                    ) : "Health Tools"}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => handleTagClick("heart")}>
                    <HeartPulse className="w-4 h-4 mr-2" />
                    Heart Health Assessment
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTagClick("diabetes")}>
                    <Droplet className="w-4 h-4 mr-2" />
                    Diabetes Risk Check
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTagClick("bloodpressure")}>
                    <Activity className="w-4 h-4 mr-2" />
                    Blood Pressure Analysis
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTagClick("bmi")}>
                    <Scale className="w-4 h-4 mr-2" />
                    BMI Calculator
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTagClick("symptoms")}>
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Symptom Checker
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleTagClick("xray")}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload X-ray / Wound Image
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
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
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}

      {selectedTag === "diabetes" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-lg">
            <DiabetesForm
              isOpen={true}
              onClose={() => setSelectedTag(null)}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}

      {selectedTag === "symptoms" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-lg">
            <SymptomForm
              isOpen={true}
              onClose={() => setSelectedTag(null)}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}

      {selectedTag === "bmi" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-lg">
            <BMIForm
              isOpen={true}
              onClose={() => setSelectedTag(null)}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}

      {selectedTag === "bloodpressure" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-lg">
            <BloodPressureForm
              isOpen={true}
              onClose={() => setSelectedTag(null)}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}
    </ChatLayout>
  );
}