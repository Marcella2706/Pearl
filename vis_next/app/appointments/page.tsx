"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import ExploreHeader from "../explore/_components/explore_Header";
import Link from "next/link";

interface Appointment {
  id: string;
  doctorName: string;
  hospitalName: string;
  appointmentDate: string;
  description: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    doctorName: "Dr. Rajesh Kumar",
    hospitalName: "Apollo Hospital",
    appointmentDate: "2025-12-15T10:30",
    description: "Heart checkup and consultation",
  },
  {
    id: "2",
    doctorName: "Dr. Priya Sharma",
    hospitalName: "Max Healthcare",
    appointmentDate: "2025-12-20T14:00",
    description: "Migraine evaluation",
  },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAppointments(MOCK_APPOINTMENTS);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ExploreHeader
          title="Jivika News"
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
              href="/appointments"
              className="text-sm font-medium text-primary hover:text-primary transition-colors"
            >
              Appointments
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ExploreHeader
        title="My Appointments"
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
              href="/appointments"
              className="text-sm font-medium text-primary hover:text-primary transition-colors"
            >
              Appointments
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
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            My Appointments
          </h1>
          <p className="text-muted-foreground mb-8">
            View all your scheduled appointments
          </p>

          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="bg-card border-border hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-card-foreground">
                          {appointment.doctorName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {appointment.hospitalName}
                        </p>
                      </div>
                      <Badge variant="outline">Pending Confirmation</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          Appointment Date
                        </p>
                        <p className="text-card-foreground font-medium">
                          {formatDate(appointment.appointmentDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          Issue
                        </p>
                        <p className="text-card-foreground">
                          {appointment.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground text-lg">
                    No appointments scheduled
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Book an appointment with a doctor to see it here
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-foreground-muted">
            © 2025 Jivika News. All rights reserved.
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
