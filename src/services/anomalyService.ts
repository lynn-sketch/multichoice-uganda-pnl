import type { AnomalyRecord } from '../types';
import { iqrBounds, zScore } from './statisticsService';

export type AnomalyMetricKey =
  | 'packageRevenue'
  | 'packageVolume'
  | 'partnerUnits'
  | 'partnerSalesValue';

export interface AnomalySeriesPoint {
  id: string;
  label: string;
  value: number;
}

/**
 * Transparent statistical anomaly detection.
 * Does not fabricate time-series anomalies when history is unavailable.
 */
export function detectAnomalies(
  metric: AnomalyMetricKey,
  series: AnomalySeriesPoint[],
  method: 'IQR' | 'Z-score' = 'IQR',
  excludedIds: Set<string> = new Set(),
): AnomalyRecord[] {
  const values = series.map((s) => s.value);
  const results: AnomalyRecord[] = [];

  if (method === 'IQR') {
    const bounds = iqrBounds(values);
    if (!bounds) return [];
    for (const point of series) {
      if (point.value > bounds.upper || point.value < bounds.lower) {
        const high = point.value > bounds.upper;
        results.push({
          id: `${metric}-${point.id}`,
          metric,
          label: point.label,
          value: point.value,
          method: 'IQR',
          reason: high
            ? `Value is above Q3 + 1.5 × IQR (upper bound ${bounds.upper.toFixed(0)})`
            : `Value is below Q1 − 1.5 × IQR (lower bound ${bounds.lower.toFixed(0)})`,
          excluded: excludedIds.has(`${metric}-${point.id}`),
        });
      }
    }
    return results;
  }

  for (const point of series) {
    const z = zScore(point.value, values);
    if (z === null) return [];
    if (Math.abs(z) >= 2) {
      results.push({
        id: `${metric}-${point.id}`,
        metric,
        label: point.label,
        value: point.value,
        method: 'Z-score',
        reason: `|z| = ${Math.abs(z).toFixed(2)} (≥ 2). ${
          z > 0
            ? 'Unusually high relative to current distribution'
            : 'Unusually low relative to current distribution'
        }`,
        excluded: excludedIds.has(`${metric}-${point.id}`),
      });
    }
  }
  return results;
}
