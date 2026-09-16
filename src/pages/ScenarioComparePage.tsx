import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { CurrencyTooltip } from '../components/ChartTooltips';
import { PageHeader } from '../components/EmptyState';
import { useScenario } from '../context/ScenarioContext';
import { calculatePnL } from '../lib/calculations';
import { formatPercent, formatUGX, formatUGXCompact } from '../lib/format';
import { chartColors } from '../theme/tokens';

export function ScenarioComparePage() {
  const {
    baseResult,
    result,
    savedScenarios,
    compareA,
    compareB,
    setCompareA,
    setCompareB,
    loadScenario,
  } = useScenario();

  const scenarioA = savedScenarios.find((s) => s.id === compareA);
  const scenarioB = savedScenarios.find((s) => s.id === compareB);
  const resultA = scenarioA ? calculatePnL(scenarioA.assumptions) : result;
  const resultB = scenarioB ? calculatePnL(scenarioB.assumptions) : null;

  const labelA = scenarioA?.name ?? 'Current Scenario';
  const labelB = scenarioB?.name ?? 'Scenario B';

  const chartData = [
    {
      metric: 'Revenue',
      Base: baseResult.baseRevenue,
      [labelA]: resultA.scenarioRevenue,
      ...(resultB ? { [labelB]: resultB.scenarioRevenue } : {}),
    },
    {
      metric: 'Costs',
      Base: baseResult.totalCostsWithIncentive,
      [labelA]: resultA.totalCostsWithIncentive,
      ...(resultB ? { [labelB]: resultB.totalCostsWithIncentive } : {}),
    },
    {
      metric: 'Profit',
      Base: baseResult.profitAfterIncentive,
      [labelA]: resultA.scenarioProfitAfterIncentive,
      ...(resultB ? { [labelB]: resultB.scenarioProfitAfterIncentive } : {}),
    },
  ];

  const tableRows = [
    {
      label: 'Revenue',
      base: baseResult.baseRevenue,
      a: resultA.scenarioRevenue,
      b: resultB?.scenarioRevenue,
    },
    {
      label: 'Costs',
      base: baseResult.totalCostsWithIncentive,
      a: resultA.totalCostsWithIncentive,
      b: resultB?.totalCostsWithIncentive,
    },
    {
      label: 'Profit',
      base: baseResult.profitAfterIncentive,
      a: resultA.scenarioProfitAfterIncentive,
      b: resultB?.scenarioProfitAfterIncentive,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scenario Comparison"
        subtitle="Compare Base Case against saved scenarios. All figures come from the central calculation engine."
      />

      <div className="grid gap-3 md:grid-cols-2">
        <SelectBox
          label="Scenario A"
          value={compareA}
          onChange={setCompareA}
          scenarios={savedScenarios}
          onLoad={loadScenario}
        />
        <SelectBox
          label="Scenario B"
          value={compareB}
          onChange={setCompareB}
          scenarios={savedScenarios}
          onLoad={loadScenario}
        />
      </div>

      <ChartCard title="Revenue / Costs / Profit Comparison" badge="Output">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="metric" />
            <YAxis tickFormatter={(v) => formatUGXCompact(v)} width={70} tick={{ fontSize: 10 }} />
            <Tooltip content={<CurrencyTooltip />} />
            <Legend />
            <Bar dataKey="Base" fill={chartColors.revenueAlt} radius={[6, 6, 0, 0]} />
            <Bar dataKey={labelA} fill={chartColors.revenue} radius={[6, 6, 0, 0]} />
            {resultB && <Bar dataKey={labelB} fill={chartColors.scenario} radius={[6, 6, 0, 0]} />}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-[#12263f] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Metric</th>
              <th className="px-4 py-3 text-right">Base</th>
              <th className="px-4 py-3 text-right">{labelA}</th>
              <th className="px-4 py-3 text-right">Difference</th>
              <th className="px-4 py-3 text-right">Difference %</th>
              {resultB && <th className="px-4 py-3 text-right">{labelB}</th>}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => {
              const diff = row.a - row.base;
              const pct = row.base === 0 ? 0 : diff / row.base;
              return (
                <tr key={row.label} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{row.label}</td>
                  <td className="px-4 py-3 text-right">{formatUGX(row.base)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatUGX(row.a)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${diff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatUGX(diff)}
                  </td>
                  <td className="px-4 py-3 text-right">{formatPercent(pct)}</td>
                  {resultB && row.b != null && (
                    <td className="px-4 py-3 text-right">{formatUGX(row.b)}</td>
                  )}
                </tr>
              );
            })}
            <tr>
              <td className="px-4 py-3 font-medium">Margin</td>
              <td className="px-4 py-3 text-right">{formatPercent(baseResult.profitMarginAfterIncentive)}</td>
              <td className="px-4 py-3 text-right font-semibold">{formatPercent(resultA.scenarioMarginAfterIncentive)}</td>
              <td className="px-4 py-3 text-right">
                {formatPercent(resultA.scenarioMarginAfterIncentive - baseResult.profitMarginAfterIncentive)}
              </td>
              <td className="px-4 py-3 text-right">—</td>
              {resultB && (
                <td className="px-4 py-3 text-right">{formatPercent(resultB.scenarioMarginAfterIncentive)}</td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  scenarios,
  onLoad,
}: {
  label: string;
  value: string | null;
  onChange: (id: string | null) => void;
  scenarios: { id: string; name: string }[];
  onLoad: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="text-xs font-semibold text-[#12263f]">{label}</label>
      <select
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">Current live scenario</option>
        {scenarios.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      {value && (
        <button
          type="button"
          className="mt-2 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white"
          onClick={() => onLoad(value)}
        >
          Load into live model
        </button>
      )}
    </div>
  );
}
