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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ExploreHeader title="My Doctors" subtitle="Latest Updates" logoSrc="/images/logo.png" ctaLabel="Chat" ctaHref="/chat" />
        <main className="p-6">
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
      />
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <GlassCard key={doctor.id} className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold">{doctor.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{doctor.hospital}</p>
              </div>
              <div className="my-4 flex gap-2">
                <Badge className="bg-primary/20 text-primary">Doctor</Badge>
              </div>
              <Link href={`/doctors/${doctor.id}`} className="w-full">
                <ModernButton variant="primary" className="w-full">
                  Book Appointment
                </ModernButton>
              </Link>
            </GlassCard>
          ))}
        </div>
      </main>
    </div>
  );
}
