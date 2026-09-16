import { formatPercent, formatUGX } from '../lib/format';
import type { CalculationResult } from '../types';

interface PnLTableProps {
  result: CalculationResult;
}

export function PnLTable({ result }: PnLTableProps) {
  const rows = [
    { label: 'Total Revenue', value: result.baseRevenue, tone: 'revenue' },
    { label: 'Hardware Commission', value: -result.hardwareCommission, tone: 'cost' },
    { label: 'Subscription Commission', value: -result.subscriptionCommission, tone: 'cost' },
    { label: 'Performance Incentive', value: -result.performanceIncentive, tone: 'cost' },
    { label: 'New POS Incentive', value: -result.newPosIncentiveCost, tone: 'cost' },
    { label: 'Stock Collection Fee', value: -result.stockCollectionFee, tone: 'cost' },
    { label: 'Base Profit', value: result.baseProfit, tone: 'subtotal' },
    { label: 'Base Profit Margin', value: result.baseProfitMargin, tone: 'margin' },
    {
      label: 'Mega Dealer Renewable Incentive',
      value: -result.megaDealerRenewableIncentive,
      tone: 'cost',
    },
    { label: 'Profit After Incentive', value: result.profitAfterIncentive, tone: 'total' },
    {
      label: 'Profit Margin After Incentive',
      value: result.profitMarginAfterIncentive,
      tone: 'margin',
    },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[480px] text-sm">
        <thead className="bg-navy-900 text-white">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">P&L Line</th>
            <th className="px-4 py-3 text-right font-semibold">Amount</th>
            <th className="px-4 py-3 text-right font-semibold">Type</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className={`border-b border-slate-100 ${
                row.tone === 'subtotal' || row.tone === 'total'
                  ? 'bg-cyan-50/60 font-semibold'
                  : ''
              }`}
            >
              <td className="px-4 py-3 text-navy-900">{row.label}</td>
              <td className="px-4 py-3 text-right tabular-nums text-navy-900">
                {row.tone === 'margin'
                  ? formatPercent(row.value)
                  : formatUGX(row.value)}
              </td>
              <td className="px-4 py-3 text-right">
                <TypeBadge tone={row.tone} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TypeBadge({ tone }: { tone: string }) {
  const map: Record<string, string> = {
    revenue: 'bg-emerald-100 text-emerald-800',
    cost: 'bg-rose-100 text-rose-800',
    subtotal: 'bg-cyan-100 text-cyan-800',
    total: 'bg-navy-100 text-navy-800',
    margin: 'bg-violet-100 text-violet-800',
  };
  const labels: Record<string, string> = {
    revenue: 'Output',
    cost: 'Output',
    subtotal: 'Output',
    total: 'Output',
    margin: 'Output',
  };
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${map[tone]}`}>
      {labels[tone]}
    </span>
  );
}
