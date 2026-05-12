import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette — cream paper + black ink, mirroring the CovalenStudios logo
        bone: {
          50: "#F5F1E6", // page background (matches logo card)
          100: "#EFEADB", // elevated surface
          200: "#E5DFCB", // hairline borders
          300: "#D6CFB6",
          400: "#B8AF93",
        },
        ink: {
          950: "#050505", // primary text, CTA fill
          900: "#0F0F0F",
          800: "#1F1F1F", // body text on cream (≥13.9:1)
          700: "#2E2E2E", // strong muted
          600: "#404040", // muted (≥8.5:1)
          500: "#5C5C5C", // metadata / eyebrows (≥5.8:1, AA)
          400: "#7A7A7A", // placeholders only
        },
        // Warm bloom accents (sunlight / morning mist)
        clay: {
          peach: "#F2C9A8",
          amber: "#E8CFA0",
          warm: "#E8D9B8",
          rose: "#E8B8A0",
        },
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(60% 50% at 50% 0%, rgba(242,201,168,0.45) 0%, rgba(242,201,168,0) 70%)",
        nebula:
          "radial-gradient(40% 35% at 20% 20%, rgba(232,217,184,0.55) 0%, rgba(232,217,184,0) 70%), radial-gradient(35% 30% at 80% 30%, rgba(242,201,168,0.40) 0%, rgba(242,201,168,0) 70%), radial-gradient(50% 40% at 50% 90%, rgba(232,184,160,0.35) 0%, rgba(232,184,160,0) 70%)",
      },
      boxShadow: {
        // Soft, paper-like shadows tuned for cream surfaces
        glow: "0 10px 40px rgba(5,5,5,0.08), 0 0 0 1px rgba(5,5,5,0.04)",
        "glow-lg": "0 20px 60px rgba(5,5,5,0.12), 0 0 0 1px rgba(5,5,5,0.05)",
        pill: "0 8px 32px rgba(5,5,5,0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
        ink: "0 12px 32px rgba(5,5,5,0.22)",
      },
      animation: {
        "float-slow": "float 14s ease-in-out infinite",
        "float-slower": "float 22s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-20px,0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
