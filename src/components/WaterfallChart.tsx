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
import { chartColors } from '../theme/tokens';
import { formatUGX, formatUGXCompact } from '../lib/format';

interface WaterfallItem {
  name: string;
  value: number;
  kind: 'total' | 'cost' | 'subtotal';
}

export function WaterfallChart({ items }: { items: WaterfallItem[] }) {
  const data = buildWaterfallBars(items);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-25} textAnchor="end" height={70} />
        <YAxis tickFormatter={(v) => formatUGXCompact(v)} width={70} tick={{ fontSize: 10 }} />
        <Tooltip
          formatter={(_v, _n, item) => {
            const row = item?.payload as { display: number; name: string };
            return [formatUGX(row.display), row.name];
          }}
        />
        <ReferenceLine y={0} stroke="#94a3b8" />
        <Bar dataKey="base" stackId="a" fill="transparent" />
        <Bar dataKey="size" stackId="a" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function buildWaterfallBars(items: WaterfallItem[]) {
  let cumulative = 0;
  return items.map((item) => {
    if (item.kind === 'total' || item.kind === 'subtotal') {
      const base = item.value >= 0 ? 0 : item.value;
      cumulative = item.value;
      return {
        name: item.name,
        base,
        size: Math.abs(item.value),
        display: item.value,
        color: item.kind === 'total' ? chartColors.revenueAlt : chartColors.profit,
      };
    }
    const start = cumulative;
    cumulative += item.value;
    const isNegative = item.value < 0;
    return {
      name: item.name,
      base: isNegative ? cumulative : start,
      size: Math.abs(item.value),
      display: item.value,
      color: item.value >= 0 ? chartColors.profit : chartColors.costs,
    };
  });
}
