import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f6efe1",
        char: "#1d1109",
        velvet: "#241509",
        ember: "#dd9c5c",
        gold: "#dcb65f",
        sand: "#d8c6a3",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Jost"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
