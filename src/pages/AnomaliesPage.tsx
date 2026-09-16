import { useMemo, useState } from 'react';
import { EmptyState, PageHeader } from '../components/EmptyState';
import { KPICard, KPIGrid } from '../components/KPICard';
import { useScenario } from '../context/ScenarioContext';
import { subscriptionPackages } from '../data/august2026';
import {
  detectAnomalies,
  type AnomalyMetricKey,
} from '../services/anomalyService';
import { formatNumber, formatUGX } from '../lib/format';

const metricOptions: { id: AnomalyMetricKey; label: string }[] = [
  { id: 'packageRevenue', label: 'Package Revenue' },
  { id: 'packageVolume', label: 'Package Sales Volume' },
  { id: 'partnerUnits', label: 'Partner Matched Units' },
  { id: 'partnerSalesValue', label: 'Partner Hardware Sales Value' },
];

export function AnomaliesPage() {
  const { result, excludedAnomalyIds, toggleAnomalyExclusion } = useScenario();
  const [metric, setMetric] = useState<AnomalyMetricKey>('packageRevenue');
  const [method, setMethod] = useState<'IQR' | 'Z-score'>('IQR');

  const series = useMemo(() => {
    if (metric === 'packageRevenue') {
      return subscriptionPackages.map((p) => ({
        id: p.id,
        label: p.name,
        value: p.revenue,
      }));
    }
    if (metric === 'packageVolume') {
      return subscriptionPackages.map((p) => ({
        id: p.id,
        label: p.name,
        value: p.salesVolume,
      }));
    }
    if (metric === 'partnerUnits') {
      return result.allPartners.map((p) => ({
        id: p.id,
        label: p.partner,
        value: p.matchedUnits,
      }));
    }
    return result.allPartners.map((p) => ({
      id: p.id,
      label: p.partner,
      value: p.knownHardwareSalesValue,
    }));
  }, [metric, result.allPartners]);

  const anomalies = detectAnomalies(metric, series, method, excludedAnomalyIds);
  const included = anomalies.filter((a) => !a.excluded);
  const excluded = anomalies.filter((a) => a.excluded);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Anomaly Detection"
        subtitle="Transparent statistical screening. Source data is never deleted — exclusions affect analysis views only."
      />

      <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="text-xs font-semibold text-slate-600">
          Metric
          <select
            className="ml-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={metric}
            onChange={(e) => setMetric(e.target.value as AnomalyMetricKey)}
          >
            {metricOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-600">
          Method
          <select
            className="ml-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={method}
            onChange={(e) => setMethod(e.target.value as 'IQR' | 'Z-score')}
          >
            <option value="IQR">IQR</option>
            <option value="Z-score">Z-score</option>
          </select>
        </label>
      </div>

      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs text-cyan-950">
        <strong>Method:</strong> {method}.{' '}
        {method === 'IQR'
          ? 'Flags values below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR.'
          : 'Flags values with |z| ≥ 2 relative to the current distribution.'}{' '}
        Monthly revenue/profit anomaly screening requires multiple periods and is currently unavailable.
      </div>

      <KPIGrid>
        <KPICard title="Flagged Observations" value={anomalies.length} format="number" accent="yellow" badge="Statistical" />
        <KPICard title="Included in Analysis" value={included.length} format="number" accent="cyan" badge="Analysis View" />
        <KPICard title="Excluded from Analysis" value={excluded.length} format="number" accent="orange" badge="Analysis View" />
        <KPICard title="Series Size" value={series.length} format="number" accent="navy" badge="Observed Data" />
      </KPIGrid>

      {anomalies.length === 0 ? (
        <EmptyState
          title="No statistical anomalies flagged"
          description="No observations meet the selected method threshold for the current metric and dataset."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-[#12263f] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Label</th>
                <th className="px-4 py-3 text-right">Value</th>
                <th className="px-4 py-3 text-left">Method</th>
                <th className="px-4 py-3 text-left">Reason Flagged</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((a) => (
                <tr key={a.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{a.label}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {metric.includes('Revenue') || metric.includes('Sales')
                      ? formatUGX(a.value)
                      : formatNumber(a.value)}
                  </td>
                  <td className="px-4 py-3">{a.method}</td>
                  <td className="px-4 py-3 text-slate-600">{a.reason}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                        a.excluded
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {a.excluded ? 'Excluded' : 'Included'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold"
                      onClick={() => toggleAnomalyExclusion(a.id)}
                    >
                      {a.excluded ? 'Include' : 'Exclude from analysis'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
