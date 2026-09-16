import { EmptyState, PageHeader } from '../components/EmptyState';
import { InsightGrid } from '../components/InsightCard';
import { KPICard, KPIGrid } from '../components/KPICard';
import { useScenario } from '../context/ScenarioContext';
import { subscriptionPackages } from '../data/august2026';
import { concentrationTopN, describe, herfindahl } from '../services/statisticsService';
import { formatNumber, formatPercent, formatUGX } from '../lib/format';

export function TrendsPage() {
  const { result, insights, assumptions } = useScenario();

  const packageRevenues = subscriptionPackages.map((p) => p.revenue);
  const packageStats = describe(packageRevenues);
  const partnerUnits = result.allPartners.map((p) => p.matchedUnits);
  const partnerStats = describe(partnerUnits);
  const costValues = [
    result.hardwareCommission,
    result.subscriptionCommission,
    result.performanceIncentive,
    result.newPosIncentiveCost,
    result.stockCollectionFee,
  ];
  const costShares = costValues.map((v) => v / Math.max(1, result.totalBaseCosts));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trends & Insights"
        subtitle="Descriptive analytics workspace. Time-based growth metrics appear only when historical periods exist."
      />

      <EmptyState
        icon="chart"
        title="Growth rates require history"
        description="Revenue growth, profit growth, margin movement and mix movement over time need at least two reporting periods. Cross-sectional concentration statistics below use the current August 2026 dataset."
      />

      <section>
        <h4 className="mb-3 text-sm font-semibold text-[#12263f]">Automated Insights</h4>
        <InsightGrid insights={insights} />
      </section>

      <KPIGrid>
        <KPICard title="Package Top-1 Concentration" value={concentrationTopN(packageRevenues, 1)} format="percent" accent="purple" badge="Statistical" tooltip="Share of classified package revenue from the largest package." />
        <KPICard title="Partner Top Concentration" value={concentrationTopN(partnerUnits, 1)} format="percent" accent="yellow" badge="Statistical" tooltip="Share of matched units from the highest-volume matched partner." />
        <KPICard title="Cost HHI" value={herfindahl(costShares)} format="number" accent="orange" badge="Statistical" subtitle="Higher = more concentrated cost structure" />
        <KPICard title="Hardware Mix" value={result.totalHardwareRevenue / Math.max(1, result.baseRevenue)} format="percent" accent="cyan" badge="Calculated" />
        <KPICard title="Subscription Mix" value={result.subscriptionRevenue / Math.max(1, result.baseRevenue)} format="percent" accent="navy" badge="Calculated" />
        <KPICard title="Performance Incentive" value={result.performanceIncentive} accent="magenta" badge="Output" subtitle={`Target ${assumptions.performanceSalesTarget} units`} />
      </KPIGrid>

      {packageStats && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="text-sm font-semibold text-[#12263f]">Package Revenue Distribution Stats</h4>
          <p className="mt-1 text-xs text-slate-500">Observed classified package revenues (current period only).</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Mean" value={formatUGX(packageStats.mean)} />
            <Stat label="Median" value={formatUGX(packageStats.median)} />
            <Stat label="Min" value={formatUGX(packageStats.min)} />
            <Stat label="Max" value={formatUGX(packageStats.max)} />
            <Stat label="Std Dev" value={formatUGX(packageStats.stdDev)} />
            <Stat label="P25" value={formatUGX(packageStats.p25)} />
            <Stat label="P75" value={formatUGX(packageStats.p75)} />
            <Stat label="P90" value={formatUGX(packageStats.p90)} />
          </div>
        </div>
      )}

      {partnerStats && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="text-sm font-semibold text-[#12263f]">Matched Partner Units Stats</h4>
          <p className="mt-1 text-xs text-slate-500">Based on currently matched partners only (n={formatNumber(partnerStats.count)}).</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Mean" value={formatNumber(partnerStats.mean, 1)} />
            <Stat label="Median" value={formatNumber(partnerStats.median, 1)} />
            <Stat label="Min" value={formatNumber(partnerStats.min)} />
            <Stat label="Max" value={formatNumber(partnerStats.max)} />
            <Stat label="Std Dev" value={formatNumber(partnerStats.stdDev, 1)} />
            <Stat label="P25" value={formatNumber(partnerStats.p25, 1)} />
            <Stat label="P75" value={formatNumber(partnerStats.p75, 1)} />
            <Stat label="P90" value={formatNumber(partnerStats.p90, 1)} />
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <UnavailableCard title="Revenue growth rate" />
        <UnavailableCard title="Profit growth rate" />
        <UnavailableCard title="Margin movement (period)" />
        <UnavailableCard title="Hardware / subscription mix movement" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#12263f]">{value}</p>
    </div>
  );
}

function UnavailableCard({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5">
      <p className="text-sm font-semibold text-[#12263f]">{title}</p>
      <p className="mt-1 text-xs text-slate-500">
        Insufficient historical periods. Metric shown as unavailable rather than fabricated.
      </p>
      <p className="mt-2 text-xs font-semibold text-slate-400">{formatPercent(0).replace('0.00%', '—')}</p>
    </div>
  );
}
