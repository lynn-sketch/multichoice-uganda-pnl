import { PageHeader } from '../components/EmptyState';
import { useScenario } from '../context/ScenarioContext';
import {
  hardwareSourceData,
  partnerHardwareData,
  PERIOD_LABEL,
  subscriptionPackages,
} from '../data/august2026';
import { formatNumber, formatUGX } from '../lib/format';

export function DataManagementPage() {
  const { periods, selectedPeriodId, dataQuality } = useScenario();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Management"
        subtitle="Registered reporting periods and locked source datasets. Editing source values from dashboards is not permitted."
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-[#12263f] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Period</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Quality Score</th>
              <th className="px-4 py-3 text-left">Current</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((p) => (
              <tr key={p.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium">{p.label}</td>
                <td className="px-4 py-3 capitalize">{dataQuality.status}</td>
                <td className="px-4 py-3 text-right">{dataQuality.score}</td>
                <td className="px-4 py-3">
                  {p.id === selectedPeriodId ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-800">
                      Selected
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-[#12263f]">
          {PERIOD_LABEL} Source Snapshot (Read Only)
        </h4>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="DStv Units" value={formatNumber(hardwareSourceData.dstvUnits)} />
          <Field label="GOtv Units" value={formatNumber(hardwareSourceData.gotvUnits)} />
          <Field label="Active Partners" value={formatNumber(hardwareSourceData.activePartnerBase)} />
          <Field label="Classified Subscription Revenue" value={formatUGX(hardwareSourceData.classifiedSubscriptionRevenue)} />
          <Field label="Ungrouped PAD Revenue" value={formatUGX(hardwareSourceData.estimatedUngroupedPadRevenue)} />
          <Field label="Subscription Packages" value={formatNumber(subscriptionPackages.length)} />
          <Field label="Matched Partners" value={formatNumber(partnerHardwareData.length)} />
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#12263f]">{value}</p>
    </div>
  );
}
