import { AssumptionInput } from '../components/AssumptionInput';
import { PageHeader } from '../components/EmptyState';
import { useScenario } from '../context/ScenarioContext';
import {
  assumptionTooltips,
  defaultAssumptions,
  hardwareSourceData,
  partnerHardwareData,
} from '../data/august2026';
import { formatNumber, formatPercent, formatUGX } from '../lib/format';
import { InfoTooltip } from '../components/InfoTooltip';

/** Settings → Assumptions (also covers legacy Data & Assumptions content). */
export function AssumptionsPage() {
  const { assumptions, updateAssumption, resetAssumptions } = useScenario();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assumptions"
        subtitle="Editable commercial assumptions. Source data below is locked. Changes recalculate the entire model instantly."
        actions={
          <button
            type="button"
            onClick={resetAssumptions}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
          >
            Reset to defaults
          </button>
        }
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <h4 className="text-sm font-semibold text-[#12263f]">Editable Assumptions</h4>
          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
            Business Assumptions
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <AssumptionInput label="DStv Hardware Value" tooltip={assumptionTooltips.dstvHardwareValue} value={assumptions.dstvHardwareValue} onChange={(v) => updateAssumption('dstvHardwareValue', v)} min={0} max={100_000} step={500} kind="currency" />
          <AssumptionInput label="GOtv Hardware Value" tooltip={assumptionTooltips.gotvHardwareValue} value={assumptions.gotvHardwareValue} onChange={(v) => updateAssumption('gotvHardwareValue', v)} min={0} max={100_000} step={500} kind="currency" />
          <AssumptionInput label="Hardware Commission per Unit" tooltip={assumptionTooltips.hardwareCommissionPerUnit} value={assumptions.hardwareCommissionPerUnit} onChange={(v) => updateAssumption('hardwareCommissionPerUnit', v)} min={0} max={20_000} step={100} kind="currency" />
          <AssumptionInput label="Mega Dealer Subscription Commission" tooltip={assumptionTooltips.megaDealerSubscriptionCommission} value={assumptions.megaDealerSubscriptionCommission} onChange={(v) => updateAssumption('megaDealerSubscriptionCommission', v)} min={0} max={0.2} step={0.01} kind="percent" />
          <AssumptionInput label="POS Subscription Commission" tooltip={assumptionTooltips.posSubscriptionCommission} value={assumptions.posSubscriptionCommission} onChange={(v) => updateAssumption('posSubscriptionCommission', v)} min={0} max={0.3} step={0.01} kind="percent" />
          <AssumptionInput label="Performance Sales Target" tooltip={assumptionTooltips.performanceSalesTarget} value={assumptions.performanceSalesTarget} onChange={(v) => updateAssumption('performanceSalesTarget', v)} min={0} max={100} step={1} kind="number" />
          <AssumptionInput label="Performance Incentive Rate" tooltip={assumptionTooltips.performanceIncentiveRate} value={assumptions.performanceIncentiveRate} onChange={(v) => updateAssumption('performanceIncentiveRate', v)} min={0} max={0.2} step={0.01} kind="percent" />
          <AssumptionInput label="New POS Target Rate" tooltip={assumptionTooltips.newPosTargetRate} value={assumptions.newPosTargetRate} onChange={(v) => updateAssumption('newPosTargetRate', v)} min={0} max={0.1} step={0.01} kind="percent" />
          <AssumptionInput label="New POS Incentive" tooltip={assumptionTooltips.newPosIncentive} value={assumptions.newPosIncentive} onChange={(v) => updateAssumption('newPosIncentive', v)} min={0} max={100_000} step={1_000} kind="currency" />
          <AssumptionInput label="Stock Collection Fee per Unit" tooltip={assumptionTooltips.stockCollectionFeePerUnit} value={assumptions.stockCollectionFeePerUnit} onChange={(v) => updateAssumption('stockCollectionFeePerUnit', v)} min={0} max={10_000} step={100} kind="currency" />
          <AssumptionInput label="Mega Dealer Renewable Incentive" tooltip={assumptionTooltips.megaDealerRenewableIncentive} value={assumptions.megaDealerRenewableIncentive} onChange={(v) => updateAssumption('megaDealerRenewableIncentive', v)} min={0} max={60_000_000} step={1_000_000} kind="currency" />
          <AssumptionInput label="Expected Revenue Uplift" tooltip={assumptionTooltips.revenueUpliftFromMegaDealer} value={assumptions.revenueUpliftFromMegaDealer} onChange={(v) => updateAssumption('revenueUpliftFromMegaDealer', v)} min={0} max={0.2} step={0.01} kind="percent" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <h4 className="text-sm font-semibold text-[#12263f]">August 2026 Source Data</h4>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
            Source Data — Read Only
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ReadOnlyField label="DStv Units" value={formatNumber(hardwareSourceData.dstvUnits)} />
          <ReadOnlyField label="GOtv Units" value={formatNumber(hardwareSourceData.gotvUnits)} />
          <ReadOnlyField label="Active Partner Base" value={formatNumber(hardwareSourceData.activePartnerBase)} />
          <ReadOnlyField label="Classified Subscription Revenue" value={formatUGX(hardwareSourceData.classifiedSubscriptionRevenue)} />
          <ReadOnlyField label="Estimated Ungrouped PAD Revenue" value={formatUGX(hardwareSourceData.estimatedUngroupedPadRevenue)} />
          <ReadOnlyField
            label="Default Mega Dealer Incentive"
            value={formatUGX(defaultAssumptions.megaDealerRenewableIncentive)}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <h4 className="text-sm font-semibold text-[#12263f]">Matched Partner Hardware Dataset</h4>
          <InfoTooltip text="Read-only source extract used for performance incentive modelling." />
        </div>
        <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          This dataset contains currently matched partners only and does not represent all{' '}
          {formatNumber(hardwareSourceData.activePartnerBase)} active partners.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-[#12263f] text-white">
              <tr>
                <th className="px-3 py-2 text-left">Partner</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-right">Matched</th>
                <th className="px-3 py-2 text-right">Known Value</th>
              </tr>
            </thead>
            <tbody>
              {partnerHardwareData.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="px-3 py-2">{p.partner}</td>
                  <td className="px-3 py-2">{p.partnerType}</td>
                  <td className="px-3 py-2 text-right font-semibold">{p.matchedUnits}</td>
                  <td className="px-3 py-2 text-right">{formatUGX(p.knownHardwareSalesValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Default POS commission {formatPercent(defaultAssumptions.posSubscriptionCommission, 0)} · Mega dealer commission{' '}
          {formatPercent(defaultAssumptions.megaDealerSubscriptionCommission, 0)}.
        </p>
      </section>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#12263f]">{value}</p>
    </div>
  );
}

/** Legacy export for old route id */
export { AssumptionsPage as DataPage };
