import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1B2336",
        slate: "#5C6B8A",
        slateD: "#39455F",
        body: "#3E4A63",
        cream: "#F5F4EF",
        sand: "#ECEAE1",
        surface: "#FFFFFF",
        line: "#E5E2D8",
        orange: "#F26122",
        orange2: "#FF7536",
        orange700: "#C2480F",
      },
      fontFamily: {
        display: ['"Clash Display"', "system-ui", "sans-serif"],
        sans: ['"General Sans"', "system-ui", "sans-serif"],
      },
      fontWeight: {
        "500": "500",
        "600": "600",
      },
      boxShadow: {
        soft: "0 30px 60px -30px rgba(27,35,54,.3)",
      },
      maxWidth: {
        wrap: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
