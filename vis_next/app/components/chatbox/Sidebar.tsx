"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Plus, User, Settings, X, MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatItem {
  id: string
  title: string
  createdAt: string
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [chats, setChats] = useState<ChatItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("http://127.0.0.1:8000/sessions/")
        const data = await response.json()
        setChats(data.chats || [])
      } catch (error) {
        console.error("Error fetching chats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChats()
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card hover:bg-accent text-foreground md:hidden transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground transition-transform duration-300 z-40 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="p-4 ">
          <h1 className="text-2xl font-bold text-sidebar-primary">JIVIKA</h1>
          <p className="text-xs text-muted-foreground">Doctor AI Assistant</p>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-sidebar-border">
          <Link href="/chat" className="w-full">
            <Button
              variant="default"
              className="w-full justify-start gap-3 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
            >
              <Plus size={20} />
              New Chat
            </Button>
          </Link>
        </div>

        {/* Chat History */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Chat History
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="px-2 space-y-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-muted-foreground" size={20} />
                </div>
              ) : chats.length === 0 ? (
                <p className="text-xs text-muted-foreground px-2 py-4 text-center">
                  No chats yet
                </p>
              ) : (
                chats.map((chat) => (
                  <Link key={chat.id} href={`/chat/${chat.id}`}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm truncate ${
                        isActive(`/chat/${chat.id}`)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                      title={chat.title}
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare
                          size={16}
                          className="shrink-0 text-sidebar-primary"
                        />
                        <span className="truncate">{chat.title}</span>
                      </div>
                    </button>
                  </Link>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Link href="/profile" className="w-full">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                isActive("/profile")
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <User size={20} />
              Profile
            </Button>
          </Link>

          <Link href="/settings" className="w-full">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                isActive("/settings")
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Settings size={20} />
              Settings
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
