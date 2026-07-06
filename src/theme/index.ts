export const colors = {
  primary: '#059669',
  primaryTint: '#E6F5F1',
  background: '#FFFFFF',
  surface: '#F5F7FA',
  text: '#0B1530',
  subtext: '#6B7280',
  border: '#E5E7EB',
  accent: '#111827'
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  sub: {
    fontSize: 14,
    color: colors.subtext,
  },
};
