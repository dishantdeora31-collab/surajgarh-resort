import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        "glow-divine": "0 0 40px oklch(0.65 0.22 60 / 0.4), 0 0 80px oklch(0.65 0.22 60 / 0.2), 0 0 120px oklch(0.65 0.22 60 / 0.1)",
        "glow-cosmic": "0 0 30px oklch(0.50 0.18 270 / 0.3), 0 0 60px oklch(0.50 0.18 270 / 0.15), 0 0 90px oklch(0.50 0.18 270 / 0.08)",
        "glow-sm": "0 0 15px oklch(0.65 0.22 60 / 0.25)",
        "subtle": "0 1px 3px oklch(0 0 0 / 0.3), 0 4px 12px oklch(0 0 0 / 0.15)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px oklch(0.65 0.22 60 / 0.3), 0 0 40px oklch(0.65 0.22 60 / 0.15)" },
          "50%": { boxShadow: "0 0 40px oklch(0.65 0.22 60 / 0.6), 0 0 80px oklch(0.65 0.22 60 / 0.3), 0 0 120px oklch(0.65 0.22 60 / 0.15)" },
        },
        "particle-float": {
          "0%": { transform: "translateY(0px) translateX(0px) scale(1)", opacity: "0.6" },
          "33%": { transform: "translateY(-20px) translateX(10px) scale(1.1)", opacity: "1" },
          "66%": { transform: "translateY(-10px) translateX(-8px) scale(0.95)", opacity: "0.7" },
          "100%": { transform: "translateY(0px) translateX(0px) scale(1)", opacity: "0.6" },
        },
        "divine-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "title-reveal": {
          from: { opacity: "0", transform: "scale(0.9) translateY(20px)", filter: "blur(10px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)", filter: "blur(0)" },
        },
        "evolution-glow-stage1": {
          "0%, 100%": { boxShadow: "0 0 20px oklch(0.65 0.22 60 / 0.4), 0 0 40px oklch(0.65 0.22 60 / 0.2)" },
          "50%": { boxShadow: "0 0 40px oklch(0.65 0.22 60 / 0.6), 0 0 60px oklch(0.65 0.22 60 / 0.3)" },
        },
        "evolution-glow-stage4": {
          "0%, 100%": { boxShadow: "0 0 30px oklch(0.75 0.2 200 / 0.5), 0 0 60px oklch(0.75 0.2 200 / 0.25)" },
          "50%": { boxShadow: "0 0 50px oklch(0.75 0.2 200 / 0.7), 0 0 80px oklch(0.75 0.2 200 / 0.35)" },
        },
        "evolution-glow-stage5": {
          "0%, 100%": { boxShadow: "0 0 35px oklch(0.8 0.22 280 / 0.6), 0 0 70px oklch(0.8 0.22 280 / 0.3)" },
          "50%": { boxShadow: "0 0 55px oklch(0.8 0.22 280 / 0.8), 0 0 100px oklch(0.8 0.22 280 / 0.4)" },
        },
        "enemy-glow-corrupted": {
          "0%, 100%": { boxShadow: "0 0 15px oklch(0.55 0.22 25 / 0.4), 0 0 30px oklch(0.55 0.22 25 / 0.2)" },
          "50%": { boxShadow: "0 0 30px oklch(0.55 0.22 25 / 0.6), 0 0 50px oklch(0.55 0.22 25 / 0.3)" },
        },
        "enemy-glow-shadow": {
          "0%, 100%": { boxShadow: "0 0 15px oklch(0.5 0.18 270 / 0.4), 0 0 30px oklch(0.5 0.18 270 / 0.2)" },
          "50%": { boxShadow: "0 0 30px oklch(0.5 0.18 270 / 0.6), 0 0 50px oklch(0.5 0.18 270 / 0.3)" },
        },
        "enemy-glow-angel": {
          "0%, 100%": { boxShadow: "0 0 20px oklch(0.7 0.2 200 / 0.5), 0 0 40px oklch(0.7 0.2 200 / 0.25)" },
          "50%": { boxShadow: "0 0 40px oklch(0.7 0.2 200 / 0.7), 0 0 60px oklch(0.7 0.2 200 / 0.4)" },
        },
        "boss-glow": {
          "0%, 100%": { boxShadow: "0 0 25px oklch(0.75 0.22 280 / 0.6), 0 0 50px oklch(0.75 0.22 280 / 0.3), inset 0 0 30px oklch(0.75 0.22 280 / 0.1)" },
          "50%": { boxShadow: "0 0 45px oklch(0.75 0.22 280 / 0.8), 0 0 80px oklch(0.75 0.22 280 / 0.4), inset 0 0 50px oklch(0.75 0.22 280 / 0.15)" },
        },
        "boss-health-threat": {
          "0%, 100%": { borderColor: "oklch(0.75 0.22 280 / 0.5)", background: "linear-gradient(90deg, oklch(0.5 0.18 270 / 0.4), oklch(0.65 0.22 60 / 0.3))" },
          "50%": { borderColor: "oklch(0.75 0.22 280 / 0.8)", background: "linear-gradient(90deg, oklch(0.5 0.18 270 / 0.6), oklch(0.65 0.22 60 / 0.5))" },
        },
        "screen-gameover-fade": {
          from: { backgroundColor: "oklch(0.12 0 0 / 0)" },
          to: { backgroundColor: "oklch(0.12 0 0 / 0.9)" },
        },
        "screen-victory-pulse": {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "particle-float": "particle-float 6s ease-in-out infinite",
        "divine-shimmer": "divine-shimmer 8s linear infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "title-reveal": "title-reveal 1.2s ease-out forwards",
        "evolution-stage-1": "evolution-glow-stage1 3s ease-in-out infinite",
        "evolution-stage-4": "evolution-glow-stage4 3s ease-in-out infinite",
        "evolution-stage-5": "evolution-glow-stage5 3s ease-in-out infinite",
        "enemy-corrupted": "enemy-glow-corrupted 2.5s ease-in-out infinite",
        "enemy-shadow": "enemy-glow-shadow 2.5s ease-in-out infinite",
        "enemy-angel": "enemy-glow-angel 3s ease-in-out infinite",
        "boss-glow": "boss-glow 2s ease-in-out infinite",
        "boss-threat": "boss-health-threat 1.5s ease-in-out infinite",
        "gameover-fade": "screen-gameover-fade 0.8s ease-out forwards",
        "victory-pulse": "screen-victory-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
