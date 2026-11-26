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
        brand: {
          orange: "#F58A07",
          "orange-hover": "#D97400",
          "orange-light": "#FFF7ED",
          black: "#16130F",
          charcoal: "#231F1A",
          muted: "#6B655B",
          subtle: "#F8F9FA",
          border: "#E5E7EB",
          "border-dark": "#D1D5DB",
          success: "#15803D",
          "success-bg": "#F0FDF4",
          danger: "#DC2626",
          "danger-bg": "#FEF2F2",
          warning: "#D97706",
          "warning-bg": "#FFFBEB",
        },
      },
      fontFamily: {
        heading: ["'Barlow Condensed'", "system-ui", "sans-serif"],
        body: ["'Barlow'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(22, 19, 15, 0.05), 0 1px 2px -1px rgba(22, 19, 15, 0.05)",
        hover: "0 6px 20px -2px rgba(22, 19, 15, 0.08)",
        modal: "0 20px 48px -6px rgba(22, 19, 15, 0.16)",
      },
    },
  },
  plugins: [],
};
export default config;
