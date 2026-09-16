import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { CurrencyTooltip, NumberTooltip } from '../components/ChartTooltips';
import { PageHeader } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import { packageTooltipPayload } from '../components/InsightCard';
import { KPICard, KPIGrid } from '../components/KPICard';
import { useScenario } from '../context/ScenarioContext';
import { subscriptionPackages } from '../data/august2026';
import { filterPackages, packageAnalytics } from '../services/analyticsService';
import { chartColors } from '../theme/tokens';
import { formatNumber, formatPercent, formatUGX, formatUGXCompact } from '../lib/format';

type SortKey = 'name' | 'brand' | 'rateCard' | 'salesVolume' | 'revenue' | 'revenueShare' | 'commission';

export function SubscriptionsPage() {
  const { result, filters, assumptions, setPackageFilter } = useScenario();
  const [sortKey, setSortKey] = useState<SortKey>('revenue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const rate =
    assumptions.megaDealerSubscriptionCommission + assumptions.posSubscriptionCommission;

  const enriched = useMemo(() => {
    const rows = packageAnalytics(
      filterPackages(subscriptionPackages, filters.brand, filters.packageId, filters.search),
      rate,
    );
    return [...rows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });
  }, [filters, rate, sortKey, sortDir]);

  const totalVolume = enriched.reduce((s, p) => s + p.salesVolume, 0);
  const totalRev = enriched.reduce((s, p) => s + p.revenue, 0);
  const dstvRev = enriched.filter((p) => p.brand === 'DStv').reduce((s, p) => s + p.revenue, 0);
  const gotvRev = enriched.filter((p) => p.brand === 'GOtv').reduce((s, p) => s + p.revenue, 0);
  const arps = totalVolume > 0 ? totalRev / totalVolume : 0;

  const dstvMix = enriched.filter((p) => p.brand === 'DStv');
  const gotvMix = enriched.filter((p) => p.brand === 'GOtv');
  const topRev = [...enriched].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const topVol = [...enriched].sort((a, b) => b.salesVolume - a.salesVolume).slice(0, 5);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Analytics"
        subtitle="Package performance, rate cards, volume mix and commission estimates."
      />
      <FilterBar showBrand showSearch searchPlaceholder="Search packages…" />

      <KPIGrid>
        <KPICard title="Subscription Revenue" value={result.subscriptionRevenue} accent="navy" badge="Output" />
        <KPICard title="Subscription Sales Volume" value={totalVolume} format="number" accent="cyan" badge="Source Data" />
        <KPICard title="Avg Revenue per Subscription" value={arps} accent="purple" badge="Calculated" />
        <KPICard title="DStv Subscription Revenue" value={dstvRev} accent="cyan" badge="Source Data" />
        <KPICard title="GOtv Subscription Revenue" value={gotvRev} accent="purple" badge="Source Data" />
      </KPIGrid>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Revenue by Package" badge="Source Data">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enriched}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" hide />
              <YAxis tickFormatter={(v) => formatUGXCompact(v)} width={65} tick={{ fontSize: 10 }} />
              <Tooltip content={({ active, payload }) => active && payload?.[0] ? packageTooltipPayload(payload[0].payload as (typeof enriched)[0]) : null} />
              <Bar dataKey="revenue" fill={chartColors.revenue} radius={[4, 4, 0, 0]} onClick={(d) => setPackageFilter((d as { id?: string }).id ?? null)} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sales Volume by Package" badge="Source Data">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enriched}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" hide />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<NumberTooltip />} />
              <Bar dataKey="salesVolume" name="Sales Volume" fill={chartColors.profit} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Package Revenue Share" badge="Calculated">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={topRev} dataKey="revenue" nameKey="name" innerRadius={45} outerRadius={85}>
                {topRev.map((_, i) => (
                  <Cell key={i} fill={chartColors.series[i % chartColors.series.length]} />
                ))}
              </Pie>
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue vs Sales Volume" subtitle="Scatter of rate-card economics" badge="Calculated">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" dataKey="salesVolume" name="Volume" tick={{ fontSize: 10 }} />
              <YAxis type="number" dataKey="revenue" name="Revenue" tickFormatter={(v) => formatUGXCompact(v)} width={65} tick={{ fontSize: 10 }} />
              <ZAxis type="number" dataKey="rateCard" range={[40, 200]} />
              <Tooltip content={({ active, payload }) => active && payload?.[0] ? packageTooltipPayload(payload[0].payload as (typeof enriched)[0]) : null} />
              <Scatter data={enriched} fill={chartColors.scenario} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="DStv Package Mix" badge="Source Data">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dstvMix} dataKey="revenue" nameKey="name" outerRadius={85}>
                {dstvMix.map((_, i) => (
                  <Cell key={i} fill={chartColors.series[i % chartColors.series.length]} />
                ))}
              </Pie>
              <Tooltip content={<CurrencyTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="GOtv Package Mix" badge="Source Data">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={gotvMix} dataKey="revenue" nameKey="name" outerRadius={85}>
                {gotvMix.map((_, i) => (
                  <Cell key={i} fill={chartColors.series[i % chartColors.series.length]} />
                ))}
              </Pie>
              <Tooltip content={<CurrencyTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Packages by Revenue" badge="Source Data">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topRev} layout="vertical" margin={{ left: 16 }}>
              <XAxis type="number" tickFormatter={(v) => formatUGXCompact(v)} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Bar dataKey="revenue" fill={chartColors.revenue} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Packages by Volume" badge="Source Data">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topVol} layout="vertical" margin={{ left: 16 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10 }} />
              <Tooltip content={<NumberTooltip />} />
              <Bar dataKey="salesVolume" name="Volume" fill={chartColors.profit} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-[#12263f] text-white">
            <tr>
              {([
                ['brand', 'Brand'],
                ['name', 'Package'],
                ['rateCard', 'Rate Card'],
                ['salesVolume', 'Sales Volume'],
                ['revenue', 'Revenue'],
                ['revenueShare', 'Revenue Share'],
                ['commission', 'Commission'],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th key={key} className="cursor-pointer px-4 py-3 text-left font-semibold" onClick={() => toggleSort(key)}>
                  {label}{sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enriched.map((p) => (
              <tr key={p.id} className="cursor-pointer border-b border-slate-100 hover:bg-slate-50" onClick={() => setPackageFilter(p.id)}>
                <td className="px-4 py-3">{p.brand}</td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 tabular-nums">{formatUGX(p.rateCard)}</td>
                <td className="px-4 py-3 tabular-nums">{formatNumber(p.salesVolume)}</td>
                <td className="px-4 py-3 tabular-nums">{formatUGX(p.revenue)}</td>
                <td className="px-4 py-3 tabular-nums">{formatPercent(p.revenueShare)}</td>
                <td className="px-4 py-3 tabular-nums">{formatUGX(p.commission)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
