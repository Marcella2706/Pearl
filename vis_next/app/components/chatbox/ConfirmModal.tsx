"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  onConfirm: () => void
  showInput?: boolean
  inputValue?: string
  onInputChange?: (value: string) => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  showInput = false,
  inputValue = "",
  onInputChange,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md p-6 rounded-2xl shadow-2xl bg-background/95 backdrop-blur-md border border-border">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-foreground">
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription className="text-sm text-muted-foreground mt-1">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>

              {showInput && (
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => onInputChange?.(e.target.value)}
                  className="mt-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter new name"
                />
              )}

              <DialogFooter className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  className="min-w-20"
                >
                  {cancelLabel}
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={loading}
                  className="min-w-[90px] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {loading ? "Saving..." : confirmLabel}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export default ConfirmModal
