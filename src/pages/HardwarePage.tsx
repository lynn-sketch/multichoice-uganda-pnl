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
import { CurrencyTooltip, NumberTooltip } from '../components/ChartTooltips';
import { EmptyState, PageHeader } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import { KPICard, KPIGrid } from '../components/KPICard';
import { useScenario } from '../context/ScenarioContext';
import { hardwareSourceData } from '../data/august2026';
import { chartColors } from '../theme/tokens';
import { formatUGXCompact } from '../lib/format';

export function HardwarePage() {
  const { result, filters, setBrandFilter } = useScenario();
  const avgPerUnit =
    result.totalHardwareUnits > 0
      ? result.totalHardwareRevenue / result.totalHardwareUnits
      : 0;

  const units = [
    { name: 'DStv', value: hardwareSourceData.dstvUnits, brand: 'DStv' as const },
    { name: 'GOtv', value: hardwareSourceData.gotvUnits, brand: 'GOtv' as const },
  ].filter((r) => filters.brand === 'All' || r.brand === filters.brand);

  const revenue = [
    { name: 'DStv', value: result.dstvHardwareRevenue, brand: 'DStv' as const },
    { name: 'GOtv', value: result.gotvHardwareRevenue, brand: 'GOtv' as const },
  ].filter((r) => filters.brand === 'All' || r.brand === filters.brand);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hardware Analytics"
        subtitle="Unit and revenue mix for DStv and GOtv hardware. Values update when hardware assumptions change."
      />
      <FilterBar showBrand />

      <KPIGrid>
        <KPICard title="Total Hardware Units" value={result.totalHardwareUnits} format="number" accent="navy" badge="Source Data" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="DStv Units" value={hardwareSourceData.dstvUnits} format="number" accent="cyan" badge="Source Data" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="GOtv Units" value={hardwareSourceData.gotvUnits} format="number" accent="purple" badge="Source Data" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="Hardware Revenue" value={result.totalHardwareRevenue} accent="cyan" badge="Output" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="Avg Hardware Revenue / Unit" value={avgPerUnit} accent="green" badge="Calculated" />
        <KPICard title="Hardware Commission" value={result.hardwareCommission} accent="orange" badge="Output" />
      </KPIGrid>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="DStv vs GOtv Units" badge="Source Data">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={units}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<NumberTooltip />} />
              <Bar dataKey="value" name="Units" radius={[8, 8, 0, 0]} onClick={(d) => setBrandFilter((d as { brand?: 'DStv' | 'GOtv' }).brand ?? 'All')}>
                {units.map((u) => (
                  <Cell key={u.name} fill={u.brand === 'DStv' ? chartColors.dstv : chartColors.gotv} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="DStv vs GOtv Revenue" badge="Output">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => formatUGXCompact(v)} width={70} tick={{ fontSize: 10 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Bar dataKey="value" name="Revenue" radius={[8, 8, 0, 0]}>
                {revenue.map((u) => (
                  <Cell key={u.name} fill={u.brand === 'DStv' ? chartColors.dstv : chartColors.gotv} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hardware Brand Mix" badge="Source Data">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={units} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                {units.map((u) => (
                  <Cell key={u.name} fill={u.brand === 'DStv' ? chartColors.dstv : chartColors.gotv} />
                ))}
              </Pie>
              <Tooltip content={<NumberTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hardware Revenue Mix" badge="Output">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={revenue} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                {revenue.map((u) => (
                  <Cell key={u.name} fill={u.brand === 'DStv' ? chartColors.dstv : chartColors.gotv} />
                ))}
              </Pie>
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hardware Revenue Trend" badge="Statistical" empty emptyMessage="Upload additional historical periods to unlock hardware revenue trends.">
          <div />
        </ChartCard>
        <ChartCard title="Hardware Unit Trend" badge="Statistical" empty emptyMessage="Upload additional historical periods to unlock hardware unit trends.">
          <div />
        </ChartCard>
        <ChartCard title="Hardware Commission Trend" badge="Statistical" empty emptyMessage="Upload additional historical periods to unlock commission trends.">
          <div />
        </ChartCard>
      </div>

      <EmptyState
        icon="chart"
        title="Month-over-month changes unavailable"
        description="Only August 2026 hardware data is loaded. Historical comparisons will appear after additional periods are imported."
      />
    </div>
  );
}
