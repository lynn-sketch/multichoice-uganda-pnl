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
import { EmptyState, LoadingState, PageHeader } from '../components/EmptyState';
import { InsightGrid } from '../components/InsightCard';
import { KPICard, KPIGrid } from '../components/KPICard';
import { WaterfallChart } from '../components/WaterfallChart';
import { useScenario } from '../context/ScenarioContext';
import { subscriptionPackages } from '../data/august2026';
import { buildExecutiveAnalytics, buildWaterfall } from '../services/analyticsService';
import { chartColors } from '../theme/tokens';
import { formatUGXCompact } from '../lib/format';

export function DashboardPage() {
  const {
    result,
    insights,
    refreshing,
    setBrandFilter,
    presentationMode,
    periods,
    selectedPeriodId,
  } = useScenario();
  const analytics = buildExecutiveAnalytics(result);
  const periodLabel =
    periods.find((p) => p.id === selectedPeriodId)?.label ?? 'August 2026';

  if (refreshing) return <LoadingState message="Calculating P&L..." />;

  const packageRevenue = subscriptionPackages
    .map((p) => ({ name: p.name, value: p.revenue, brand: p.brand }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const baseVsIncentive = [
    { metric: 'Profit', Base: result.baseProfit, 'After Incentive': result.profitAfterIncentive },
    { metric: 'Costs', Base: result.totalBaseCosts, 'After Incentive': result.totalCostsWithIncentive },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle={`${periodLabel} Sales P&L overview driven by the central calculation engine.`}
      />

      <KPIGrid>
        <KPICard title="Total Revenue" value={result.baseRevenue} accent="navy" badge="Output" comparisonLabel="vs previous month" comparisonValue={null} tooltip="Total hardware + subscription revenue for the selected period." />
        <KPICard title="Hardware Revenue" value={result.totalHardwareRevenue} accent="cyan" badge="Output" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="Subscription Revenue" value={result.subscriptionRevenue} accent="purple" badge="Output" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="Total Costs" value={result.totalCostsWithIncentive} accent="orange" badge="Output" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="Base Profit" value={result.baseProfit} accent="green" badge="Output" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="Profit Margin" value={result.baseProfitMargin} format="percent" accent="cyan" badge="Output" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="Profit After Incentive" value={result.profitAfterIncentive} accent="green" badge="Output" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="Active Partners" value={analytics.activePartners} format="number" accent="yellow" badge="Source Data" comparisonLabel="vs previous month" comparisonValue={null} />
      </KPIGrid>

      {!presentationMode && (
        <section>
          <h4 className="mb-3 text-sm font-semibold text-[#12263f]">Management Insights</h4>
          <InsightGrid insights={insights.slice(0, 6)} />
        </section>
      )}
      {presentationMode && <InsightGrid insights={insights.slice(0, 3)} />}

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Revenue Composition"
          subtitle="Hardware vs Subscription"
          badge="Output"
          periodLabel={periodLabel}
          exportData={[
            ['Segment', 'Revenue'],
            ...analytics.revenueComposition.map((r) => [r.name, r.value]),
          ]}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={analytics.revenueComposition} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}
                onClick={(d) => {
                  const name = (d as { name?: string }).name;
                  if (name === 'Hardware') setBrandFilter('All');
                }}
              >
                <Cell fill={chartColors.hardware} />
                <Cell fill={chartColors.subscription} />
              </Pie>
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Revenue by Brand"
          subtitle="DStv vs GOtv hardware and package revenue"
          badge="Observed / Calculated"
          periodLabel={periodLabel}
          exportData={[
            ['Brand Item', 'Revenue'],
            ...analytics.brandRevenue.map((r) => [r.name, r.value]),
          ]}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.brandRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v) => formatUGXCompact(v)} width={70} tick={{ fontSize: 10 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Bar dataKey="value" name="Revenue" radius={[8, 8, 0, 0]}
                onClick={(d) => setBrandFilter((d as { brand?: 'DStv' | 'GOtv' }).brand ?? 'All')}
              >
                {analytics.brandRevenue.map((row) => (
                  <Cell key={row.name} fill={row.brand === 'DStv' ? chartColors.dstv : chartColors.gotv} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Revenue by Package"
          subtitle="Top packages by classified revenue"
          badge="Source Data"
          periodLabel={periodLabel}
          exportData={[
            ['Package', 'Revenue', 'Brand'],
            ...packageRevenue.map((r) => [r.name, r.value, r.brand]),
          ]}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={packageRevenue} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => formatUGXCompact(v)} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Bar dataKey="value" name="Revenue" fill={chartColors.revenue} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Cost Breakdown"
          subtitle="Base cost components"
          badge="Output"
          periodLabel={periodLabel}
          exportData={[
            ['Cost Category', 'Amount'],
            ...analytics.costBreakdown.map((r) => [r.name, r.value]),
          ]}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.costBreakdown} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => formatUGXCompact(v)} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Bar dataKey="value" name="Cost" fill={chartColors.costs} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Profit Bridge"
          subtitle="Revenue to profit after incentive"
          badge="Output"
          heightClass="h-72"
          periodLabel={periodLabel}
          exportData={[
            ['Step', 'Value'],
            ...buildWaterfall(result).map((r) => [r.name, r.value]),
          ]}
        >
          <WaterfallChart items={buildWaterfall(result)} />
        </ChartCard>

        <ChartCard
          title="Base Case vs Incentive Scenario"
          subtitle="Profit and costs comparison"
          badge="Output"
          periodLabel={periodLabel}
          exportData={[
            ['Metric', 'Base', 'After Incentive'],
            ...baseVsIncentive.map((r) => [r.metric, r.Base, r['After Incentive']]),
          ]}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={baseVsIncentive}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => formatUGXCompact(v)} width={70} tick={{ fontSize: 10 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
              <Bar dataKey="Base" fill={chartColors.revenueAlt} radius={[6, 6, 0, 0]} />
              <Bar dataKey="After Incentive" fill={chartColors.incentive} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Revenue and Profit Trend"
          subtitle="Requires multiple reporting periods"
          badge="Statistical"
          empty
          emptyMessage="Upload additional historical periods to unlock trend analytics."
        >
          <div />
        </ChartCard>

        <ChartCard
          title="Profit Margin Trend"
          subtitle="Requires multiple reporting periods"
          badge="Statistical"
          empty
          emptyMessage="Upload additional historical periods to unlock margin trends."
        >
          <div />
        </ChartCard>

        <ChartCard
          title="Hardware Units Trend"
          subtitle="Requires multiple reporting periods"
          badge="Statistical"
          empty
          emptyMessage="Upload additional historical periods to unlock hardware unit trends."
        >
          <div />
        </ChartCard>

        <ChartCard
          title="Active Partner Trend"
          subtitle="Requires multiple reporting periods"
          badge="Statistical"
          empty
          emptyMessage="Upload additional historical periods to unlock partner trends."
        >
          <div />
        </ChartCard>
      </div>

      {!analytics.hasHistoricalTrends && (
        <EmptyState
          icon="chart"
          title="Trend visuals awaiting history"
          description="Only August 2026 is currently loaded. Month-over-month comparisons and sparklines will appear when additional periods are imported."
        />
      )}
    </div>
  );
}
