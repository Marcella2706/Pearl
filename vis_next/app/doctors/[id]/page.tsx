"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Phone } from "lucide-react";
import axios from "axios";
import { ModernButton } from "../_components/mordern-button";
import { GlassCard } from "../_components/glass-card";
import { GlassAlert } from "../_components/glass-alert";
import ExploreHeader from "../../explore/_components/explore_Header";

interface Doctor {
  id: string;
  name: string;
  hospital: string;
  role: string;
  profilePhoto?: string;
}

interface BookingForm {
  name: string;
  phone: string;
  problem: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
}

export default function DoctorBookingPage() {
  const router = useRouter();
  const { id } = useParams();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<BookingForm>({
    name: "",
    phone: "",
    problem: "",
    date: "",
    time: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ✅ Load doctor details
  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const token = localStorage.getItem("__Pearl_Token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/doctors`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const found = res.data.find((d: Doctor) => d.id === id);
        setDoctor(found || null);
      } catch (err) {
        console.error("Failed to fetch doctor:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDoctor();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      alert("Please select a valid date and time.");
      return;
    }

    // ✅ LocalDateTime expected → send without timezone
    const appointmentTime = `${formData.date}T${formData.time}:00`;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("__Pearl_Token");
      const payload = {
        doctorId: doctor?.id,
        description: formData.problem.trim(),
        appointmentTime, // exact LocalDateTime format
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/appointments`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitted(true);
      setTimeout(() => router.push("/doctors"), 2000);
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading doctor details...
      </div>
    );
  }

  if (!doctor) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground mb-4">Doctor not found</p>
        <ModernButton onClick={() => router.push("/doctors")}>
          Back to Doctors
        </ModernButton>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ExploreHeader
        title="Book Appointment"
        subtitle={`Consult ${doctor.name}`}
        logoSrc="/images/logo.png"
        ctaLabel="Chat"
        ctaHref="/chat"
      />

      <main className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Doctor Info */}
          <GlassCard className="md:col-span-1 text-center">
            {doctor.profilePhoto ? (
              <img
                src={doctor.profilePhoto}
                alt={doctor.name}
                className="w-24 h-24 rounded-2xl mx-auto mb-4 object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl mx-auto mb-4 bg-muted flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                    1.79-4 4 1.79 4 4 4zm0 2c-3.314 0-6 
                    2.686-6 6h12c0-3.314-2.686-6-6-6z"
                  />
                </svg>
              </div>
            )}

            <h2 className="text-xl font-bold">{doctor.name}</h2>
            {doctor.hospital && (
              <p className="text-sm text-muted-foreground mt-1">
                {doctor.hospital}
              </p>
            )}
            <p className="text-sm mt-2 text-primary font-semibold">
              {doctor.role}
            </p>
          </GlassCard>

          {/* Booking Form */}
          <GlassCard className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-6">Book Appointment</h3>

            {submitted && (
              <GlassAlert variant="success" title="Success!" className="mb-6">
                Appointment booked successfully. Redirecting...
              </GlassAlert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full glass-sm px-4 py-3 focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <Phone className="w-10 h-10 p-2.5 text-muted-foreground shrink-0" />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    className="flex-1 glass-sm px-4 py-3 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Problem */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Problem Description
                </label>
                <textarea
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  placeholder="Describe your symptoms"
                  rows={3}
                  required
                  className="w-full glass-sm px-4 py-3 focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    min={new Date().toISOString().split("T")[0]} // ✅ block past dates
                    onChange={handleChange}
                    required
                    className="w-full glass-sm px-4 py-3 focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full glass-sm px-4 py-3 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <ModernButton
                type="submit"
                variant="primary"
                className="w-full mt-6"
              >
                {submitting ? "Booking..." : "Confirm Appointment"}
              </ModernButton>
            </form>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
