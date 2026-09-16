import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { NumberTooltip } from '../components/ChartTooltips';
import { EmptyState, PageHeader } from '../components/EmptyState';
import { KPICard, KPIGrid } from '../components/KPICard';
import { useScenario } from '../context/ScenarioContext';
import { subscriptionPackages } from '../data/august2026';
import { buildDistributionAnalytics } from '../services/analyticsService';
import { histogramBins, iqrBounds } from '../services/statisticsService';
import { chartColors } from '../theme/tokens';
import { formatNumber, formatPercent, formatUGX } from '../lib/format';

export function DistributionPage() {
  const { result } = useScenario();
  const dist = buildDistributionAnalytics(result.allPartners);
  const packageHist = histogramBins(
    subscriptionPackages.map((p) => p.salesVolume),
    5,
  );

  const unitBounds = iqrBounds(result.allPartners.map((p) => p.matchedUnits));
  const outliers = result.allPartners.filter((p) => {
    if (!unitBounds) return false;
    return p.matchedUnits > unitBounds.upper || p.matchedUnits < unitBounds.lower;
  });

  if (dist.insufficient) {
    return (
      <div className="space-y-6">
        <PageHeader title="Distribution Analysis" subtitle="Cross-sectional distributions for the current period." />
        <EmptyState
          title="Insufficient observations"
          description="At least two partner observations are required for distribution analytics."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Distribution Analysis"
        subtitle="Partner and package distributions for the currently loaded period. Neutral statistical language only."
      />

      <KPIGrid>
        <KPICard title="Median Partner Units" value={dist.medianUnits ?? 0} format="number" accent="cyan" badge="Statistical" />
        <KPICard title="Top 10% Unit Share" value={dist.top10Share} format="percent" accent="purple" badge="Statistical" />
        <KPICard title="Partner Count (matched)" value={result.allPartners.length} format="number" accent="navy" badge="Source Data" />
        <KPICard title="Statistical Outliers (units)" value={outliers.length} format="number" accent="yellow" badge="Statistical" />
      </KPIGrid>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Partner Sales Histogram" subtitle="Matched units distribution" badge="Statistical">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dist.unitHistogram}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} />
              <Tooltip content={<NumberTooltip />} />
              <Bar dataKey="count" name="Partners" fill={chartColors.revenue} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Partner Hardware Value Distribution" badge="Statistical">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dist.valueHistogram}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 9 }} />
              <YAxis allowDecimals={false} />
              <Tooltip content={<NumberTooltip />} />
              <Bar dataKey="count" name="Partners" fill={chartColors.incentive} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Package Sales Volume Distribution" badge="Statistical">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={packageHist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 9 }} />
              <YAxis allowDecimals={false} />
              <Tooltip content={<NumberTooltip />} />
              <Bar dataKey="count" name="Packages" fill={chartColors.profit} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Box-plot Summary (Partner Units)" badge="Statistical">
          {dist.boxUnits ? (
            <div className="flex h-full flex-col justify-center gap-2 px-2 text-sm">
              <Row label="Min" value={formatNumber(dist.boxUnits.min)} />
              <Row label="Q1" value={formatNumber(dist.boxUnits.q1, 1)} />
              <Row label="Median" value={formatNumber(dist.boxUnits.median, 1)} />
              <Row label="Q3" value={formatNumber(dist.boxUnits.q3, 1)} />
              <Row label="Max" value={formatNumber(dist.boxUnits.max)} />
            </div>
          ) : (
            <EmptyState title="Unavailable" description="Not enough data for a box-plot summary." />
          )}
        </ChartCard>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-[#12263f]">Outlier Identification (IQR)</h4>
        <p className="mt-1 text-xs text-slate-500">
          Observations outside Q1 − 1.5×IQR or Q3 + 1.5×IQR. Labels are statistical, not performance judgements.
        </p>
        {outliers.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No statistical outliers identified in the current matched partner unit distribution.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {outliers.map((p) => {
              const high = unitBounds && p.matchedUnits > unitBounds.upper;
              return (
                <li key={p.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <strong>{p.partner}</strong> — {formatNumber(p.matchedUnits)} units ·{' '}
                  {high
                    ? 'Unusually high relative to current distribution'
                    : 'Unusually low relative to current distribution'}{' '}
                  · Known value {formatUGX(p.knownHardwareSalesValue)}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
        Top 10% of matched partners by units account for {formatPercent(dist.top10Share)} of matched units
        in this dataset.
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-[#12263f]">{value}</span>
    </div>
  );
}
