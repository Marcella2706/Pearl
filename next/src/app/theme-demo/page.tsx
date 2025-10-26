"use client"

import { ThemeToggle, ThemeToggleWithLabels } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeDemo() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with theme toggle */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-foreground">Theme Demo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Current: {theme}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-8">
        {/* Theme toggle variants */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Theme Toggle Variants
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Icon only</span>
              <ThemeToggle />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">With labels</span>
              <ThemeToggleWithLabels />
            </div>
          </div>
        </section>

        {/* Color palette showcase */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Color Palette
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Background */}
            <div className="rounded-lg border border-border bg-background p-6">
              <h3 className="mb-2 font-semibold text-foreground">Background</h3>
              <p className="text-sm text-muted-foreground">
                Main background color
              </p>
            </div>

            {/* Card */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 font-semibold text-card-foreground">Card</h3>
              <p className="text-sm text-muted-foreground">
                Card background color
              </p>
            </div>

            {/* Primary */}
            <div className="rounded-lg border border-border bg-primary p-6">
              <h3 className="mb-2 font-semibold text-primary-foreground">
                Primary
              </h3>
              <p className="text-sm text-primary-foreground/80">
                Primary action color
              </p>
            </div>

            {/* Secondary */}
            <div className="rounded-lg border border-border bg-secondary p-6">
              <h3 className="mb-2 font-semibold text-secondary-foreground">
                Secondary
              </h3>
              <p className="text-sm text-muted-foreground">
                Secondary color
              </p>
            </div>

            {/* Muted */}
            <div className="rounded-lg border border-border bg-muted p-6">
              <h3 className="mb-2 font-semibold text-muted-foreground">
                Muted
              </h3>
              <p className="text-sm text-muted-foreground">
                Muted backgrounds
              </p>
            </div>

            {/* Accent */}
            <div className="rounded-lg border border-border bg-accent p-6">
              <h3 className="mb-2 font-semibold text-accent-foreground">
                Accent
              </h3>
              <p className="text-sm text-muted-foreground">
                Accent color
              </p>
            </div>
          </div>
        </section>

        {/* Components showcase */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Component Examples
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Card example */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                Example Card
              </h3>
              <p className="mb-4 text-muted-foreground">
                This card adapts to both light and dark themes seamlessly.
              </p>
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Primary Button
              </button>
            </div>

            {/* Form example */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                Form Example
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
                <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Typography showcase */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Typography
          </h2>
          <div className="space-y-2 rounded-lg border border-border bg-card p-6">
            <h1 className="text-4xl font-bold text-foreground">
              Heading 1
            </h1>
            <h2 className="text-3xl font-semibold text-foreground">
              Heading 2
            </h2>
            <h3 className="text-2xl font-semibold text-foreground">
              Heading 3
            </h3>
            <p className="text-foreground">
              This is regular body text that adapts to the theme.
            </p>
            <p className="text-muted-foreground">
              This is muted text for less important information.
            </p>
            <a href="#" className="text-primary hover:underline">
              This is a link with primary color
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
