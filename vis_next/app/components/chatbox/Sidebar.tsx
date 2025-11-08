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
  LogOut,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Trash2,
  Newspaper,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { removeAuthToken, getAuthToken } from "@/lib/auth-utils"
import ConfirmModal from "./ConfirmModal"

interface ChatItem {
  id: string
  title: string
  createdAt: string
}

interface SidebarProps {
  isMobile: boolean
  onCollapseChange?: (isCollapsed: boolean) => void
}

export function Sidebar({ isMobile, onCollapseChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [chats, setChats] = useState<ChatItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null)
  const [newTitle, setNewTitle] = useState("")


  // Notify parent when collapse state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed)
    }
  }, [isCollapsed, onCollapseChange])

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/current-user`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        console.log("Fetched user:", data)
        setUser(data)
      } else {
        console.error("Failed to fetch user:", res.status)
      }
    }
    fetchUser()
  }, [])
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true)
        const token = getAuthToken()

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/sessions/`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        )

        const data = response.data

   
        const sessions = Array.isArray(data) ? data : data?.chats || []

        const normalized: ChatItem[] = sessions.map((s: any) => ({
          id: s.id,
          title: s.title || "Untitled",
        
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
    let response=axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/sessions/`,
    {},
    {
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${getAuthToken()}`,
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

  const handleLogout = () => {
    removeAuthToken()
    window.location.href = "/auth" 
  }

  const handleOpenRename = (chat: ChatItem) => {
    setSelectedChat(chat)
    setNewTitle(chat.title)
    setShowRenameModal(true)
  }
  
  const handleOpenDelete = (chat: ChatItem) => {
    setSelectedChat(chat)
    setShowDeleteModal(true)
  }
  
  const confirmRename = async () => {
    if (!selectedChat) return
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/sessions/${selectedChat.id}`,
        { title: newTitle },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      )
      setChats((prev) => {
        const updated = prev.map((c) =>
          c.id === selectedChat.id ? { ...c, title: newTitle } : c
      )
        return updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      })
      
    } catch (error) {
      console.error("Error updating title:", error)
    } finally {
      setShowRenameModal(false)
    }
  }
  
  const confirmDelete = async () => {
    if (!selectedChat) return
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/sessions/${selectedChat.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      )
      setChats((prev) => prev.filter((c) => c.id !== selectedChat.id))
    } catch (error) {
      console.error("Error deleting chat:", error)
    } finally {
      setShowDeleteModal(false)
    }
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

          <div className="p-4 border-b border-sidebar-border space-y-3">
            <Link href="/chat" className="w-full">
              <Button
                variant="default"
                className="w-full justify-start gap-3 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
              >
                <Plus size={20} />
                New Chat
              </Button>
            </Link>
            
            <Link href="/explore" className="w-full">
              <Button
                variant="default"
                className={`w-full mt-2 justify-start gap-3 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground`}
              >
                <MapPin size={20} />
                Explore Hospitals
              </Button>
            </Link>
            <Link href="/news" className="w-full">
              <Button
                variant="default"
                className={`w-full mt-2 justify-start gap-3 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground`}
              >
                <Newspaper size={20} />
                Explore News
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
                          <span className="truncate max-w-[135px]">{chat.title}</span>
                          <span
  onClick={(e) => {
    e.preventDefault()
    handleOpenRename(chat)
  }}
  className="cursor-pointer text-muted-foreground hover:text-primary"
  title="Rename Chat"
>
  <Pencil size={12} />
</span>
<span
  onClick={(e) => {
    e.preventDefault()
    handleOpenDelete(chat)
  }}
  className="cursor-pointer text-muted-foreground hover:text-red-500"
  title="Delete Chat"
>
  <Trash2 size={12} />
</span>
                        </div>
                      </button>
                    </Link>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="p-4 border-t border-sidebar-border space-y-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={user?.profilePhoto} alt={user?.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium truncate max-w-[120px]">
                        {user?.name || "Unnamed User"}
                      </span>
                    </div>
                  </div>
                  <ChevronUp size={16} className="shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User size={16} />
                    View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700">
                  <LogOut size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
        <ConfirmModal
  open={showRenameModal}
  onOpenChange={setShowRenameModal}
  title="Rename Chat"
  description="Enter a new title for this chat."
  confirmLabel="Save"
  showInput
  inputValue={newTitle}
  onInputChange={setNewTitle}
  onConfirm={confirmRename}
/>

<ConfirmModal
  open={showDeleteModal}
  onOpenChange={setShowDeleteModal}
  title="Delete Chat?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  onConfirm={confirmDelete}
/>

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

  if (isCollapsed && !isMobile) {
    return (
      <aside className="h-full flex flex-col bg-sidebar text-sidebar-foreground w-16 border-r border-sidebar-border">
        <div className="p-2 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="h-10 w-10 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        <div className="p-2 border-b border-sidebar-border flex flex-col items-center space-y-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleNewChat}
            className="h-10 w-10 bg-background hover:bg-sidebar-accent text-foreground"
          >
            <Plus size={20} />
          </Button>
          
          <Link href="/explore">
            <Button
              variant="default"
              size="sm"
              className="h-10 w-10 bg-background hover:bg-sidebar-accent text-foreground"
            >
              <MapPin size={20} />
            </Button>
          </Link>
          
          <Link href="/news">
            <Button
              variant="default"
              size="sm"
              className="h-10 w-10 bg-background hover:bg-sidebar-accent text-foreground"
            >
              <Newspaper size={20} />
            </Button>
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center py-4 space-y-2">
          {chats.slice(0, 4).map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className={`h-10 w-10 ${
                  isActive(`/chat/${chat.id}`)
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <MessageSquare size={16} />
              </Button>
            </Link>
          ))}
        </div>

        <div className="p-2 border-t border-sidebar-border flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.profilePhoto} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                  <User size={16} />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700">
                <LogOut size={16} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    )
  }

  return (
    <>
    <aside className="h-full flex flex-col bg-sidebar text-sidebar-foreground">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sidebar-primary">JIVIKA</h1>
          <p className="text-xs text-muted-foreground">Doctor AI Assistant</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(true)}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <ChevronLeft size={16} />
        </Button>
      </div>

      <div className="p-4 border-b border-sidebar-border space-y-3">
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
        
        <Link href="/explore" className="w-full">
          <Button
            variant="default"
            className={`w-full mt-2 justify-start gap-3 bg-background hover:bg-sidebar-accent text-foreground`}
          >
            <MapPin size={20} />
            Explore Hospitals
          </Button>
        </Link>
         <Link href="/news" className="w-full">
          <Button
            variant="default"
            className={`w-full mt-2 justify-start gap-3 bg-background hover:bg-sidebar-accent text-foreground`}
          >
            <Newspaper size={20} />
            Explore News
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
            className={`group w-full text-left px-3 py-2 rounded-lg transition-colors text-sm truncate ${
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
              <span className="truncate max-w-[135px]">{chat.title}</span>

              <div className="flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <span
  onClick={(e) => {
    e.preventDefault()
    handleOpenRename(chat)
  }}
  className="cursor-pointer text-muted-foreground hover:text-primary"
  title="Rename Chat"
>
  <Pencil size={12} />
</span>
<span
  onClick={(e) => {
    e.preventDefault()
    handleOpenDelete(chat)
  }}
  className="cursor-pointer text-muted-foreground hover:text-red-500"
  title="Delete Chat"
>
  <Trash2 size={12} />
</span>

              </div>
            </div>
          </button>
        </Link>
      ))
    )}
  </div>
</ScrollArea>

      </div>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={user?.profilePhoto} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {user?.name || "Unnamed User"}
                  </span>
                </div>
              </div>
              <ChevronUp size={16} className="shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                <User size={16} />
                View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700">
              <LogOut size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
    <ConfirmModal
    open={showRenameModal}
    onOpenChange={setShowRenameModal}
    title="Rename Chat"
    description="Enter a new title for this chat."
    confirmLabel="Save"
    showInput
    inputValue={newTitle}
    onInputChange={setNewTitle}
    onConfirm={confirmRename}
  />
  
  <ConfirmModal
    open={showDeleteModal}
    onOpenChange={setShowDeleteModal}
    title="Delete Chat?"
    description="This action cannot be undone."
    confirmLabel="Delete"
    onConfirm={confirmDelete}
  />
  </>
  )
} 