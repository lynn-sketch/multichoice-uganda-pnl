import type { ReactNode } from 'react';
import { BarChart3, Inbox } from 'lucide-react';

export function EmptyState({
  title,
  description,
  icon = 'inbox',
}: {
  title: string;
  description: string;
  icon?: 'inbox' | 'chart';
}) {
  const Icon = icon === 'chart' ? BarChart3 : Inbox;
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
      <div className="mb-3 rounded-full bg-white p-3 shadow-sm">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <h4 className="text-sm font-semibold text-[#12263f]">{title}</h4>
      <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}

export function LoadingState({
  message = 'Generating analytics...',
}: {
  message?: string;
}) {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <p className="text-sm font-medium text-slate-500">{message}</p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200/70" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200/70" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200/70" />
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-bold text-[#12263f]">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
