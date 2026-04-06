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
        beige: {
          light: "#F5EFE6",
          DEFAULT: "#E8D9C5",
          dark: "#C4A882",
        },
        gold: "#B8976A",
        text: {
          dark: "#2C2C2C",
          medium: "#6B6B6B",
        },
      },
      fontFamily: {
        heading: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Lato'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
