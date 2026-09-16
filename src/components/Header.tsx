import {
  Download,
  Maximize2,
  Menu,
  Minimize2,
  RefreshCw,
  Save,
  RotateCcw,
} from 'lucide-react';
import type { DataStatus } from '../types';

interface HeaderProps {
  onMenu: () => void;
  onReset: () => void;
  onSave: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onTogglePresentation: () => void;
  presentationMode: boolean;
  refreshing: boolean;
  periodLabel: string;
  periods: { id: string; label: string }[];
  selectedPeriodId: string;
  onPeriodChange: (id: string) => void;
  dataStatus: DataStatus;
  hideEditingControls?: boolean;
}

export function Header({
  onMenu,
  onReset,
  onSave,
  onExport,
  onRefresh,
  onTogglePresentation,
  presentationMode,
  refreshing,
  periodLabel,
  periods,
  selectedPeriodId,
  onPeriodChange,
  dataStatus,
  hideEditingControls,
}: HeaderProps) {
  const statusLabel =
    dataStatus === 'validated'
      ? 'Data Status: Validated'
      : dataStatus === 'warnings'
        ? 'Data Status: Warnings Detected'
        : dataStatus === 'errors'
          ? 'Data Status: Errors Detected'
          : 'Data Status: No Data';

  const statusClass =
    dataStatus === 'validated'
      ? 'bg-emerald-50 text-emerald-700'
      : dataStatus === 'warnings'
        ? 'bg-amber-50 text-amber-800'
        : dataStatus === 'errors'
          ? 'bg-rose-50 text-rose-700'
          : 'bg-slate-100 text-slate-600';

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur print:static print:border-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <div className="flex items-start gap-3">
          {!presentationMode && (
            <button
              type="button"
              className="mt-1 rounded-lg border border-slate-200 p-2 text-[#12263f] lg:hidden print:hidden"
              onClick={onMenu}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-700">
              MultiChoice Uganda
            </p>
            <h2 className="text-lg font-bold text-[#12263f] sm:text-xl">
              Sales Analytics & P&L Intelligence
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <label className="text-xs text-slate-500">
                Reporting Period
                <select
                  className="ml-2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-[#12263f]"
                  value={selectedPeriodId}
                  onChange={(e) => onPeriodChange(e.target.value)}
                >
                  {periods.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClass}`}>
                {statusLabel}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                {periodLabel}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <ActionButton
            icon={RefreshCw}
            label="Refresh"
            onClick={onRefresh}
            spinning={refreshing}
          />
          <ActionButton icon={Download} label="Export" onClick={onExport} />
          <ActionButton
            icon={presentationMode ? Minimize2 : Maximize2}
            label={presentationMode ? 'Exit Present' : 'Presentation'}
            onClick={onTogglePresentation}
          />
          {!hideEditingControls && !presentationMode && (
            <>
              <ActionButton icon={RotateCcw} label="Reset" onClick={onReset} />
              <ActionButton icon={Save} label="Save Scenario" onClick={onSave} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  spinning,
}: {
  icon: typeof Save;
  label: string;
  onClick: () => void;
  spinning?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#12263f] shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50"
    >
      <Icon className={`h-3.5 w-3.5 ${spinning ? 'animate-spin' : ''}`} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
