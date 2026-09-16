import { MIN_PERIODS_FOR_FORECAST } from '../theme/tokens';

export interface ForecastPoint {
  period: string;
  actual?: number;
  forecast?: number;
  lower?: number;
  upper?: number;
  kind: 'actual' | 'forecast';
}

export interface ForecastResult {
  available: boolean;
  reason?: string;
  series: ForecastPoint[];
  method?: string;
}

/**
 * Frontend forecasting service.
 * Returns unavailable state until enough historical periods exist.
 * Designed so a Python/statsmodels backend can later replace generateForecast
 * without changing the Forecasting page UI contract.
 */
export function generateForecast(
  historicalValues: { period: string; value: number }[],
  horizon = 3,
): ForecastResult {
  if (historicalValues.length < MIN_PERIODS_FOR_FORECAST) {
    return {
      available: false,
      reason:
        'More historical periods are required before a meaningful forecast can be generated.',
      series: historicalValues.map((h) => ({
        period: h.period,
        actual: h.value,
        kind: 'actual' as const,
      })),
    };
  }

  // Simple linear trend + residual-based interval (placeholder for future model swap)
  const n = historicalValues.length;
  const xs = historicalValues.map((_, i) => i);
  const ys = historicalValues.map((h) => h.value);
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;
  const residuals = ys.map((y, i) => y - (intercept + slope * xs[i]));
  const rmse = Math.sqrt(
    residuals.reduce((s, r) => s + r * r, 0) / Math.max(1, n - 2),
  );

  const series: ForecastPoint[] = historicalValues.map((h) => ({
    period: h.period,
    actual: h.value,
    kind: 'actual',
  }));

  for (let h = 1; h <= horizon; h++) {
    const x = n - 1 + h;
    const forecast = intercept + slope * x;
    series.push({
      period: `Forecast +${h}`,
      forecast,
      lower: forecast - 1.96 * rmse,
      upper: forecast + 1.96 * rmse,
      kind: 'forecast',
    });
  }

  return {
    available: true,
    method: 'Ordinary least squares linear trend with residual confidence interval',
    series,
  };
}
