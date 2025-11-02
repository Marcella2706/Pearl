"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Calendar, MapPin, Car  } from "lucide-react"
import { ChatLayout } from "../components/chatbox/Chat-Layout"
import ThemeSwitcher from "../components/Common/ThemeSwitcher"
import { EditProfileModal } from "./editProfile"
import { getAuthToken } from "@/lib/auth-utils"
import { MapDisplay } from "../explore/_components/maps"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [editOpen, setEditOpen] = useState(false)

    const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
    
    useEffect(() => {
      const fetchUser = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL}/v1/user/current-user`, {
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setCurrentLocation({ lat: 40.7128, lng: -74.006 })
        }
      )
    } else {
      setCurrentLocation({ lat: 40.7128, lng: -74.006 })
    }
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
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="bg-card border-border p-8 rounded-3xl shadow-2xl">
              <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="shrink-0">
                  <Avatar className="h-32 w-32 border-4 border-border rounded-2xl shadow-lg">
                    <AvatarImage src={user?.profilePhoto} alt={user?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl rounded-2xl">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-foreground truncate">
                      {user?.name || "Unnamed User"}
                    </h1>
                  </div>
                  
                  <h3 className="text-lg font-medium text-muted-foreground mb-4">
                    Patient
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Mail className="text-primary" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="text-xs text-muted-foreground uppercase tracking-wide">Email</label>
                        <p className="text-foreground font-medium text-base break-all">
                          {user?.email || "—"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Calendar className="text-primary" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="text-xs text-muted-foreground uppercase tracking-wide">
                          Member Since
                        </label>
                        <p className="text-foreground font-medium text-base">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Button
                      className="bg-primary hover:bg-primary/90 text-background font-semibold rounded-full px-10 py-3 shadow-lg"
                      onClick={() => setEditOpen(true)}
                    >
                      Edit Profile
                    </Button>
                    
                    <div className="flex items-center space-x-8">

                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Your Location</h2>
                <p className="text-base text-muted-foreground">Current location for healthcare services</p>
              </div>
              
    
              <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden shadow-inner flex items-center justify-center border border-border mb-6">
                {currentLocation ? (
                 <div className="w-full h-full">
                    <MapDisplay></MapDisplay>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <MapPin size={40} className="text-primary mb-2" />
                    <span className="text-muted-foreground">Loading location...</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-8">
                
                <div className="ml-auto">
                  <ThemeSwitcher />
                </div>
              </div>
            </Card>
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
