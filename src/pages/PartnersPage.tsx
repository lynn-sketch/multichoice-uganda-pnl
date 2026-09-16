import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { CurrencyTooltip, NumberTooltip } from '../components/ChartTooltips';
import { PageHeader } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import { KPICard, KPIGrid } from '../components/KPICard';
import { PartnerTable } from '../components/PartnerTable';
import { useScenario } from '../context/ScenarioContext';
import { hardwareSourceData } from '../data/august2026';
import { filterPartners } from '../services/analyticsService';
import { chartColors } from '../theme/tokens';
import { formatUGXCompact } from '../lib/format';
import { histogramBins } from '../services/statisticsService';

export function PartnersPage() {
  const { result, assumptions, filters, setPartnerFilter } = useScenario();
  const [detailId, setDetailId] = useState<string | null>(null);

  const partners = useMemo(
    () => filterPartners(result.allPartners, filters),
    [result.allPartners, filters],
  );

  const knownValue = partners.reduce((s, p) => s + p.knownHardwareSalesValue, 0);
  const avgUnits =
    partners.length > 0
      ? partners.reduce((s, p) => s + p.matchedUnits, 0) / partners.length
      : 0;

  const byUnits = [...partners]
    .sort((a, b) => b.matchedUnits - a.matchedUnits)
    .map((p) => ({
      name: shortName(p.partner),
      id: p.id,
      value: p.matchedUnits,
    }));

  const byValue = [...partners]
    .sort((a, b) => b.knownHardwareSalesValue - a.knownHardwareSalesValue)
    .map((p) => ({
      name: shortName(p.partner),
      value: p.knownHardwareSalesValue,
    }));

  const stacked = partners.map((p) => ({
    name: shortName(p.partner),
    DStv: p.dstvUnits,
    GOtv: p.gotvUnits,
  }));

  const distribution = histogramBins(
    partners.map((p) => p.matchedUnits),
    Math.min(4, Math.max(2, partners.length)),
  );

  const selected = partners.find((p) => p.id === (detailId ?? filters.partnerId));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Analytics"
        subtitle="Performance based on the currently matched partner hardware dataset — not the full active partner base."
      />
      <FilterBar showBrand showSearch showPartnerType showQualification searchPlaceholder="Search partners…" />

      <KPIGrid>
        <KPICard title="Active Partners" value={hardwareSourceData.activePartnerBase} format="number" accent="navy" badge="Source Data" />
        <KPICard title="Avg Units / Matched Partner" value={avgUnits} format="number" accent="cyan" badge="Calculated" />
        <KPICard title="Qualifying Partners" value={partners.filter((p) => p.qualifies).length} format="number" accent="green" badge="Output" subtitle={`Target ≥ ${assumptions.performanceSalesTarget}`} />
        <KPICard title="Known Partner Hardware Sales Value" value={knownValue} accent="yellow" badge="Source Data" />
      </KPIGrid>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Top Partners by Units" subtitle="Reference line = performance sales target" badge="Source Data">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byUnits}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<NumberTooltip />} />
              <ReferenceLine y={assumptions.performanceSalesTarget} stroke={chartColors.incentive} strokeDasharray="4 4" label="Target" />
              <Bar dataKey="value" name="Matched Units" fill={chartColors.warning} radius={[6, 6, 0, 0]}
                onClick={(d) => {
                  const id = (d as { id?: string }).id;
                  if (id) {
                    setPartnerFilter(id);
                    setDetailId(id);
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Partners by Hardware Sales Value" badge="Source Data">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byValue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => formatUGXCompact(v)} width={70} tick={{ fontSize: 10 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Bar dataKey="value" name="Sales Value" fill={chartColors.incentive} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Partner Sales Distribution" subtitle="Matched units histogram" badge="Statistical">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip content={<NumberTooltip />} />
              <Bar dataKey="count" name="Partners" fill={chartColors.revenue} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="DStv vs GOtv Units by Partner" badge="Source Data">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stacked}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<NumberTooltip />} />
              <Legend />
              <Bar dataKey="DStv" stackId="a" fill={chartColors.dstv} />
              <Bar dataKey="GOtv" stackId="a" fill={chartColors.gotv} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {selected && (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
          <strong>{selected.partner}</strong> · {selected.partnerType} · Matched units {selected.matchedUnits} ·{' '}
          {selected.qualifies ? 'Qualifies' : 'Does not qualify'} · Estimated incentive{' '}
          {formatUGXCompact(selected.estimatedIncentive)}
        </div>
      )}

      <PartnerTable
        partners={partners}
        note="Performance calculations use the currently matched partner hardware dataset only and do not necessarily represent all 1,704 active partners."
      />
    </div>
  );
}

function shortName(name: string) {
  if (name.includes('Rahim')) return 'Rahim';
  if (name.includes('Impex')) return 'St. Impex';
  if (name.includes('Ericom')) return 'Ericom';
  if (name.includes('Nyanzi')) return 'Nyanzi';
  return name.slice(0, 14);
}
