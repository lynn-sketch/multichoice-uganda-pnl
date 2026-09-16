/** Shared visual design tokens for MultiChoice Uganda analytics. */
export const colors = {
  navy: '#12263f',
  navySoft: '#1a3354',
  cyan: '#0ea5e9',
  cyanDeep: '#0284c7',
  purple: '#7c3aed',
  magenta: '#c026d3',
  yellow: '#eab308',
  green: '#059669',
  red: '#dc2626',
  orange: '#ea580c',
  slate: '#64748b',
  canvas: '#f3f6fa',
  white: '#ffffff',
} as const;

/** Semantic chart colors — use consistently across dashboards. */
export const chartColors = {
  revenue: colors.cyan,
  revenueAlt: colors.navySoft,
  profit: colors.green,
  costs: colors.orange,
  incentive: colors.magenta,
  scenario: colors.purple,
  warning: colors.yellow,
  error: colors.red,
  dstv: '#0284c7',
  gotv: '#7c3aed',
  hardware: '#0ea5e9',
  subscription: '#1a3354',
  neutral: '#94a3b8',
  series: ['#0ea5e9', '#1a3354', '#7c3aed', '#059669', '#ea580c', '#c026d3', '#eab308', '#64748b'],
} as const;

export const radii = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
} as const;

export const shadows = {
  card: '0 1px 2px rgba(18, 38, 63, 0.06), 0 8px 24px rgba(18, 38, 63, 0.04)',
  elevated: '0 4px 16px rgba(18, 38, 63, 0.1)',
} as const;

export const MIN_PERIODS_FOR_TREND = 2;
export const MIN_PERIODS_FOR_FORECAST = 3;
