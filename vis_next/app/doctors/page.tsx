"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { SkeletonLoader } from "./_components/skeleton-loader"
import { ModernButton } from "./_components/mordern-button"
import { GlassCard } from "./_components/glass-card"
import ExploreHeader from "../explore/_components/explore_Header"

interface Doctor {
  id: string
  name: string
  hospital: string
  specialization: string
}

const MOCK_DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    hospital: "Apollo Hospital",
    specialization: "Cardiology",
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    hospital: "Max Healthcare",
    specialization: "Neurology",
  },
  {
    id: "3",
    name: "Dr. Amit Patel",
    hospital: "Fortis Hospital",
    specialization: "Orthopedics",
  },
  {
    id: "4",
    name: "Dr. Neha Singh",
    hospital: "Apollo Hospital",
    specialization: "Dermatology",
  },
  {
    id: "5",
    name: "Dr. Vikram Gupta",
    hospital: "Max Healthcare",
    specialization: "General Medicine",
  },
  {
    id: "6",
    name: "Dr. Anjali Verma",
    hospital: "Fortis Hospital",
    specialization: "Pediatrics",
  },
]

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        //  Simulate network delay with modern loading
        await new Promise((resolve) => setTimeout(resolve, 1200))
        setDoctors(MOCK_DOCTORS)
      } catch (error) {
        console.error("Failed to load doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDoctors()
  }, [])

//   if (loading) {
//     return (

//     )
//   }

//   return (
    
//   )
if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ExploreHeader
          title="My Doctors"
          subtitle="Latest Updates"
          logoSrc="/images/logo.png"
          ctaLabel="Chat"
          ctaHref="/chat"
          rightSlot={
            <nav className="flex items-center gap-4 ml-4">
            <Link
              href="/explore"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/doctors"
              className="text-sm font-medium text-primary hover:text-primary transition-colors"
            >
              Doctors
            </Link>
            
            <Link
              href="/news"
              className="text-sm font-medium text-foreground  underline-offset-4 hover:underline"
            >
              News
            </Link>
            <Link
              href="/chat"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Chat
            </Link>
          </nav>
          }
        />
              <main className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              Our Doctors
            </h1>
            <p className="text-muted-foreground text-lg">Loading available doctors...</p>
          </div>
          <SkeletonLoader count={6} />
        </div>
      </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ExploreHeader
        title="My Doctors"
        subtitle="Latest Updates"
        logoSrc="/images/logo.png"
        ctaLabel="Chat"
        ctaHref="/chat"
        rightSlot={
          <nav className="flex items-center gap-4 ml-4">
            <Link
              href="/explore"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/doctors"
              className="text-sm font-medium text-primary hover:text-primary transition-colors"
            >
              Doctors
            </Link>
            
            <Link
              href="/news"
              className="text-sm font-medium text-foreground  underline-offset-4 hover:underline"
            >
              News
            </Link>
            <Link
              href="/chat"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Chat
            </Link>
           
          </nav>
        }
      />
      <main className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/*  Added gradient header with modern typography */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
            Our Doctors
          </h1>
          <p className="text-muted-foreground text-lg">
            Select a doctor to book an appointment
          </p>
        </div>

        {/*  Responsive grid with glass cards and hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <GlassCard
              key={doctor.id}
              className="group flex flex-col justify-between"
            >
              {/* Doctor Info */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                  {doctor.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <span className="text-lg">🏥</span>
                  {doctor.hospital}
                </p>
              </div>

              {/* Specialization Badge */}
              <div className="my-4 flex flex-wrap gap-2">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                  {doctor.specialization}
                </Badge>
                <Badge variant="outline">Licensed</Badge>
              </div>

              {/* Book Button */}
              <Link href={`/doctors/${doctor.id}`} className="w-full">
                <ModernButton variant="primary" size="md" className="w-full">
                  Book Appointment
                </ModernButton>
              </Link>
            </GlassCard>
          ))}
        </div>

        {doctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No doctors available</p>
          </div>
        )}
      </div>
    </main>

      <footer className="mt-16 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-foreground-muted">
            © 2025 Jivika Health. All rights reserved.
          </span>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/chat" className="hover:text-primary transition-colors">
              Chat
            </Link>
            <Link
              href="/explore"
              className="hover:text-primary transition-colors"
            >
              Explore
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
