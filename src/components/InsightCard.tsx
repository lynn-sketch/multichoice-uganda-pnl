import { formatNumber, formatPercent, formatUGX } from '../lib/format';
import type { InsightCardData } from '../types';

const categoryStyles: Record<InsightCardData['category'], string> = {
  revenue: 'border-l-cyan-500',
  cost: 'border-l-orange-500',
  profit: 'border-l-emerald-500',
  partner: 'border-l-amber-400',
  subscription: 'border-l-violet-500',
  scenario: 'border-l-fuchsia-500',
};

export function InsightCard({ insight }: { insight: InsightCardData }) {
  return (
    <article
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm border-l-4 ${categoryStyles[insight.category]}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {insight.category} · Calculated
      </p>
      <h4 className="mt-1 text-sm font-semibold text-[#12263f]">{insight.title}</h4>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{insight.body}</p>
    </article>
  );
}

export function InsightGrid({ insights }: { insights: InsightCardData[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
}

export function RichTooltip({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1.5 font-semibold text-[#12263f]">{title}</p>
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-4 py-0.5">
          <span className="text-slate-500">{r.label}</span>
          <span className="font-semibold text-[#12263f]">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function packageTooltipPayload(payload: {
  name: string;
  revenue: number;
  salesVolume: number;
  revenueShare?: number;
  rateCard?: number;
}) {
  return (
    <RichTooltip
      title={payload.name}
      rows={[
        { label: 'Revenue', value: formatUGX(payload.revenue) },
        { label: 'Sales Volume', value: formatNumber(payload.salesVolume) },
        ...(payload.revenueShare != null
          ? [{ label: 'Revenue Share', value: formatPercent(payload.revenueShare) }]
          : []),
        ...(payload.rateCard != null
          ? [{ label: 'Rate Card', value: formatUGX(payload.rateCard) }]
          : []),
      ]}
    />
  );
}
