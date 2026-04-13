import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0e17",
        card: "#111827",
        border: "#1f2937",
        "text-primary": "#f9fafb",
        "text-secondary": "#9ca3af",
        green: {
          accent: "#10b981",
        },
        red: {
          accent: "#ef4444",
        },
        blue: {
          accent: "#3b82f6",
        },
        amber: {
          accent: "#f59e0b",
        },
        purple: {
          accent: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
