"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Calendar } from "lucide-react"
import { ChatLayout } from "../components/chatbox/Chat-Layout"
import ThemeSwitcher from "../components/Common/ThemeSwitcher"
import { EditProfileModal } from "./editProfile"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:2706/api/v1/user/current-user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("__Pearl_Token")}`,
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

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <ChatLayout>
      <div className="flex flex-col h-full bg-background">
        <div className="border-b border-border p-4 md:p-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <User className="text-primary" size={24} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Profile</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-2xl space-y-6">
            <Card className="bg-card border-border p-6">
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-20 w-20 border border-border">
                  <AvatarImage src={user?.profilePhoto} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-foreground">{user?.name || "Unnamed User"}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email || "No email"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Email</label>
                    <p className="text-foreground font-medium text-sm md:text-base mt-1 break-all">
                      {user?.email || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <Calendar className="text-primary" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
                      Member Since
                    </label>
                    <p className="text-foreground font-medium text-sm md:text-base mt-1">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
                onClick={() => setEditOpen(true)}
              >
                Edit Profile
              </Button>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        currentUser={user}
        onProfileUpdated={setUser}
      />
    </ChatLayout>
  )
}
