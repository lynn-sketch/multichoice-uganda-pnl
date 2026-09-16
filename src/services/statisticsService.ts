import type { DescriptiveStats } from '../types';

export function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function percentile(values: number[], p: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance =
    values.reduce((sum, v) => sum + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function describe(values: number[]): DescriptiveStats | null {
  if (values.length < 2) return null;
  return {
    count: values.length,
    mean: mean(values),
    median: median(values),
    min: Math.min(...values),
    max: Math.max(...values),
    stdDev: stdDev(values),
    p25: percentile(values, 0.25),
    p75: percentile(values, 0.75),
    p90: percentile(values, 0.9),
  };
}

export function herfindahl(shares: number[]): number {
  return shares.reduce((sum, s) => sum + s * s, 0);
}

export function concentrationTopN(values: number[], n: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => b - a);
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  const top = sorted.slice(0, n).reduce((a, b) => a + b, 0);
  return top / total;
}

export interface IqrResult {
  q1: number;
  q3: number;
  iqr: number;
  lower: number;
  upper: number;
}

export function iqrBounds(values: number[]): IqrResult | null {
  if (values.length < 4) return null;
  const q1 = percentile(values, 0.25);
  const q3 = percentile(values, 0.75);
  const iqr = q3 - q1;
  return {
    q1,
    q3,
    iqr,
    lower: q1 - 1.5 * iqr,
    upper: q3 + 1.5 * iqr,
  };
}

export function zScore(value: number, values: number[]): number | null {
  if (values.length < 3) return null;
  const sd = stdDev(values);
  if (sd === 0) return 0;
  return (value - mean(values)) / sd;
}

export function histogramBins(
  values: number[],
  binCount = 5,
): { label: string; count: number; from: number; to: number }[] {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    return [{ label: String(min), count: values.length, from: min, to: max }];
  }
  const width = (max - min) / binCount;
  return Array.from({ length: binCount }, (_, i) => {
    const from = min + i * width;
    const to = i === binCount - 1 ? max : from + width;
    const count = values.filter((v) =>
      i === binCount - 1 ? v >= from && v <= to : v >= from && v < to,
    ).length;
    return {
      label: `${Math.round(from)}–${Math.round(to)}`,
      count,
      from,
      to,
    };
  });
}

export function boxPlotSummary(values: number[]) {
  const stats = describe(values);
  if (!stats) return null;
  return {
    min: stats.min,
    q1: stats.p25,
    median: stats.median,
    q3: stats.p75,
    max: stats.max,
  };
}
