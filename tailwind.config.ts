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
        background: "#0a0a0b",
        foreground: "#ededed",
        card: "#131417",
        "card-foreground": "#ededed",
        primary: "#22c55e",
        "primary-foreground": "#000000",
        secondary: "#1f2025",
        "secondary-foreground": "#ededed",
        muted: "#1f2025",
        "muted-foreground": "#a1a1aa",
        accent: "#1f2025",
        "accent-foreground": "#ededed",
        destructive: "#ef4444",
        "destructive-foreground": "#ededed",
        border: "#27272a",
        input: "#27272a",
        ring: "#22c55e",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "calc(0.75rem - 2px)",
        sm: "calc(0.75rem - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
