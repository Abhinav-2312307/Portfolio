import type { Config } from "tailwindcss"
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        inter: ["var(--font-inter)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "primary-color": "rgb(var(--primary-color) / <alpha-value>)",
        "primary-dark": "rgb(var(--primary-dark) / <alpha-value>)",
        "primary-light": "rgb(var(--primary-light) / <alpha-value>)",
        "secondary-color": "rgb(var(--secondary-color) / <alpha-value>)",
        "dark-color": "rgb(var(--dark-color) / <alpha-value>)",
        "text-color": "rgb(var(--text-color) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        "accent-color": "rgb(var(--accent-color) / <alpha-value>)",
        "danger-color": "rgb(var(--danger-color) / <alpha-value>)",
        "success-color": "rgb(var(--success-color) / <alpha-value>)",
        "warning-color": "rgb(var(--warning-color) / <alpha-value>)",
        "contrast-color": "rgb(var(--contrast-color) / <alpha-value>)",
        "overlay-color": "rgb(var(--overlay-color) / <alpha-value>)",
      },
      boxShadow: {
        primary: "var(--shadow-primary)",
        glass: "var(--shadow-glass)",
        liquid: "var(--shadow-liquid)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        rotate: {
          "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
          "100%": { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
        shine: {
          "0%": { transform: "rotate(45deg) translateX(-100%)" },
          "100%": { transform: "rotate(45deg) translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        rotate: "rotate 20s linear infinite",
        shine: "shine 1.5s infinite",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(circle at center, transparent 0%, var(--dark-color) 70%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
