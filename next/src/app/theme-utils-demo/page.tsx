"use client"

import { cn, themeClasses } from "@/lib/theme-utils"

export default function ThemeUtilsExample() {
  return (
    <div className={themeClasses.container.default}>
      <div className="container mx-auto p-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">
          Theme Utils Examples
        </h1>

        {/* Button Variants */}
        <section className="mb-8">
          <h2 className={cn(themeClasses.text.heading, "mb-4 text-xl")}>
            Button Variants
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              className={cn(
                themeClasses.button.primary,
                "rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
              )}
            >
              Primary
            </button>
            <button
              className={cn(
                themeClasses.button.secondary,
                "rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
              )}
            >
              Secondary
            </button>
            <button
              className={cn(
                themeClasses.button.outline,
                "rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
              )}
            >
              Outline
            </button>
            <button
              className={cn(
                themeClasses.button.ghost,
                "rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
              )}
            >
              Ghost
            </button>
            <button
              className={cn(
                themeClasses.button.destructive,
                "rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
              )}
            >
              Destructive
            </button>
          </div>
        </section>

        {/* Card Variants */}
        <section className="mb-8">
          <h2 className={cn(themeClasses.text.heading, "mb-4 text-xl")}>
            Card Variants
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className={cn(themeClasses.card.default, "p-6")}>
              <h3 className={themeClasses.text.heading}>Default Card</h3>
              <p className={themeClasses.text.muted}>
                Standard card style
              </p>
            </div>
            <div className={cn(themeClasses.card.hover, "p-6")}>
              <h3 className={themeClasses.text.heading}>Hover Card</h3>
              <p className={themeClasses.text.muted}>
                Hover for effect
              </p>
            </div>
            <div className={cn(themeClasses.card.interactive, "p-6")}>
              <h3 className={themeClasses.text.heading}>Interactive</h3>
              <p className={themeClasses.text.muted}>
                Click me!
              </p>
            </div>
          </div>
        </section>

        {/* Input Variants */}
        <section className="mb-8">
          <h2 className={cn(themeClasses.text.heading, "mb-4 text-xl")}>
            Input Variants
          </h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className={cn(themeClasses.text.body, "mb-1 block text-sm font-medium")}>
                Default Input
              </label>
              <input
                type="text"
                placeholder="Enter text..."
                className={themeClasses.input.default}
              />
            </div>
            <div>
              <label className={cn(themeClasses.text.body, "mb-1 block text-sm font-medium")}>
                Error Input
              </label>
              <input
                type="text"
                placeholder="This has an error"
                className={themeClasses.input.error}
              />
              <p className={themeClasses.text.error}>
                This field is required
              </p>
            </div>
          </div>
        </section>

        {/* Text Variants */}
        <section>
          <h2 className={cn(themeClasses.text.heading, "mb-4 text-xl")}>
            Text Variants
          </h2>
          <div className="space-y-2">
            <h3 className={themeClasses.text.heading}>Heading Text</h3>
            <p className={themeClasses.text.body}>Regular body text</p>
            <p className={themeClasses.text.muted}>Muted text for less emphasis</p>
            <p className={themeClasses.text.small}>Small muted text</p>
            <p className={themeClasses.text.error}>Error message text</p>
          </div>
        </section>
      </div>
    </div>
  )
}
