"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, MapPin, Car, Clock, Stethoscope, Hospital  } from "lucide-react"
import { ChatLayout } from "../components/chatbox/Chat-Layout"
import ThemeSwitcher from "../components/Common/ThemeSwitcher"
import { EditProfileModal } from "./editProfile"
import { getAuthToken } from "@/lib/auth-utils"
import { MapDisplay } from "../explore/_components/maps"

interface Appointment {
  id: string;
  doctor: {
    id: string;
    name: string;
    hospital?: string;
  };
  patient: {
    id: string;
    name: string;
  };
  appointmentDate: string;
  description: string;
  status?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadingAppointments, setLoadingAppointments] = useState(true)

    const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
    
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
    const loadAppointments = async () => {
      if (!user?.id) {
        setLoadingAppointments(false);
        return;
      }

      try {
        const endpoint = user.role === "DOCTOR" 
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/appointments/doctors/${user.id}/appointments`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/appointments/users/${user.id}/appointments`;

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          console.error("Failed to fetch appointments:", response.status);
          setAppointments([]);
        }
      } catch (error) {
        console.error("Error loading appointments:", error);
        setAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    };

    loadAppointments();
  }, [user]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };



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
                    {user?.role === "DOCTOR" ? "Doctor" : "Patient"}
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

                    {user?.role === "DOCTOR" && user?.hospital && (
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <Hospital className="text-primary" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Hospital</label>
                          <p className="text-foreground font-medium text-base">
                            {user.hospital}
                          </p>
                        </div>
                      </div>
                    )}
                    
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

            {/* Appointments Section */}
            <Card className="bg-card border-border p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-card pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/20 rounded-2xl">
                    <Calendar className="text-primary" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {user?.role === "DOCTOR" ? "Patient Appointments" : "My Appointments"}
                    </h2>
                    <p className="text-base text-muted-foreground">
                      {user?.role === "DOCTOR" 
                        ? "View all your patient appointments" 
                        : "View all your scheduled appointments"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {loadingAppointments ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <Card
                        key={appointment.id}
                        className="bg-background border-border hover:shadow-lg hover:border-primary/50 transition-all duration-300 relative overflow-hidden group"
                      >
                        {/* Subtle gradient on hover */}
                        <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        
                        <CardHeader className="relative z-10">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                              {/* Doctor Icon */}
                              <div className="p-3 bg-primary/10 rounded-xl shrink-0 group-hover:bg-primary/20 transition-colors">
                                <Stethoscope className="text-primary" size={24} />
                              </div>
                              <div>
                                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                                  {user?.role === "DOCTOR" 
                                    ? appointment.patient.name 
                                    : appointment.doctor.name}
                                  <span className="text-xs font-normal text-muted-foreground">
                                    #{index + 1}
                                  </span>
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                  <MapPin size={14} />
                                  {user?.role === "DOCTOR" 
                                    ? (user.hospital || "Hospital") 
                                    : (appointment.doctor.hospital || "Hospital")}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            >
                              {appointment.status || "Pending Confirmation"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 relative z-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                              <div className="p-2 bg-background rounded-lg shrink-0">
                                <Clock className="text-primary" size={18} />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                  Appointment Date
                                </p>
                                <p className="text-foreground font-medium">
                                  {formatDate(appointment.appointmentDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                              <div className="p-2 bg-background rounded-lg shrink-0">
                                <Stethoscope className="text-primary" size={18} />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                  {user?.role === "DOCTOR" ? "Patient Details" : "Issue"}
                                </p>
                                <p className="text-foreground">
                                  {appointment.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="bg-background border-border border-dashed">
                      <CardContent className="py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-muted rounded-full">
                            <Calendar className="text-muted-foreground" size={32} />
                          </div>
                          <p className="text-muted-foreground text-lg font-medium">
                            No appointments scheduled
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Book an appointment with a doctor to see it here
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
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
