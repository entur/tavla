import {
  transportModes,
  transportModesTransparent,
  dataColors,
} from "./src/utils/colors";
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "2rem",
        md: "0.5rem",
      },
      screens: {
        "2xl": "1536px",
      },
    },

    extend: {
      screens: {
        "3xl": "1920px",
      },
      backgroundColor: {
        primary: "var(--main-background-color)",
        secondary: "var(--secondary-background-color)",
        tertiary: "var(--tertiary-background-color)",
        contrast: "var(--contrast-background-color)",
        grey40: "var(--grey40)",
        grey30: "var(--grey30)",
        grey10: "var(--grey10)",
        blue20: "var(--blue20)",
        blue10: "var(--blue10)",
      },
      colors: {
        background: "var(--main-background-color)",
        primary: "var(--main-text-color)",
        secondary: "var(--secondary-text-color)",
        tertiary: "var(--tertiary-text-color)",
        error: "var(--error-color)",
        success: "var(--success-color)",
        warning: "var(--warning-color)",
        highlight: "var(--highlight-text-color)",
        "estimated-time": "var(--error-color)",
        tooltip: "var(--tooltip-color)",
        "tooltip-text": "var(--tooltip-text-color)",
        ...transportModes,
        ...transportModesTransparent,
        ...dataColors,
      },
      borderRadius: {
        sm: "0.2em",
        DEFAULT: "0.5em",
      },
      borderColor: {
        primary: "var(--divider-color)",
        secondary: "var(--border-color)",
      },
      fontSize: {
        "em-xs": "0.625em",
        "em-sm": "0.75em",
        "em-base": "0.875em",
        "em-lg": "1em",
        "em-xl": "1.25em",
        "em-xl2": "1.5em",
        "em-xl3": "1.75em",
        "em-xl4": "2em",
        "em-xl5": "2.5em",
        "em-situation": "0.65em",
      },
      lineHeight: {
        "em-xs": "0.5625em",
        "em-sm": "0.7em",
        "em-base": "1.1em",
        "em-lg": "1.3em",
        "em-xl": "1.5em",
        "em-situation": "1.1em",
      },
      spacing: {
        "em-0.25": "0.25em",
        "em-0.5": "0.5em",
        "em-0.75": "0.75em",
        "em-1": "1em",
        "em-2": "2em",
        "em-3": "3em",
        md: "16px",
      },
      gridTemplateColumns: {
        "auto-fit-minmax": "repeat(auto-fit, minmax(60vmin, 1fr))",
      },
      animation: {
        pulse: "pulse 3s ease-out infinite",
      },
      keyframes: {
        pulse: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
    },
  },
  safelist: [
    ...Object.keys(transportModes).map((key) => `bg-${key}`),
    ...Object.keys(transportModesTransparent).map((key) => `bg-${key}`),
    ...Object.keys(transportModes).map((key) => `text-${key}`),
  ],

  plugins: [],
};
