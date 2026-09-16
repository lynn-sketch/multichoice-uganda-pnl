import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { CurrencyTooltip } from '../components/ChartTooltips';
import { EmptyState, PageHeader } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import { packageTooltipPayload } from '../components/InsightCard';
import { KPICard, KPIGrid } from '../components/KPICard';
import { useScenario } from '../context/ScenarioContext';
import { subscriptionPackages } from '../data/august2026';
import { filterPackages, packageAnalytics } from '../services/analyticsService';
import { chartColors } from '../theme/tokens';
import { formatPercent, formatUGXCompact } from '../lib/format';

export function RevenuePage() {
  const { result, filters, assumptions, setBrandFilter, setPackageFilter } = useScenario();
  const rate =
    assumptions.megaDealerSubscriptionCommission + assumptions.posSubscriptionCommission;
  const filtered = filterPackages(subscriptionPackages, filters.brand, filters.packageId, filters.search);
  const enriched = packageAnalytics(filtered, rate).sort((a, b) => b.revenue - a.revenue);
  const top = enriched.slice(0, 5);

  const composition = [
    { name: 'Hardware', value: result.totalHardwareRevenue },
    { name: 'Subscription', value: result.subscriptionRevenue },
  ];

  const brandRows =
    filters.brand === 'All'
      ? [
          { name: 'DStv Hardware', value: result.dstvHardwareRevenue },
          { name: 'GOtv Hardware', value: result.gotvHardwareRevenue },
        ]
      : filters.brand === 'DStv'
        ? [{ name: 'DStv Hardware', value: result.dstvHardwareRevenue }]
        : [{ name: 'GOtv Hardware', value: result.gotvHardwareRevenue }];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Analytics"
        subtitle="Interactive revenue composition, brand mix, and package contribution."
      />
      <FilterBar showBrand showSearch searchPlaceholder="Search packages…" />

      <KPIGrid>
        <KPICard title="Total Revenue" value={result.baseRevenue} accent="navy" badge="Output" />
        <KPICard title="Hardware Revenue" value={result.totalHardwareRevenue} accent="cyan" badge="Output" />
        <KPICard title="Subscription Revenue" value={result.subscriptionRevenue} accent="purple" badge="Output" />
        <KPICard title="DStv Hardware Revenue" value={result.dstvHardwareRevenue} accent="cyan" badge="Output" />
        <KPICard title="GOtv Hardware Revenue" value={result.gotvHardwareRevenue} accent="purple" badge="Output" />
      </KPIGrid>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Revenue Composition" badge="Output">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={composition} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                <Cell fill={chartColors.hardware} />
                <Cell fill={chartColors.subscription} />
              </Pie>
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Brand" subtitle="Click a bar to filter" badge="Output">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={brandRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => formatUGXCompact(v)} width={70} tick={{ fontSize: 10 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Bar
                dataKey="value"
                name="Revenue"
                fill={chartColors.revenue}
                radius={[8, 8, 0, 0]}
                onClick={(d) => {
                  const name = String((d as { name?: string }).name ?? '');
                  if (name.includes('DStv')) setBrandFilter('DStv');
                  if (name.includes('GOtv')) setBrandFilter('GOtv');
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Package" badge="Source Data" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enriched}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-30} textAnchor="end" height={70} />
              <YAxis tickFormatter={(v) => formatUGXCompact(v)} width={70} tick={{ fontSize: 10 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  return packageTooltipPayload(payload[0].payload as typeof enriched[0]);
                }}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill={chartColors.revenue}
                radius={[6, 6, 0, 0]}
                onClick={(d) => setPackageFilter((d as { id?: string }).id ?? null)}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Revenue-Contributing Packages" badge="Source Data">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => formatUGXCompact(v)} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill={chartColors.scenario} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue Share %" subtitle="Share of filtered package revenue" badge="Calculated">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={top} dataKey="revenueShare" nameKey="name" outerRadius={90}
                label={({ name, percent }) => `${String(name).split(' ').slice(-1)[0]} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {top.map((_, i) => (
                  <Cell key={i} fill={chartColors.series[i % chartColors.series.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => formatPercent(Number(v))}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Monthly Revenue Trend"
          badge="Statistical"
          empty
          emptyMessage="Upload additional historical periods to unlock monthly revenue trends."
        >
          <div />
        </ChartCard>

        <ChartCard
          title="Revenue Growth %"
          badge="Statistical"
          empty
          emptyMessage="Revenue growth requires at least two reporting periods."
        >
          <div />
        </ChartCard>
      </div>

      <EmptyState
        icon="chart"
        title="Growth analytics locked"
        description="Only one reporting period is loaded. Trend and growth metrics will unlock after additional periods are imported."
      />
    </div>
  );
}
