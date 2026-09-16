import type { ReactNode } from 'react';
import { InfoTooltip } from './InfoTooltip';
import { formatPercent, formatUGX, formatUGXCompact } from '../lib/format';

interface KPICardProps {
  title: string;
  value: number;
  format?: 'currency' | 'percent' | 'number';
  tooltip?: string;
  accent?: 'navy' | 'cyan' | 'green' | 'magenta' | 'yellow' | 'purple' | 'orange';
  subtitle?: string;
  badge?: string;
  comparisonLabel?: string | null;
  comparisonValue?: number | null;
  sparkline?: number[];
  children?: ReactNode;
}

const accentMap = {
  navy: 'border-l-[#12263f]',
  cyan: 'border-l-cyan-500',
  green: 'border-l-emerald-500',
  magenta: 'border-l-fuchsia-500',
  yellow: 'border-l-amber-400',
  purple: 'border-l-violet-500',
  orange: 'border-l-orange-500',
};

export function KPICard({
  title,
  value,
  format = 'currency',
  tooltip,
  accent = 'cyan',
  subtitle,
  badge,
  comparisonLabel,
  comparisonValue,
  sparkline,
}: KPICardProps) {
  const display =
    format === 'percent'
      ? formatPercent(value)
      : format === 'number'
        ? value.toLocaleString('en-UG')
        : formatUGXCompact(value);

  const full =
    format === 'percent'
      ? formatPercent(value, 4)
      : format === 'number'
        ? value.toLocaleString('en-UG')
        : formatUGX(value);

  return (
    <div
      className={`group relative rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(18,38,63,0.06),0_8px_24px_rgba(18,38,63,0.04)] border-l-4 ${accentMap[accent]} transition hover:shadow-md`}
      title={full}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <div className="flex items-center gap-1">
          {badge && (
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-600">
              {badge}
            </span>
          )}
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
      </div>
      <p className="text-xl font-bold tracking-tight text-[#12263f] sm:text-2xl">
        {display}
      </p>
      {comparisonLabel !== undefined && (
        <p className="mt-1.5 text-xs text-slate-500">
          {comparisonValue == null ? (
            <span>No previous period</span>
          ) : (
            <span
              className={
                comparisonValue > 0
                  ? 'text-emerald-600'
                  : comparisonValue < 0
                    ? 'text-rose-600'
                    : 'text-slate-500'
              }
            >
              {comparisonValue > 0 ? '↑' : comparisonValue < 0 ? '↓' : '→'}{' '}
              {formatPercent(Math.abs(comparisonValue), 1)} {comparisonLabel}
            </span>
          )}
        </p>
      )}
      {sparkline && sparkline.length > 1 && (
        <Sparkline values={sparkline} />
      )}
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 hidden w-max -translate-x-1/2 rounded-md bg-[#12263f] px-2 py-1 text-xs text-white shadow-lg group-hover:block">
        {full}
      </div>
    </div>
  );
}

export function KPIGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 80;
      const y = 24 - ((v - min) / range) * 20;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg viewBox="0 0 80 28" className="mt-2 h-7 w-20 text-cyan-600" aria-hidden>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}
