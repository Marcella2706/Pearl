"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, Phone, FileText } from "lucide-react"

import { ModernButton } from "../_components/mordern-button"
import { GlassCard } from "../_components/glass-card"
import { GlassAlert } from "../_components/glass-alert"
import ExploreHeader from "../../explore/_components/explore_Header"

interface Doctor {
  id: string
  name: string
  specialty: string
  hospital: string
  experience: number
  rating: number
}

const MOCK_DOCTORS: Record<string, Doctor> = {
  "1": { id: "1", name: "Dr. Sarah Johnson", specialty: "Cardiology", hospital: "City Heart Center", experience: 12, rating: 4.8 },
  "2": { id: "2", name: "Dr. Michael Chen", specialty: "Neurology", hospital: "Medical Plaza Hospital", experience: 8, rating: 4.9 },
  "3": { id: "3", name: "Dr. Emily Roberts", specialty: "Orthopedics", hospital: "Wellness Medical Center", experience: 15, rating: 4.7 },
  "4": { id: "4", name: "Dr. James Wilson", specialty: "Pediatrics", hospital: "Children's Hospital", experience: 10, rating: 4.6 },
  "5": { id: "5", name: "Dr. Lisa Anderson", specialty: "Dermatology", hospital: "Skin Care Specialists", experience: 9, rating: 4.8 },
  "6": { id: "6", name: "Dr. David Kumar", specialty: "Psychiatry", hospital: "Mental Health Institute", experience: 11, rating: 4.7 },
}

interface BookingForm {
  name: string
  phone: string
  problem: string
  date: string
  time: string
}

export default function DoctorBookingPage() {
  const router = useRouter()
  const { id } = useParams()

  const doctor = MOCK_DOCTORS[id as string]

  const [formData, setFormData] = useState<BookingForm>({
    name: "",
    phone: "",
    problem: "",
    date: "",
    time: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!doctor) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground mb-4">Doctor not found</p>
        <ModernButton onClick={() => router.push("/doctors")}>Back to Doctors</ModernButton>
      </main>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      setTimeout(() => router.push("/doctors"), 2000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ExploreHeader
        title="Book Appointment"
        subtitle="Select your preferred time"
        logoSrc="/images/logo.png"
        ctaLabel="Chat"
        ctaHref="/chat"
        rightSlot={
          <nav className="flex items-center gap-4 ml-4">
            <Link href="/explore" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Explore
            </Link>
            <Link href="/doctors" className="text-sm font-medium text-primary hover:text-primary transition-colors">
              Doctors
            </Link>
            
            <Link href="/news" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              News
            </Link>
            <Link href="/chat" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Chat
            </Link>
          </nav>
        }
      />

      {/* Main content */}
      <main className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Doctor Info Card */}
          <GlassCard className="md:col-span-1">
            <div className="text-center">
              <div className="w-24 h-24 bg-linear-to-br from-primary to-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                {doctor.name.charAt(0)}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-card-foreground">{doctor.name}</h2>
              <p className="text-primary font-semibold text-sm mt-1">{doctor.specialty}</p>
              <p className="text-muted-foreground text-sm mb-4">{doctor.hospital}</p>
              <div className="space-y-2 border-t border-border/30 pt-4 text-left px-4">
                <p className="text-sm">
                  <span className="text-muted-foreground">Experience:</span> {doctor.experience} years
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Rating:</span> ⭐ {doctor.rating}/5.0
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Booking Form */}
          <GlassCard className="md:col-span-2">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Book Appointment</h3>

            {submitted && (
              <GlassAlert variant="success" title="Success!" className="mb-6 animate-in">
                Appointment booked successfully. Redirecting...
              </GlassAlert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full glass-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Phone Number</label>
                <div className="flex gap-2">
                  <Phone className="w-10 h-10 glass-sm rounded-xl p-2.5 text-muted-foreground shrink-0" />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    className="flex-1 glass-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Problem Description</label>
                <div className="flex gap-2">
                  <FileText className="w-10 h-10 glass-sm rounded-xl p-2.5 text-muted-foreground shrink-0" />
                  <textarea
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    placeholder="Describe your symptoms"
                    rows={3}
                    required
                    className="flex-1 glass-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Preferred Date</label>
                  <div className="flex gap-2">
                    <Calendar className="w-10 h-10 glass-sm rounded-xl p-2.5 text-muted-foreground shrink-0" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="flex-1 glass-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Preferred Time</label>
                  <div className="flex gap-2">
                    <Clock className="w-10 h-10 glass-sm rounded-xl p-2.5 text-muted-foreground shrink-0" />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="flex-1 glass-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>

              <ModernButton type="submit" variant="primary" size="lg" className="w-full mt-6">
                {loading ? "Booking..." : "Confirm Appointment"}
              </ModernButton>
            </form>
          </GlassCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">© 2025 Jivika Health. All rights reserved.</span>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/chat" className="hover:text-primary transition-colors">
              Chat
            </Link>
            <Link href="/explore" className="hover:text-primary transition-colors">
              Explore
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
