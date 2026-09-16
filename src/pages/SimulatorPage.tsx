import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AssumptionInput } from '../components/AssumptionInput';
import { ChartCard } from '../components/ChartCard';
import { PageHeader } from '../components/EmptyState';
import { KPICard } from '../components/KPICard';
import { ScenarioComparison } from '../components/ScenarioComparison';
import { useScenario } from '../context/ScenarioContext';
import { assumptionTooltips } from '../data/august2026';
import { formatPercent, formatUGX, formatUGXCompact } from '../lib/format';
import { chartColors } from '../theme/tokens';

export function SimulatorPage() {
  const {
    assumptions,
    updateAssumption,
    result,
    baseResult,
    resetAssumptions,
    setPage,
  } = useScenario();

  const bridge = [
    {
      name: 'Profit Before',
      base: 0,
      size: result.scenarioProfitBeforeIncentive,
      display: result.scenarioProfitBeforeIncentive,
      color: chartColors.profit,
    },
    {
      name: 'Incentive Cost',
      base: result.scenarioProfitAfterIncentive,
      size: result.megaDealerRenewableIncentive,
      display: -result.megaDealerRenewableIncentive,
      color: chartColors.incentive,
    },
    {
      name: 'Profit After',
      base: 0,
      size: result.scenarioProfitAfterIncentive,
      display: result.scenarioProfitAfterIncentive,
      color: chartColors.revenueAlt,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scenario Simulator"
        subtitle="Adjust commercial assumptions. All dependent costs, profits, margins and charts update immediately via the central calculation engine."
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetAssumptions}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setPage('scenario-compare')}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
            >
              Compare Scenario
            </button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#12263f]">Assumption Controls</h4>
            <span className="rounded-md bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase text-amber-800">
              Business Assumptions
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <AssumptionInput label="Mega Dealer Renewable Incentive" tooltip={assumptionTooltips.megaDealerRenewableIncentive} value={assumptions.megaDealerRenewableIncentive} onChange={(v) => updateAssumption('megaDealerRenewableIncentive', v)} min={0} max={60_000_000} step={1_000_000} kind="currency" />
            <AssumptionInput label="Mega Dealer Subscription Commission" tooltip={assumptionTooltips.megaDealerSubscriptionCommission} value={assumptions.megaDealerSubscriptionCommission} onChange={(v) => updateAssumption('megaDealerSubscriptionCommission', v)} min={0} max={0.2} step={0.01} kind="percent" />
            <AssumptionInput label="POS Subscription Commission" tooltip={assumptionTooltips.posSubscriptionCommission} value={assumptions.posSubscriptionCommission} onChange={(v) => updateAssumption('posSubscriptionCommission', v)} min={0} max={0.3} step={0.01} kind="percent" />
            <AssumptionInput label="Hardware Commission per Unit" tooltip={assumptionTooltips.hardwareCommissionPerUnit} value={assumptions.hardwareCommissionPerUnit} onChange={(v) => updateAssumption('hardwareCommissionPerUnit', v)} min={0} max={20_000} step={100} kind="currency" />
            <AssumptionInput label="Performance Sales Target" tooltip={assumptionTooltips.performanceSalesTarget} value={assumptions.performanceSalesTarget} onChange={(v) => updateAssumption('performanceSalesTarget', v)} min={0} max={100} step={1} kind="number" />
            <AssumptionInput label="Performance Incentive Rate" tooltip={assumptionTooltips.performanceIncentiveRate} value={assumptions.performanceIncentiveRate} onChange={(v) => updateAssumption('performanceIncentiveRate', v)} min={0} max={0.2} step={0.01} kind="percent" />
            <AssumptionInput label="New POS Target Rate" tooltip={assumptionTooltips.newPosTargetRate} value={assumptions.newPosTargetRate} onChange={(v) => updateAssumption('newPosTargetRate', v)} min={0} max={0.1} step={0.01} kind="percent" />
            <AssumptionInput label="New POS Incentive" tooltip={assumptionTooltips.newPosIncentive} value={assumptions.newPosIncentive} onChange={(v) => updateAssumption('newPosIncentive', v)} min={0} max={100_000} step={1_000} kind="currency" />
            <AssumptionInput label="Stock Collection Fee per Unit" tooltip={assumptionTooltips.stockCollectionFeePerUnit} value={assumptions.stockCollectionFeePerUnit} onChange={(v) => updateAssumption('stockCollectionFeePerUnit', v)} min={0} max={10_000} step={100} kind="currency" />
            <AssumptionInput label="DStv Hardware Value" tooltip={assumptionTooltips.dstvHardwareValue} value={assumptions.dstvHardwareValue} onChange={(v) => updateAssumption('dstvHardwareValue', v)} min={0} max={100_000} step={500} kind="currency" />
            <AssumptionInput label="GOtv Hardware Value" tooltip={assumptionTooltips.gotvHardwareValue} value={assumptions.gotvHardwareValue} onChange={(v) => updateAssumption('gotvHardwareValue', v)} min={0} max={100_000} step={500} kind="currency" />
            <AssumptionInput label="Expected Revenue Uplift from Mega Dealer Incentive" tooltip={assumptionTooltips.revenueUpliftFromMegaDealer} value={assumptions.revenueUpliftFromMegaDealer} onChange={(v) => updateAssumption('revenueUpliftFromMegaDealer', v)} min={0} max={0.2} step={0.01} kind="percent" />
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-[#12263f]">Live Financial Impact</h4>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <KPICard title="Revenue" value={result.scenarioRevenue} accent="navy" badge="Output" />
              <KPICard title="Costs" value={result.totalCostsWithIncentive} accent="orange" badge="Output" />
              <KPICard title="Profit" value={result.scenarioProfitAfterIncentive} accent="green" badge="Output" />
              <KPICard title="Margin" value={result.scenarioMarginAfterIncentive} format="percent" accent="cyan" badge="Output" />
            </div>
          </section>

          <ScenarioComparison base={baseResult} current={result} />

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-[#12263f]">Mega Dealer Incentive Scenario</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              The incentive is modeled as an incremental cost. It does not change revenue unless an additional revenue-uplift assumption is explicitly introduced.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <KPICard title="Incentive Amount" value={result.megaDealerRenewableIncentive} accent="purple" badge="Assumption" />
              <KPICard title="Profit Before Incentive" value={result.scenarioProfitBeforeIncentive} accent="green" badge="Output" />
              <KPICard title="Profit After Incentive" value={result.scenarioProfitAfterIncentive} accent="navy" badge="Output" />
              <KPICard title="Margin Before" value={result.scenarioMarginBeforeIncentive} format="percent" accent="cyan" badge="Output" />
              <KPICard title="Margin After" value={result.scenarioMarginAfterIncentive} format="percent" accent="yellow" badge="Output" />
              <KPICard title="Cost Increase" value={result.costIncreaseFromIncentive} accent="magenta" badge="Output" />
              <KPICard title="Profit Reduction" value={result.profitReductionFromIncentive} accent="magenta" badge="Output" />
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm border-l-4 border-l-violet-500">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Margin Change</p>
                <p className="mt-2 text-xl font-bold text-[#12263f]">{formatPercent(result.marginChangeFromIncentive)}</p>
              </div>
            </div>

            <ChartCard title="Incentive Bridge" className="mt-4" badge="Output">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bridge}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => formatUGXCompact(v)} width={70} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(_v, _n, item) => { const row = item?.payload as { display: number; name: string }; return [formatUGX(row.display), row.name]; }} />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Bar dataKey="base" stackId="a" fill="transparent" />
                  <Bar dataKey="size" stackId="a" radius={[6, 6, 0, 0]}>
                    {bridge.map((b) => (
                      <Cell key={b.name} fill={b.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>
        </div>
      </div>
    </div>
  );
}
