// Generated from tokens.json - DO NOT EDIT

export const tokens = {
  "colors": {
    "light": {
      "primary": "#2563EB",
      "primaryLight": "#60A5FA",
      "primaryDark": "#1E40AF",
      "secondary": "#10B981",
      "secondaryLight": "#34D399",
      "secondaryDark": "#059669",
      "success": "#4CAF50",
      "warning": "#FFA726",
      "error": "#F44336",
      "info": "#2196F3",
      "textPrimary": "#212121",
      "textSecondary": "#757575",
      "textDisabled": "#9E9E9E",
      "textHint": "#BDBDBD",
      "background": "#FAFAFA",
      "surface": "#FFFFFF",
      "surfaceVariant": "#F5F5F5",
      "border": "#E0E0E0",
      "divider": "#BDBDBD",
      "overlay": "#80000000",
      "scrim": "#1F000000"
    },
    "dark": {
      "primary": "#60A5FA",
      "primaryLight": "#93C5FD",
      "primaryDark": "#2563EB",
      "secondary": "#34D399",
      "secondaryLight": "#6EE7B7",
      "secondaryDark": "#10B981",
      "success": "#4CAF50",
      "warning": "#FFA726",
      "error": "#F44336",
      "info": "#2196F3",
      "textPrimary": "#FFFFFF",
      "textSecondary": "#B0B0B0",
      "textDisabled": "#808080",
      "textHint": "#606060",
      "background": "#121212",
      "surface": "#1E1E1E",
      "surfaceVariant": "#2C2C2C",
      "border": "#3A3A3A",
      "divider": "#2C2C2C",
      "overlay": "#B3000000",
      "scrim": "#4D000000"
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "xxl": "48px"
  },
  "borderRadius": {
    "xs": "4px",
    "sm": "8px",
    "md": "12px",
    "lg": "16px",
    "xl": "24px",
    "full": "9999px"
  },
  "typography": {
    "fontFamily": {
      "base": "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    },
    "fontSize": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px"
    },
    "fontWeight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    },
    "lineHeight": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.75"
    }
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "base": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  }
} as const;

export type ColorToken = keyof typeof tokens.colors.light;
export type SpacingToken = keyof typeof tokens.spacing;
export type BorderRadiusToken = keyof typeof tokens.borderRadius;
export type FontSizeToken = keyof typeof tokens.typography.fontSize;
export type FontWeightToken = keyof typeof tokens.typography.fontWeight;
export type ShadowToken = keyof typeof tokens.shadows;
