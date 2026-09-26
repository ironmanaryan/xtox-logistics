import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FFDE59",
          black: "#111111",
        },
        surface: "#FFFFFF",
        ink: "#111111",
        muted: "#5b5b5b",
        line: "#e8e8e8",
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,17,17,0.05)",
        cardHover: "0 12px 32px rgba(17,17,17,0.12)",
        hero: "0 20px 60px rgba(17,17,17,0.10)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        floatY: "floatY 6s ease-in-out infinite",
        floatYSlow: "floatY 9s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
