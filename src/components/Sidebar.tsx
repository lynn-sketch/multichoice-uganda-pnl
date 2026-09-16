import {
  AlertTriangle,
  BarChart3,
  Calculator,
  Database,
  FileSpreadsheet,
  GitCompare,
  HardDrive,
  LayoutDashboard,
  LineChart,
  Package,
  PieChart,
  ScanSearch,
  Settings2,
  ShieldCheck,
  TrendingUp,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import type { PageId } from '../types';

const sections: {
  label: string;
  items: { id: PageId; label: string; icon: LucideIcon }[];
}[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
      { id: 'pnl', label: 'P&L Analysis', icon: BarChart3 },
    ],
  },
  {
    label: 'Commercial Analytics',
    items: [
      { id: 'revenue', label: 'Revenue Analytics', icon: PieChart },
      { id: 'subscriptions', label: 'Subscription Analytics', icon: Package },
      { id: 'hardware', label: 'Hardware Analytics', icon: HardDrive },
      { id: 'partners', label: 'Partner Analytics', icon: Users },
    ],
  },
  {
    label: 'Data Science',
    items: [
      { id: 'trends', label: 'Trends & Insights', icon: TrendingUp },
      { id: 'distribution', label: 'Distribution Analysis', icon: LineChart },
      { id: 'anomalies', label: 'Anomaly Detection', icon: ScanSearch },
      { id: 'forecasting', label: 'Forecasting', icon: AlertTriangle },
    ],
  },
  {
    label: 'Planning',
    items: [
      { id: 'simulator', label: 'Scenario Simulator', icon: Calculator },
      { id: 'scenario-compare', label: 'Scenario Comparison', icon: GitCompare },
    ],
  },
  {
    label: 'Data',
    items: [
      { id: 'data-import', label: 'Data Import', icon: FileSpreadsheet },
      { id: 'data-quality', label: 'Data Quality', icon: ShieldCheck },
      { id: 'data-management', label: 'Data Management', icon: Database },
    ],
  },
  {
    label: 'Settings',
    items: [{ id: 'assumptions', label: 'Assumptions', icon: Settings2 }],
  },
];

interface SidebarProps {
  page: PageId;
  onNavigate: (page: PageId) => void;
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  presentationMode: boolean;
}

export function Sidebar({
  page,
  onNavigate,
  open,
  onClose,
  collapsed,
  onToggleCollapse,
  presentationMode,
}: SidebarProps) {
  if (presentationMode) return null;

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-[#0b1626]/40 lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#12263f] text-white shadow-xl transition-all duration-200 lg:static lg:translate-x-0 print:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-[72px]' : 'w-64'}`}
      >
        <div className={`border-b border-white/10 ${collapsed ? 'px-3 py-4' : 'px-5 py-5'}`}>
          {!collapsed ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                MultiChoice
              </p>
              <h1 className="mt-1 text-base font-bold leading-tight">Uganda Analytics</h1>
              <p className="mt-1 text-[11px] text-slate-300">Sales P&L Intelligence</p>
            </>
          ) : (
            <p className="text-center text-xs font-bold text-cyan-300">MC</p>
          )}
        </div>
        <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-4">
          {sections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = page === item.id || (page === 'costs' && item.id === 'pnl') || (page === 'data' && item.id === 'assumptions');
                  return (
                    <button
                      key={item.id}
                      type="button"
                      title={item.label}
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                        active
                          ? 'bg-cyan-500/20 text-cyan-200'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      } ${collapsed ? 'justify-center' : ''}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            {!collapsed && 'Collapse'}
          </button>
        </div>
      </aside>
    </>
  );
}
