import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/blocks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        error: "var(--error)",
        warning: "var(--warning)",
        info: "var(--info)",
        success: "var(--success)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          disabled: "var(--text-disabled)",
        },
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      fontSize: {
        h1: "var(--font-h1)", // 32px
        h2: "var(--font-h2)", // 28px
        h3: "var(--font-h3)", // 24px
        h4: "var(--font-h4)", // 20px
        subtitle: "var(--font-subtitle)", // 18px
        base: "var(--font-base)", // 16px (default body text)
        sm: "var(--font-sm)", // 14px
        xs: "var(--font-xs)", // 12px
      },
      fontWeight: {
        light: "var(--font-light)",
        regular: "var(--font-regular)",
        bold: "var(--font-bold)",
      }
    },
  },
  plugins: [],
} satisfies Config;
