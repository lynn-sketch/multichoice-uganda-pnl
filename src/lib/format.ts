export function formatUGX(value: number, decimals = 0): string {
  const formatted = new Intl.NumberFormat('en-UG', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Math.round(value * 10 ** decimals) / 10 ** decimals);
  return `UGX ${formatted}`;
}

export function formatUGXCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000) {
    return `${sign}UGX ${(abs / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '')}B`;
  }
  if (abs >= 1_000_000) {
    const m = abs / 1_000_000;
    const text = m >= 100 ? m.toFixed(1).replace(/\.0$/, '') : m.toFixed(1).replace(/\.0$/, '');
    return `${sign}UGX ${text}M`;
  }
  if (abs >= 1_000) {
    return `${sign}UGX ${(abs / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return formatUGX(value);
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-UG', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatPercentInput(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function parsePercentInput(raw: string): number {
  const cleaned = raw.replace(/%/g, '').trim();
  const num = Number(cleaned);
  if (Number.isNaN(num)) return 0;
  return num / 100;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function downloadCsv(filename: string, rows: (string | number)[][]): void {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const text = String(cell);
          if (text.includes(',') || text.includes('"') || text.includes('\n')) {
            return `"${text.replace(/"/g, '""')}"`;
          }
          return text;
        })
        .join(','),
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
