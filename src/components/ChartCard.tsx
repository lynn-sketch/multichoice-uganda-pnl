import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Download, FileImage, FileSpreadsheet } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';
import {
  exportChartDataCsv,
  exportElementPng,
  periodSlug,
} from '../lib/exportService';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  tooltip?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
  heightClass?: string;
  empty?: boolean;
  emptyMessage?: string;
  /** Optional rows for CSV download of underlying chart data. */
  exportData?: (string | number)[][];
  periodLabel?: string;
}

export function ChartCard({
  title,
  subtitle,
  tooltip,
  badge,
  children,
  className = '',
  heightClass = 'h-64',
  empty = false,
  emptyMessage = 'No data available for this view.',
  exportData,
  periodLabel = 'August_2026',
}: ChartCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const downloadPng = async () => {
    if (!cardRef.current) return;
    setMenuOpen(false);
    const safe = title.replace(/\s+/g, '_').replace(/[^A-Za-z0-9_-]/g, '');
    await exportElementPng(
      cardRef.current,
      `MultiChoice_${safe}_${periodSlug(periodLabel)}.png`,
    );
  };

  const downloadCsv = () => {
    if (!exportData?.length) return;
    setMenuOpen(false);
    exportChartDataCsv(title, periodLabel, exportData);
  };

  return (
    <section
      ref={cardRef}
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(18,38,63,0.06),0_8px_24px_rgba(18,38,63,0.04)] ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#12263f]">{title}</h3>
            {tooltip && <InfoTooltip text={tooltip} />}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {badge && (
            <span className="rounded-md bg-cyan-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-700">
              {badge}
            </span>
          )}
          {!empty && (
            <div className="relative print:hidden export-hide" ref={menuRef}>
              <button
                type="button"
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
                aria-label={`Download ${title}`}
                title="Download chart"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <Download className="h-3.5 w-3.5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-40 mt-1 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium hover:bg-cyan-50"
                    onClick={() => void downloadPng()}
                  >
                    <FileImage className="h-3.5 w-3.5" />
                    Download PNG
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium hover:bg-cyan-50 disabled:opacity-40"
                    disabled={!exportData?.length}
                    onClick={downloadCsv}
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    Download data as CSV
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {empty ? (
        <div
          className={`flex ${heightClass} items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-sm text-slate-500`}
        >
          {emptyMessage}
        </div>
      ) : (
        <div className={`w-full ${heightClass}`}>{children}</div>
      )}
    </section>
  );
}
