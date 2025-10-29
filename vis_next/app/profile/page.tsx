"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, Mail, Calendar } from "lucide-react"
import { ChatLayout } from "../components/chatbox/Chat-Layout"
import ThemeSwitcher from "../components/Common/ThemeSwitcher"

export default function ProfilePage() {
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
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-6">User Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <User className="text-primary" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Name</label>
                    <p className="text-foreground font-medium text-sm md:text-base mt-1">User</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Email</label>
                    <p className="text-foreground font-medium text-sm md:text-base mt-1 break-all">user@example.com</p>
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
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1">Edit Profile</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Change Password
              </Button>
            </div>

            <ThemeSwitcher />

          </div>
        </div>
      </div>
    </ChatLayout>
  )
}