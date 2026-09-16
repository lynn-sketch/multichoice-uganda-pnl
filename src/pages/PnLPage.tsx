import { ChartCard } from '../components/ChartCard';
import { EmptyState, PageHeader } from '../components/EmptyState';
import { KPICard, KPIGrid } from '../components/KPICard';
import { PnLTable } from '../components/PnLTable';
import { WaterfallChart } from '../components/WaterfallChart';
import { useScenario } from '../context/ScenarioContext';
import { buildWaterfall } from '../services/analyticsService';
import { formatPercent, formatUGX } from '../lib/format';

export function PnLPage() {
  const { result } = useScenario();
  const rows = [
    { section: 'Revenue', label: 'Hardware Revenue', value: result.totalHardwareRevenue },
    { section: 'Revenue', label: 'Subscription Revenue', value: result.subscriptionRevenue },
    { section: 'Revenue', label: 'Total Revenue', value: result.baseRevenue, bold: true },
    { section: 'Costs', label: 'Hardware Commission', value: result.hardwareCommission },
    { section: 'Costs', label: 'Subscription Commission', value: result.subscriptionCommission },
    { section: 'Costs', label: 'Performance Incentive', value: result.performanceIncentive },
    { section: 'Costs', label: 'New POS Incentive', value: result.newPosIncentiveCost },
    { section: 'Costs', label: 'Stock Collection Fee', value: result.stockCollectionFee },
    { section: 'Costs', label: 'Total Base Costs', value: result.totalBaseCosts, bold: true },
    { section: 'Profit', label: 'Base Profit', value: result.baseProfit, bold: true },
    { section: 'Profit', label: 'Base Margin', value: result.baseProfitMargin, isPct: true },
    { section: 'Incentive', label: 'Mega Dealer Incentive', value: result.megaDealerRenewableIncentive },
    { section: 'Profit', label: 'Profit After Incentive', value: result.profitAfterIncentive, bold: true },
    { section: 'Profit', label: 'Profit Margin After Incentive', value: result.profitMarginAfterIncentive, isPct: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="P&L Analysis"
        subtitle="Professional profit & loss bridge and statement for the selected period."
      />

      <KPIGrid>
        <KPICard title="Revenue" value={result.baseRevenue} accent="navy" badge="Output" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="Costs" value={result.totalCostsWithIncentive} accent="orange" badge="Output" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="Profit" value={result.profitAfterIncentive} accent="green" badge="Output" comparisonLabel="vs previous month" comparisonValue={null} />
        <KPICard title="Margin" value={result.profitMarginAfterIncentive} format="percent" accent="cyan" badge="Output" comparisonLabel="vs previous month" comparisonValue={null} />
      </KPIGrid>

      <ChartCard title="P&L Waterfall" subtitle="Total revenue through profit after incentive" badge="Output" heightClass="h-80">
        <WaterfallChart items={buildWaterfall(result)} />
      </ChartCard>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-[#12263f] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Line Item</th>
              <th className="px-4 py-3 text-right">Current Month</th>
              <th className="px-4 py-3 text-right">Previous Month</th>
              <th className="px-4 py-3 text-right">Variance</th>
              <th className="px-4 py-3 text-right">Variance %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className={`border-b border-slate-100 ${row.bold ? 'bg-cyan-50/50 font-semibold' : ''}`}>
                <td className="px-4 py-3 text-[#12263f]">
                  <span className="mr-2 text-[10px] uppercase text-slate-400">{row.section}</span>
                  {row.label}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {row.isPct ? formatPercent(row.value) : formatUGX(row.value)}
                </td>
                <td className="px-4 py-3 text-right text-slate-400">—</td>
                <td className="px-4 py-3 text-right text-slate-400">—</td>
                <td className="px-4 py-3 text-right text-slate-400">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EmptyState
        icon="chart"
        title="Period variance awaiting history"
        description="Previous month, variance, and variance % columns will populate when additional reporting periods are imported."
      />

      <PnLTable result={result} />
    </div>
  );
}
