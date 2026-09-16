import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Download, FileImage, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';

export type ExportAction =
  | 'pdf'
  | 'png'
  | 'pnl-xlsx'
  | 'full-xlsx'
  | 'table'
  | 'scenario';

interface ExportMenuProps {
  onAction: (action: ExportAction) => void | Promise<void>;
  busy?: boolean;
}

const items: { id: ExportAction; label: string; icon: typeof Download }[] = [
  { id: 'pdf', label: 'Download Dashboard as PDF', icon: FileText },
  { id: 'png', label: 'Download Dashboard as PNG', icon: FileImage },
  { id: 'pnl-xlsx', label: 'Export P&L to Excel (.xlsx)', icon: FileSpreadsheet },
  { id: 'full-xlsx', label: 'Export Full Analysis to Excel (.xlsx)', icon: FileSpreadsheet },
  { id: 'table', label: 'Export Current Table to Excel/CSV', icon: FileSpreadsheet },
  { id: 'scenario', label: 'Export Current Scenario', icon: Download },
];

export function ExportMenu({ onAction, busy }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="relative print:hidden" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#12263f] shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        <span className="hidden sm:inline">Export</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-[#12263f] hover:bg-cyan-50"
                onClick={async () => {
                  setOpen(false);
                  await onAction(item.id);
                }}
              >
                <Icon className="h-3.5 w-3.5 text-slate-500" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
