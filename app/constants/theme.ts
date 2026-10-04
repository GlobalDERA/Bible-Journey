// Design System - Think of this as your paint colors and furniture style.
// Beginner rule: ALWAYS use these colors. Never invent new random colors.

export const Colors = {
  // Background like warm Bible paper, easy on eyes
  paper: '#FFFDF7',
  white: '#FFFFFF',

  // Text
  ink: '#1A1A1A', // main text, almost black
  muted: '#6B7280', // gray for small hints

  // Main action color - calm deep blue for trust
  primary: '#2B4C7E',
  primaryLight: '#5B7DB1',
  primaryDark: '#1E3558',

  // Progress gold - warm reward for completing reading
  gold: '#D4A574',
  goldLight: '#E8C9A0',

  // Soft green-gray for cards
  sage: '#E8EDE5',

  // Status
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
};

export const Fonts = {
  // Use serif for Bible verses (easy to read long text)
  bible: 'Georgia',
  // Use sans for buttons and menus (clear and modern)
  ui: 'Inter',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Theme = {
  // One big button per screen rule from PRD
  primaryButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
  },
};
