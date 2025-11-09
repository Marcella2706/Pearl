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
      {theme !== "light" && theme !== "rose" && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(248,250,252,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(248,250,252,0.08)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(248,250,252,0.9)_70%,transparent_110%)]" />
        </div>
      )}
      
      {theme !== "dark" && theme !== "thunder" && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>
      )}

      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse"
        style={{ backgroundColor: color, opacity: 0.1 }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000"
        style={{ backgroundColor: color, opacity: 0.2 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-[400px] bg-background/90 backdrop-blur-xl border border-border shadow-xl rounded-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome Back
            </h2>
            <p className="text-sm text-foreground-muted">
              Select your role to continue
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {[
              { label: "Sign in as User", icon: <User className="w-5 h-5 text-primary" />, path: "/auth/user" },
              { label: "Sign in as Doctor", icon: <Stethoscope className="w-5 h-5 text-primary" />, path: "/auth/doctor" },
            ].map(({ label, icon, path }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button
                  variant="outline"
                  className="w-full border border-border text-foreground font-medium rounded-lg py-6 text-base hover:bg-primary hover:text-primary/80 hover:border-primary transition-all duration-300 flex items-center justify-center gap-3"
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
