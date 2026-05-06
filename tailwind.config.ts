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
        retro: {
          dark: "#0a0a1a",
          darker: "#060612",
          card: "#12122a",
          border: "#1e1e3a",
        },
        neon: {
          blue: "#00d4ff",
          purple: "#8b5cf6",
          pink: "#c026d3",
        },
        text: {
          dark: "#e2e8f0",
          medium: "#94a3b8",
        },
      },
      fontFamily: {
        heading: ["'Orbitron'", "'Rajdhani'", "system-ui", "sans-serif"],
        body: ["'Rajdhani'", "'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
