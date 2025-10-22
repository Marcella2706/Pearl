# Theme System Documentation

## Overview
This application supports three distinct themes that users can switch between:

### 1. **Dark Theme** 🌙
- **Color Scheme**: Black, White, and Grey
- **Purpose**: Dark mode for comfortable viewing in low-light conditions
- **Primary Colors**:
  - Background: Pure black (#000000)
  - Secondary Background: Dark grey (#1a1a1a)
  - Foreground: White (#ffffff)
  - Accents: Various shades of grey

### 2. **Light Theme** ☀️
- **Color Scheme**: White and Green
- **Purpose**: Fresh, professional light mode
- **Primary Colors**:
  - Background: White (#ffffff)
  - Secondary Background: Light green tints (#f0fdf4, #dcfce7)
  - Foreground: Dark green (#14532d)
  - Accents: Vibrant greens (#22c55e, #16a34a)

### 3. **Rose Theme** 🌸
- **Color Scheme**: White and Rose
- **Purpose**: Friendly, warm vibe
- **Primary Colors**:
  - Background: White (#ffffff)
  - Secondary Background: Light rose tints (#fff1f2, #ffe4e6)
  - Foreground: Deep rose (#881337)
  - Accents: Rose pinks (#f43f5e, #e11d48)

## Usage

### Accessing Theme Switcher
The theme switcher is displayed as a floating button in the top-right corner of the application. Users can click on any of the three theme buttons to switch instantly.

### Using Theme Colors in Components
Use the following CSS custom properties in your components:

```css
background: var(--background);           /* Primary background */
background: var(--background-secondary); /* Secondary background */
background: var(--background-tertiary);  /* Tertiary background */
color: var(--foreground);                /* Primary text */
color: var(--foreground-muted);          /* Secondary text */
color: var(--accent);                    /* Accent color */
color: var(--accent-hover);              /* Accent hover state */
border-color: var(--border);             /* Border color */
```

Or use Tailwind classes:
```jsx
<div className="bg-background text-foreground">
  <h1 className="text-foreground">Title</h1>
  <p className="text-foreground-muted">Description</p>
  <button className="bg-accent hover:bg-accent-hover">Action</button>
</div>
```

### Programmatically Changing Theme
```tsx
import { useTheme } from "../context/ThemeContext";

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme("dark")}>
      Switch to Dark Theme
    </button>
  );
}
```

## Implementation Details

### Files Created/Modified:
1. **`app/context/ThemeContext.tsx`** - Theme provider and context
2. **`app/components/ThemeSwitcher.tsx`** - Theme switcher UI component
3. **`app/globals.css`** - Theme CSS variables and definitions
4. **`app/layout.tsx`** - Wrapped app with ThemeProvider
5. **`app/page.tsx`** - Updated to use theme system

### How It Works:
1. The theme is stored in localStorage for persistence
2. The ThemeProvider manages theme state and applies the appropriate class to the HTML element
3. CSS custom properties are defined for each theme
4. Smooth transitions are applied when switching themes
5. The theme is preserved across page reloads

## Customization

To modify theme colors, edit the CSS custom properties in `app/globals.css`:

```css
.dark {
  --background: #000000;
  /* ... other colors */
}
```

To add a new theme:
1. Add theme definition in `globals.css`
2. Update the `Theme` type in `ThemeContext.tsx`
3. Add a button in `ThemeSwitcher.tsx`
