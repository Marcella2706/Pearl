import type React from "react"
import { Sidebar } from "./Sidebar"

export function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 md:ml-64 overflow-hidden flex flex-col bg-background">
        {children}
      </main>
    </div>
  )
}
