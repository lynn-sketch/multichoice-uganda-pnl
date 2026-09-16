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

/** Assumptions settings page — same editable model as Scenario Simulator. */
export function AssumptionsPage() {
  const { assumptions, updateAssumption, resetAssumptions } = useScenario();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assumptions"
        subtitle="Business assumptions feed the central calculation engine used by every dashboard."
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <h4 className="text-sm font-semibold text-[#12263f]">Source Data (Read Only)</h4>
          <InfoTooltip text="Observed August 2026 inputs. Cannot be edited from the dashboard." />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ReadOnly label="DStv Units" value={formatNumber(hardwareSourceData.dstvUnits)} />
          <ReadOnly label="GOtv Units" value={formatNumber(hardwareSourceData.gotvUnits)} />
          <ReadOnly label="Active Partner Base" value={formatNumber(hardwareSourceData.activePartnerBase)} />
          <ReadOnly label="Classified Subscription Revenue" value={formatUGX(hardwareSourceData.classifiedSubscriptionRevenue)} />
          <ReadOnly label="Ungrouped PAD" value={formatUGX(hardwareSourceData.estimatedUngroupedPadRevenue)} />
          <ReadOnly label="Matched Partners" value={formatNumber(partnerHardwareData.length)} />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Defaults reference: Mega Dealer commission {formatPercent(defaultAssumptions.megaDealerSubscriptionCommission, 0)}, POS {formatPercent(defaultAssumptions.posSubscriptionCommission, 0)}, incentive {formatUGX(defaultAssumptions.megaDealerRenewableIncentive)}.
        </p>
      </section>
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#12263f]">{value}</p>
    </div>
  );
}
