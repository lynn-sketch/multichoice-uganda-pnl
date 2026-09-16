import { InfoTooltip } from './InfoTooltip';
import { formatNumber, formatPercentInput } from '../lib/format';

interface AssumptionInputProps {
  label: string;
  tooltip: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  kind?: 'currency' | 'percent' | 'number';
  showSlider?: boolean;
}

export function AssumptionInput({
  label,
  tooltip,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  kind = 'number',
  showSlider = true,
}: AssumptionInputProps) {
  const displayValue =
    kind === 'percent' ? Number((value * 100).toFixed(4)) : value;

  const handleNumberChange = (raw: string) => {
    const num = Number(raw);
    if (Number.isNaN(num)) return;
    if (kind === 'percent') onChange(num / 100);
    else onChange(num);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-semibold text-navy-900">{label}</label>
          <InfoTooltip text={tooltip} />
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-800">
            Input
          </span>
        </div>
        <span className="text-xs font-semibold text-cyan-700">
          {kind === 'percent'
            ? formatPercentInput(value, value * 100 % 1 === 0 ? 0 : 2)
            : kind === 'currency'
              ? `UGX ${formatNumber(value)}`
              : formatNumber(value)}
        </span>
      </div>
      {showSlider && (
        <input
          type="range"
          min={kind === 'percent' ? min * 100 : min}
          max={kind === 'percent' ? max * 100 : max}
          step={kind === 'percent' ? step * 100 : step}
          value={displayValue}
          onChange={(e) => handleNumberChange(e.target.value)}
          className="mb-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-cyan-600"
        />
      )}
      <input
        type="number"
        min={kind === 'percent' ? min * 100 : min}
        max={kind === 'percent' ? max * 100 : max}
        step={kind === 'percent' ? step * 100 : step}
        value={displayValue}
        onChange={(e) => handleNumberChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
      />
    </div>
  );
}
