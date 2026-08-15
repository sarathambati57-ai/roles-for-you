import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef3ff",
          100: "#dbe6fe",
          200: "#bed0fe",
          300: "#91b1fc",
          400: "#5c87f8",
          500: "#3862f0",
          600: "#2542e3",
          700: "#1f34c9",
          800: "#0f1f8f", // primary deep blue
          900: "#0a1660",
          950: "#060d3a",
        },
        accent: {
          amber: "#f5a524",
          teal: "#0d9488",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0a1660 0%, #0f1f8f 45%, #2542e3 100%)",
      },
      boxShadow: {
        card: "0 2px 10px rgba(10, 22, 96, 0.06)",
        "card-hover": "0 12px 28px rgba(10, 22, 96, 0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
