"use client"

import React, { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"

export function ChatLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(260)
  const [isResizing, setIsResizing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || isMobile) return
    const newWidth = e.clientX
    if (newWidth > 180 && newWidth < 600) setSidebarWidth(newWidth)
  }

  const handleMouseUp = () => setIsResizing(false)

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    } else {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, isMobile])

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">

      <div
        style={{
          width: isMobile ? "0px" : `${sidebarWidth}px`,
        }}
        className="relative shrink-0 border-r border-border bg-background hidden md:block"
      >
        <Sidebar isMobile={false} />

    
        {!isMobile && (
          <div
            onMouseDown={handleMouseDown}
            className="absolute top-0 right-0 w-1 cursor-col-resize h-full bg-transparent hover:bg-muted transition-colors"
          />
        )}
      </div>

      {isMobile && <Sidebar isMobile={true} />}

      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        {children}
      </main>
    </div>
  )
}
