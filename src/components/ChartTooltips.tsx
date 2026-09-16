import { formatUGX } from '../lib/format';

interface CurrencyTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string; payload?: Record<string, unknown> }>;
  label?: string | number;
}

export function CurrencyTooltip({ active, payload, label }: CurrencyTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label !== undefined && (
        <p className="mb-1 font-semibold text-[#12263f]">{label}</p>
      )}
      {payload.map((entry) => (
        <p key={String(entry.name)} className="text-slate-600">
          <span style={{ color: entry.color }}>{entry.name}: </span>
          <span className="font-semibold text-[#12263f]">
            {formatUGX(Number(entry.value ?? 0))}
          </span>
        </p>
      ))}
    </div>
  );
}

interface NumberTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string | number;
}

export function NumberTooltip({ active, payload, label }: NumberTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label !== undefined && (
        <p className="mb-1 font-semibold text-[#12263f]">{label}</p>
      )}
      {payload.map((entry) => (
        <p key={String(entry.name)} className="text-slate-600">
          <span style={{ color: entry.color }}>{entry.name}: </span>
          <span className="font-semibold text-[#12263f]">
            {Number(entry.value ?? 0).toLocaleString('en-UG')}
          </span>
        </p>
      ))}
    </div>
  );
}
