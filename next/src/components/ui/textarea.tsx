"use client"

import * as React from "react"
import { Paperclip, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onFilesChange?: (files: FileList) => void
  selectedFiles?: FileList | null
  onRemoveFile?: (index: number) => void
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onFilesChange, selectedFiles, onRemoveFile, ...props }, ref) => {
    const fileInputRef = React.useRef<HTMLInputElement | null>(null)

    const handleFileButtonClick = () => {
      fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && onFilesChange) {
        const newFiles = Array.from(e.target.files)
        let allFiles: FileList

        if (selectedFiles && selectedFiles.length > 0) {
          const combined = [...Array.from(selectedFiles), ...newFiles]
          const dataTransfer = new DataTransfer()
          combined.forEach((file) => dataTransfer.items.add(file))
          allFiles = dataTransfer.files
        } else {
          allFiles = e.target.files
        }

        onFilesChange(allFiles)
      }
    }

    return (
      <div className="relative flex flex-col w-full">
        {/* Selected Files Preview */}
        {selectedFiles && selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {Array.from(selectedFiles).map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border border-neutral-700 bg-neutral-900 rounded-md px-2 py-1 text-xs text-neutral-300"
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-8 w-8 object-cover rounded-sm"
                  />
                ) : (
                  <div className="truncate max-w-[120px]">
                    📄 {file.name}
                  </div>
                )}
                <button
                  onClick={() => onRemoveFile && onRemoveFile(index)}
                  className="text-neutral-500 hover:text-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea + File Upload */}
        <div className="relative flex items-start gap-2">
          <textarea
            ref={ref}
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 pr-10 text-sm text-neutral-200 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*,application/pdf,.doc,.docx,.txt"
            className="hidden"
          />

          <button
            type="button"
            onClick={handleFileButtonClick}
            className="absolute bottom-2 right-2 rounded-md p-1 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <Paperclip className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
