"use client";

import { useTheme } from "@/app/context/ThemeContext";
import { Moon, Sun, Heart } from "lucide-react"; 
import { AiFillThunderbolt } from "react-icons/ai";
import { motion } from "framer-motion";
type Theme = "dark" | "light" | "rose"| "thunder";
export default function ThemeSwitcher() {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) return null;

  const themes = [
    { name: "dark", icon: <Moon size={16} className="text-balance"/>, label: "Dark theme" },
    { name: "light", icon: <Sun size={16} className="text-balance"/>, label: "Light theme" },
    { name: "rose", icon: <Heart size={16} className="text-balance"/>, label: "Rose theme" },
    { name: "thunder", icon: <AiFillThunderbolt size={16} className="text-balance"/>, label: "Thunder theme" },
  ];

  return (
    <div className="flex items-center gap-2 rounded-full bg-background p-1 shadow-sm border-b-primary border-b-0">
      {themes.map(({ name, icon, label }) => {
        const isActive = theme === name;
        return (
          <motion.button
            key={name}
            onClick={() => setTheme(name as Theme)}
            className={`relative flex items-center justify-center rounded-full p-2 transition-all ${
              isActive
                ? "bg-primary text-background shadow-sm"
                : "text-foreground-muted hover:bg-background-tertiary"
            }`}
            aria-label={label}
            title={label}
            whileTap={{ scale: 0.9 }}
            whileHover={!isActive ? { scale: 1.05 } : {}}
          >
            {icon}
            {isActive && (
              <motion.span
                layoutId="themeActive"
                className="absolute inset-0 rounded-full bg-foreground/10"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
