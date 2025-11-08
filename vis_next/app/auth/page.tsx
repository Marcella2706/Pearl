"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { User, Stethoscope } from "lucide-react";
import ExploreHeader from "../explore/_components/explore_Header";

export default function AuthRoleSelectPage() {
  const router = useRouter();
  const { theme } = useTheme();

  const color =
    theme === "dark"
      ? "#94a3b8"
      : theme === "light"
      ? "#10b981"
      : theme === "thunder"
      ? "#eab308"
      : "#fb7185";

  return (
    <>
    <ExploreHeader></ExploreHeader>
    <section className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden transition-colors duration-300">
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl animate-pulse"
        style={{ backgroundColor: color, opacity: 0.07 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-[400px] md:w-[450px] bg-background/95 backdrop-blur-xl border border-border/30 shadow-2xl rounded-3xl p-10 md:p-12 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Select your role to continue
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {[
              { label: "Sign in as User", icon: <User className="w-5 h-5" />, path: "/auth/user" },
              { label: "Sign in as Doctor", icon: <Stethoscope className="w-5 h-5" />, path: "/auth/doctor" },
            ].map(({ label, icon, path }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button
                  variant="outline"
                  className="w-full border-2 border-primary text-primary font-semibold rounded-2xl py-5 text-lg hover:bg-linear-to-r hover:from-primary hover:to-primary/80 hover:text-background hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-3"
                  onClick={() => router.push(path)}
                >
                  {icon}
                  {label}
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </section>
    </>
  );
}
