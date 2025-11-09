"use client"

import * as React from "react"
import { Paperclip, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onFilesChange?: (files: FileList) => void
  selectedFiles?: FileList | null
  onRemoveFile?: (index: number) => void
  fileInputRef?: React.RefObject<HTMLInputElement | null>
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onFilesChange, selectedFiles, onRemoveFile, fileInputRef: externalFileInputRef, ...props }, ref) => {
    const internalFileInputRef = React.useRef<HTMLInputElement | null>(null)
    const fileInputRef = externalFileInputRef || internalFileInputRef

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
                className="flex items-center gap-2 border border-border bg-card rounded-md px-2 py-1 text-xs text-foreground shadow-sm"
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-8 w-8 object-cover rounded-sm"
                  />
                ) : (
                  <div className="truncate max-w-[120px] text-muted-foreground flex items-center gap-1">
                    📄 {file.name}
                  </div>
                )}
                <button
                  onClick={() => onRemoveFile && onRemoveFile(index)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  type="button"
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
              "flex min-h-20 w-full resize-none rounded-md border border-border bg-card px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
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
            className="absolute bottom-2 right-2 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
