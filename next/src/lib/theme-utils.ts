import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind classes
 * Handles conflicts and ensures proper class ordering
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Theme-aware class variants for common components
 */
export const themeClasses = {
  // Buttons
  button: {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring",
    outline:
      "border border-border bg-background hover:bg-accent hover:text-accent-foreground focus:ring-ring",
    ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-ring",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-ring",
  },

  // Cards
  card: {
    default: "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
    hover: "rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow",
    interactive:
      "rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer",
  },

  // Inputs
  input: {
    default:
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    error:
      "flex h-10 w-full rounded-md border border-destructive bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
  },

  // Text
  text: {
    heading: "text-foreground font-semibold",
    body: "text-foreground",
    muted: "text-muted-foreground",
    small: "text-sm text-muted-foreground",
    error: "text-sm text-destructive",
  },

  // Containers
  container: {
    default: "bg-background text-foreground",
    card: "bg-card text-card-foreground",
    muted: "bg-muted text-muted-foreground",
  },

  // Navigation
  nav: {
    default: "border-b border-border bg-card",
    link: "text-foreground hover:text-primary transition-colors",
    activeLink: "text-primary font-medium",
  },

  // Modals/Dialogs
  modal: {
    overlay: "fixed inset-0 bg-background/80 backdrop-blur-sm",
    content:
      "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card text-card-foreground border border-border rounded-lg shadow-lg",
  },
} as const

/**
 * Get contrast color for accessibility
 */
export function getContrastColor(isDark: boolean) {
  return isDark ? "text-foreground" : "text-foreground"
}
