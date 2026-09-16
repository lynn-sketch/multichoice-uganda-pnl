import { formatPercent, formatUGX, formatUGXCompact } from '../lib/format';
import type { CalculationResult } from '../types';

interface ScenarioComparisonProps {
  base: CalculationResult;
  current: CalculationResult;
  title?: string;
}

export function ScenarioComparison({
  base,
  current,
  title = 'Base Case vs Current Scenario',
}: ScenarioComparisonProps) {
  const rows = [
    {
      label: 'Revenue',
      base: base.baseRevenue,
      current: current.scenarioRevenue,
      format: 'currency' as const,
    },
    {
      label: 'Costs',
      base: base.totalCostsWithIncentive,
      current: current.totalCostsWithIncentive,
      format: 'currency' as const,
    },
    {
      label: 'Profit',
      base: base.profitAfterIncentive,
      current: current.scenarioProfitAfterIncentive,
      format: 'currency' as const,
    },
    {
      label: 'Margin',
      base: base.profitMarginAfterIncentive,
      current: current.scenarioMarginAfterIncentive,
      format: 'percent' as const,
    },
  ];

  const profitDelta =
    current.scenarioProfitAfterIncentive - base.profitAfterIncentive;
  const costDelta =
    current.totalCostsWithIncentive - base.totalCostsWithIncentive;
  const marginDelta =
    current.scenarioMarginAfterIncentive - base.profitMarginAfterIncentive;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">
        Neutral comparison of financial effect. No recommendation is implied.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2 font-semibold">Metric</th>
              <th className="py-2 font-semibold">Base Case</th>
              <th className="py-2 font-semibold">Current Scenario</th>
              <th className="py-2 font-semibold">Change</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const delta = row.current - row.base;
              return (
                <tr key={row.label} className="border-b border-slate-100">
                  <td className="py-3 font-medium text-navy-900">{row.label}</td>
                  <td className="py-3 text-slate-600" title={formatUGX(row.base)}>
                    {row.format === 'percent'
                      ? formatPercent(row.base)
                      : formatUGXCompact(row.base)}
                  </td>
                  <td className="py-3 font-semibold text-navy-900" title={formatUGX(row.current)}>
                    {row.format === 'percent'
                      ? formatPercent(row.current)
                      : formatUGXCompact(row.current)}
                  </td>
                  <td className={`py-3 font-semibold ${deltaClass(delta)}`}>
                    {row.format === 'percent'
                      ? `${delta >= 0 ? '+' : ''}${formatPercent(delta)}`
                      : `${delta >= 0 ? '+' : ''}${formatUGXCompact(delta)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <DeltaChip label="Change in Profit" value={profitDelta} kind="currency" />
        <DeltaChip label="Change in Costs" value={costDelta} kind="currency" />
        <DeltaChip label="Change in Margin" value={marginDelta} kind="percent" />
      </div>
    </section>
  );
}

function DeltaChip({
  label,
  value,
  kind,
}: {
  label: string;
  value: number;
  kind: 'currency' | 'percent';
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-sm font-bold ${deltaClass(value)}`}>
        {kind === 'percent'
          ? `${value >= 0 ? '+' : ''}${formatPercent(value)}`
          : `${value >= 0 ? '+' : ''}${formatUGXCompact(value)}`}
      </p>
    </div>
  );
}

function deltaClass(value: number): string {
  if (value > 0) return 'text-emerald-600';
  if (value < 0) return 'text-rose-600';
  return 'text-slate-600';
}
