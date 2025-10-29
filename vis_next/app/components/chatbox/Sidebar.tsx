"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  Plus,
  User,
  X,
  MessageSquare,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"

interface ChatItem {
  id: string
  title: string
  createdAt: string
}

interface SidebarProps {
  isMobile: boolean
}

export function Sidebar({ isMobile }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [chats, setChats] = useState<ChatItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true)
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("__Pearl_Token")
            : null

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/sessions`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        )

        const data = response.data

        // Normalize response shape:
        // - some endpoints return an array of sessions
        // - others may return { chats: [...] }
        const sessions = Array.isArray(data) ? data : data?.chats || []

        const normalized: ChatItem[] = sessions.map((s: any) => ({
          id: s.id,
          title: s.title || "Untitled",
          // convert snake_case created_at to createdAt if present
          createdAt: s.created_at ?? s.createdAt ?? "",
        }))

        setChats(normalized)
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

  const handleNewChat = () => { 
    let response=axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/sessions`,
    {},
    {
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${localStorage.getItem('__Pearl_Token')}`,
      },
    }
    ).then((res)=>{
      const data=res.data;
      if(data.id){
        window.location.href=`/chat/${data.id}`;
      }
    }).catch((error)=>{
      console.error("Error creating new chat:",error);
    });
  }
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card hover:bg-accent text-foreground transition-colors"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <aside
          className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground transform transition-transform duration-300 z-40 flex flex-col ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 mt-16">
            <h1 className="text-2xl font-bold text-sidebar-primary">JIVIKA</h1>
            <p className="text-xs text-muted-foreground">Doctor AI Assistant</p>
          </div>

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
                    <Loader2
                      className="animate-spin text-muted-foreground"
                      size={20}
                    />
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
          </div>
        </aside>

        {/* Overlay Background */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </>
    )
  }

  // Desktop Sidebar (non-mobile)
  return (
    <aside className="h-full flex flex-col bg-sidebar text-sidebar-foreground">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-sidebar-primary">JIVIKA</h1>
        <p className="text-xs text-muted-foreground">Doctor AI Assistant</p>
      </div>

      <div className="p-4 border-b border-sidebar-border">
        <Link href="/chat" className="w-full">
          <Button
            variant="default"
            className="w-full justify-start gap-3 bg-background hover:bg-sidebar-accent text-foreground"
            onClick={handleNewChat}
          >
            <Plus size={20} />
            New Chat
          </Button>
        </Link>
      </div>

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
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
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
      </div>
    </aside>
  )
}
