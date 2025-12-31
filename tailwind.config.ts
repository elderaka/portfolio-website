import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#0a0a0b",
          darker: "#111113",
          dark: "#18181b",
          gray: "#27272a",
          muted: "#71717a",
          light: "#a1a1aa",
          white: "#fafafa",
          accent: "#22d3ee",
          accent2: "#a78bfa",
          warning: "#fbbf24",
          success: "#4ade80",
          error: "#f87171",
        },
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "typing": "typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite",
        "glitch": "glitch 0.3s ease-in-out",
        "float": "float 6s ease-in-out infinite",
        "scan": "scan 8s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        "blink-caret": {
          "from, to": { borderColor: "transparent" },
          "50%": { borderColor: "#22d3ee" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-5px, 5px)" },
          "40%": { transform: "translate(-5px, -5px)" },
          "60%": { transform: "translate(5px, 5px)" },
          "80%": { transform: "translate(5px, -5px)" },
          "100%": { transform: "translate(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(34, 211, 238, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 211, 238, 0.03) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "noise": "url('/noise.png')",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
