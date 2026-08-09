/* =========================================================
   SHAYAK - THEME CONFIGURATION
========================================================= */

import type { ThemeMode } from "./types";


/* ---------------------------------------------------------
   COLOR PALETTE
--------------------------------------------------------- */

export const colors = {
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },

  success: {
    50: "#ecfdf5",
    500: "#10b981",
    600: "#059669",
  },

  warning: {
    50: "#fffbeb",
    500: "#f59e0b",
    600: "#d97706",
  },

  danger: {
    50: "#fef2f2",
    500: "#ef4444",
    600: "#dc2626",
  },

  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
} as const;


/* ---------------------------------------------------------
   LIGHT THEME
--------------------------------------------------------- */

export const lightTheme = {
  mode: "light" as const,

  background: {
    page: "#f8fafc",
    surface: "#ffffff",
    surfaceMuted: "#f1f5f9",
    elevated: "#ffffff",
  },

  text: {
    primary: "#0f172a",
    secondary: "#475569",
    muted: "#64748b",
    inverse: "#ffffff",
  },

  border: {
    default: "#e2e8f0",
    strong: "#cbd5e1",
  },

  primary: colors.primary[600],

  status: {
    success: colors.success[500],
    warning: colors.warning[500],
    danger: colors.danger[500],
  },
};


/* ---------------------------------------------------------
   DARK THEME
--------------------------------------------------------- */

export const darkTheme = {
  mode: "dark" as const,

  background: {
    page: "#0b1020",
    surface: "#11182b",
    surfaceMuted: "#172033",
    elevated: "#151d32",
  },

  text: {
    primary: "#f8fafc",
    secondary: "#cbd5e1",
    muted: "#94a3b8",
    inverse: "#0f172a",
  },

  border: {
    default: "rgba(255,255,255,0.10)",
    strong: "rgba(255,255,255,0.18)",
  },

  primary: colors.primary[500],

  status: {
    success: colors.success[500],
    warning: colors.warning[500],
    danger: colors.danger[500],
  },
};


/* ---------------------------------------------------------
   THEME MAP
--------------------------------------------------------- */

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};


/* ---------------------------------------------------------
   GET CURRENT THEME
--------------------------------------------------------- */

export const getTheme = (mode: ThemeMode) => {
  return themes[mode];
};


/* ---------------------------------------------------------
   TYPOGRAPHY
--------------------------------------------------------- */

export const typography = {
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  sizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },

  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};


/* ---------------------------------------------------------
   SPACING
--------------------------------------------------------- */

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
};


/* ---------------------------------------------------------
   RADIUS
--------------------------------------------------------- */

export const radius = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  full: "9999px",
};


/* ---------------------------------------------------------
   SHADOWS
--------------------------------------------------------- */

export const shadows = {
  sm:
    "0 1px 2px rgba(15, 23, 42, 0.05)",

  md:
    "0 4px 12px rgba(15, 23, 42, 0.08)",

  lg:
    "0 10px 30px rgba(15, 23, 42, 0.12)",

  primary:
    "0 10px 30px rgba(79, 70, 229, 0.20)",
};


/* ---------------------------------------------------------
   BREAKPOINTS
--------------------------------------------------------- */

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};


/* ---------------------------------------------------------
   ANIMATION
--------------------------------------------------------- */

export const animation = {
  fast: "150ms",
  normal: "250ms",
  slow: "400ms",

  easing:
    "cubic-bezier(0.4, 0, 0.2, 1)",
};


/* ---------------------------------------------------------
   Z-INDEX
--------------------------------------------------------- */

export const zIndex = {
  base: 0,
  sidebar: 30,
  header: 40,
  dropdown: 50,
  modal: 100,
  toast: 200,
};


/* ---------------------------------------------------------
   DEFAULT THEME SETTINGS
--------------------------------------------------------- */

export const defaultThemeSettings = {
  mode: "light" as ThemeMode,

  primaryColor: colors.primary[600],

  borderRadius: radius.lg,

  fontFamily: typography.fontFamily,

  transitionDuration: animation.normal,
};