"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SkeletonLoader } from "./_components/skeleton-loader";
import { ModernButton } from "./_components/mordern-button";
import { GlassCard } from "./_components/glass-card";
import ExploreHeader from "../explore/_components/explore_Header";
import axios from "axios";

interface Doctor {
  id: string;
  name: string;
  hospital: string;
  role: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const token = localStorage.getItem("__Pearl_Token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(res.data);
      } catch (error) {
        console.error("Failed to load doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const navLinks = (
    <nav className="flex items-center gap-4 ml-4">
      <Link href="/explore" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Explore</Link>
      <Link href="/doctors" className="text-sm font-medium text-primary hover:text-primary transition-colors">Doctors</Link>
      <Link href="/news" className="text-sm font-medium text-foreground underline-offset-4 hover:underline">News</Link>
      <Link href="/chat" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Chat</Link>
    </nav>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ExploreHeader
          title="My Doctors"
          subtitle="Latest Updates"
          logoSrc="/images/logo.png"
          ctaLabel="Chat"
          ctaHref="/chat"
          rightSlot={navLinks}
        />
        <main className="p-6 max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              Our Doctors
            </h1>
            <p className="text-muted-foreground text-lg">Loading available doctors...</p>
          </div>
          <SkeletonLoader count={6} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ExploreHeader
        title="Our Doctors"
        subtitle="Book your preferred specialist"
        logoSrc="/images/logo.png"
        ctaLabel="Chat"
        ctaHref="/chat"
        rightSlot={navLinks}
      />

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
            Our Doctors
          </h1>
          <p className="text-muted-foreground text-lg">Select a doctor to book an appointment</p>
        </div>

        {doctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No doctors available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <GlassCard key={doctor.id} className="flex flex-col justify-between hover:scale-105 transition-transform">
                <div>
                  <h2 className="text-xl font-bold">{doctor.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{doctor.hospital}</p>
                </div>
                <div className="my-4 flex gap-2">
                  <Badge className="bg-primary/20 text-primary">{doctor.role || "Doctor"}</Badge>
                </div>
                <Link href={`/doctors/${doctor.id}`} className="w-full">
                  <ModernButton variant="primary" className="w-full">Book Appointment</ModernButton>
                </Link>
              </GlassCard>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-foreground-muted">© 2025 Jivika Health. All rights reserved.</span>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/chat" className="hover:text-primary transition-colors">Chat</Link>
            <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
