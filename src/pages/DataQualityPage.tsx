import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { NumberTooltip } from '../components/ChartTooltips';
import { PageHeader } from '../components/EmptyState';
import { KPICard, KPIGrid } from '../components/KPICard';
import { useScenario } from '../context/ScenarioContext';
import { chartColors } from '../theme/tokens';

export function DataQualityPage() {
  const { dataQuality } = useScenario();
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(
    dataQuality.issues[0]?.id ?? null,
  );
  const selected = dataQuality.issues.find((i) => i.id === selectedIssueId);

  const byType = [
    { name: 'Warnings', value: dataQuality.warnings },
    { name: 'Failed', value: dataQuality.failedRows },
    { name: 'Duplicates', value: dataQuality.duplicates },
    { name: 'Missing', value: dataQuality.missingValues },
    { name: 'Unmatched', value: dataQuality.unmatchedRecords },
  ];

  const statusDist = [
    { name: 'Valid', value: dataQuality.validRows },
    { name: 'Warnings', value: dataQuality.warnings },
    { name: 'Failed', value: dataQuality.failedRows },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Quality"
        subtitle="Validation outcomes for the currently loaded August 2026 dataset."
      />

      <KPIGrid>
        <KPICard title="Rows Imported" value={dataQuality.rowsImported} format="number" accent="navy" badge="Observed" />
        <KPICard title="Valid Rows" value={dataQuality.validRows} format="number" accent="green" badge="Observed" />
        <KPICard title="Warnings" value={dataQuality.warnings} format="number" accent="yellow" badge="Observed" />
        <KPICard title="Failed Rows" value={dataQuality.failedRows} format="number" accent="magenta" badge="Observed" />
        <KPICard title="Duplicates" value={dataQuality.duplicates} format="number" accent="orange" badge="Observed" />
        <KPICard title="Missing Values" value={dataQuality.missingValues} format="number" accent="cyan" badge="Observed" />
        <KPICard title="Unmatched Records" value={dataQuality.unmatchedRecords} format="number" accent="purple" badge="Observed" />
        <KPICard title="Data Quality Score" value={dataQuality.score / 100} format="percent" accent="green" badge="Calculated" subtitle={`${dataQuality.score}/100`} />
      </KPIGrid>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Data Quality Score" badge="Calculated">
          <div className="flex h-full flex-col items-center justify-center">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-cyan-500">
              <span className="text-3xl font-bold text-[#12263f]">{dataQuality.score}</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">Composite score for the embedded period dataset</p>
          </div>
        </ChartCard>

        <ChartCard title="Issues by Type" badge="Observed">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip content={<NumberTooltip />} />
              <Bar dataKey="value" name="Count" fill={chartColors.warning} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Validation Status Distribution" badge="Observed">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusDist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85}>
                <Cell fill={chartColors.profit} />
                <Cell fill={chartColors.warning} />
                <Cell fill={chartColors.error} />
              </Pie>
              <Tooltip content={<NumberTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Missing Values by Column" badge="Observed" empty={dataQuality.missingValues === 0} emptyMessage="No missing values detected in the currently loaded dataset.">
          <div />
        </ChartCard>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-[#12263f] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Column</th>
              <th className="px-4 py-3 text-left">Message</th>
              <th className="px-4 py-3 text-left">Severity</th>
            </tr>
          </thead>
          <tbody>
            {dataQuality.issues.map((issue) => (
              <tr
                key={issue.id}
                className={`cursor-pointer border-b border-slate-100 hover:bg-slate-50 ${
                  selectedIssueId === issue.id ? 'bg-cyan-50' : ''
                }`}
                onClick={() => setSelectedIssueId(issue.id)}
              >
                <td className="px-4 py-3 font-medium">{issue.type}</td>
                <td className="px-4 py-3">{issue.column ?? '—'}</td>
                <td className="px-4 py-3 text-slate-600">{issue.message}</td>
                <td className="px-4 py-3 uppercase text-[10px] font-bold">{issue.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
          <strong>Selected issue:</strong> {selected.message}
          {selected.recordIds?.length ? (
            <p className="mt-1 text-xs">Affected records: {selected.recordIds.join(', ')}</p>
          ) : (
            <p className="mt-1 text-xs">No row-level record IDs attached to this issue.</p>
          )}
        </div>
      )}
    </div>
  );
}
