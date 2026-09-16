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
import { CurrencyTooltip } from '../components/ChartTooltips';
import { KPICard } from '../components/KPICard';
import { useScenario } from '../context/ScenarioContext';
import { formatPercent, formatUGX, formatUGXCompact } from '../lib/format';

const COLORS = ['#0ea5e9', '#1e3a5f', '#a855f7', '#10b981', '#f59e0b', '#ec4899'];

export function CostsPage() {
  const { result } = useScenario();

  const costs = [
    { name: 'Hardware Commission', value: result.hardwareCommission },
    { name: 'Subscription Commission', value: result.subscriptionCommission },
    { name: 'Performance Incentive', value: result.performanceIncentive },
    { name: 'New POS Incentive', value: result.newPosIncentiveCost },
    { name: 'Stock Collection Fee', value: result.stockCollectionFee },
    { name: 'Mega Dealer Incentive', value: result.megaDealerRenewableIncentive },
  ];

  const totalWithIncentive = result.totalCostsWithIncentive;
  const withShare = costs
    .map((c) => ({
      ...c,
      share: totalWithIncentive === 0 ? 0 : c.value / totalWithIncentive,
    }))
    .sort((a, b) => b.value - a.value);

  const baseOnly = [
    { name: 'Hardware Commission', value: result.hardwareCommission },
    { name: 'Subscription Commission', value: result.subscriptionCommission },
    { name: 'Performance Incentive', value: result.performanceIncentive },
    { name: 'New POS Incentive', value: result.newPosIncentiveCost },
    { name: 'Stock Collection Fee', value: result.stockCollectionFee },
  ].sort((a, b) => b.value - a.value);

  const topTwo = baseOnly.slice(0, 2);
  const highlightNote =
    topTwo.length === 2
      ? `${topTwo[0].name} and ${topTwo[1].name} are the largest base cost components in the current scenario.`
      : '';

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <KPICard title="Total Base Costs" value={result.totalBaseCosts} accent="magenta" badge="Output" />
        <KPICard
          title="Costs With Mega Dealer Incentive"
          value={result.totalCostsWithIncentive}
          accent="purple"
          badge="Output"
        />
        <KPICard
          title="Hardware Commission"
          value={result.hardwareCommission}
          accent="cyan"
          badge="Output"
        />
        <KPICard
          title="Subscription Commission"
          value={result.subscriptionCommission}
          accent="navy"
          badge="Output"
        />
        <KPICard
          title="Performance Incentive"
          value={result.performanceIncentive}
          accent="yellow"
          badge="Output"
        />
        <KPICard
          title="New POS Incentive"
          value={result.newPosIncentiveCost}
          accent="green"
          badge="Output"
          subtitle={`${result.newPosCount.toLocaleString('en-UG')} estimated new POS`}
        />
      </div>

      {highlightNote && (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          {highlightNote}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Cost Mix (including Mega Dealer Incentive)" badge="Output">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={withShare} dataKey="value" nameKey="name" outerRadius={90}>
                {withShare.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Cost Categories" badge="Output">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={withShare} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => formatUGXCompact(v)} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 10 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Bar dataKey="value" name="Cost" fill="#0ea5e9" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-navy-900 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Cost Category</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">% of Total Costs</th>
            </tr>
          </thead>
          <tbody>
            {withShare.map((row) => (
              <tr key={row.name} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium text-navy-900">{row.name}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatUGX(row.value)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatPercent(row.share)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
