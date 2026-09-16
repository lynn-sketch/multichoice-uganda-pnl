import type { ReactNode } from 'react';
import { InfoTooltip } from './InfoTooltip';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  tooltip?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
  heightClass?: string;
  empty?: boolean;
  emptyMessage?: string;
}

export function ChartCard({
  title,
  subtitle,
  tooltip,
  badge,
  children,
  className = '',
  heightClass = 'h-64',
  empty = false,
  emptyMessage = 'No data available for this view.',
}: ChartCardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(18,38,63,0.06),0_8px_24px_rgba(18,38,63,0.04)] ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#12263f]">{title}</h3>
            {tooltip && <InfoTooltip text={tooltip} />}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {badge && (
          <span className="shrink-0 rounded-md bg-cyan-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-700">
            {badge}
          </span>
        )}
      </div>
      {empty ? (
        <div
          className={`flex ${heightClass} items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-sm text-slate-500`}
        >
          {emptyMessage}
        </div>
      ) : (
        <div className={`w-full ${heightClass}`}>{children}</div>
      )}
    </section>
  );
}
