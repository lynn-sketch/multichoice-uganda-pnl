import { useState, type ReactNode } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ScenarioProvider, useScenario } from './context/ScenarioContext';
import { downloadCsv, formatPercent, formatUGX } from './lib/format';
import { PERIOD_LABEL } from './data/august2026';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { AssumptionsPage } from './pages/AssumptionsPage';
import { CostsPage } from './pages/CostsPage';
import { DashboardPage } from './pages/DashboardPage';
import { DataImportPage } from './pages/DataImportPage';
import { DataManagementPage } from './pages/DataManagementPage';
import { DataPage } from './pages/DataPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { DistributionPage } from './pages/DistributionPage';
import { ForecastingPage } from './pages/ForecastingPage';
import { HardwarePage } from './pages/HardwarePage';
import { PartnersPage } from './pages/PartnersPage';
import { PnLPage } from './pages/PnLPage';
import { RevenuePage } from './pages/RevenuePage';
import { ScenarioComparePage } from './pages/ScenarioComparePage';
import { SimulatorPage } from './pages/SimulatorPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { TrendsPage } from './pages/TrendsPage';
import type { PageId } from './types';

function AppShell() {
  const {
    page,
    setPage,
    result,
    assumptions,
    resetAssumptions,
    saveScenario,
    presentationMode,
    setPresentationMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    selectedPeriodId,
    setSelectedPeriodId,
    periods,
    dataQuality,
    refreshing,
    refresh,
  } = useScenario();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [scenarioName, setScenarioName] = useState('Base Case');

  const periodLabel =
    periods.find((p) => p.id === selectedPeriodId)?.label ?? PERIOD_LABEL;

  const handleExport = () => {
    downloadCsv(`multichoice-uganda-pnl-scenario-${Date.now()}.csv`, [
      ['Metric', 'Value'],
      ['Period', periodLabel],
      ['Company', 'MultiChoice Uganda'],
      ['DStv Hardware Value', assumptions.dstvHardwareValue],
      ['GOtv Hardware Value', assumptions.gotvHardwareValue],
      ['Hardware Commission per Unit', assumptions.hardwareCommissionPerUnit],
      ['Mega Dealer Subscription Commission', assumptions.megaDealerSubscriptionCommission],
      ['POS Subscription Commission', assumptions.posSubscriptionCommission],
      ['Performance Sales Target', assumptions.performanceSalesTarget],
      ['Performance Incentive Rate', assumptions.performanceIncentiveRate],
      ['New POS Target Rate', assumptions.newPosTargetRate],
      ['New POS Incentive', assumptions.newPosIncentive],
      ['Stock Collection Fee per Unit', assumptions.stockCollectionFeePerUnit],
      ['Mega Dealer Renewable Incentive', assumptions.megaDealerRenewableIncentive],
      ['Revenue Uplift', assumptions.revenueUpliftFromMegaDealer],
      ['Total Revenue', result.baseRevenue],
      ['Scenario Revenue', result.scenarioRevenue],
      ['Hardware Commission', result.hardwareCommission],
      ['Subscription Commission', result.subscriptionCommission],
      ['Performance Incentive', result.performanceIncentive],
      ['New POS Incentive Cost', result.newPosIncentiveCost],
      ['Stock Collection Fee', result.stockCollectionFee],
      ['Total Base Costs', result.totalBaseCosts],
      ['Base Profit', result.baseProfit],
      ['Base Profit Margin', result.baseProfitMargin],
      ['Total Costs With Incentive', result.totalCostsWithIncentive],
      ['Profit After Incentive', result.profitAfterIncentive],
      ['Profit Margin After Incentive', result.profitMarginAfterIncentive],
      ['Break-even Uplift %', result.breakEvenUpliftPercentage],
    ]);
  };

  return (
    <div className={`flex min-h-screen bg-dashboard ${presentationMode ? 'presentation-mode' : ''}`}>
      <Sidebar
        page={page}
        onNavigate={setPage}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        presentationMode={presentationMode}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenu={() => setSidebarOpen(true)}
          onReset={() => setShowResetConfirm(true)}
          onSave={() => setShowSaveModal(true)}
          onExport={handleExport}
          onRefresh={refresh}
          onTogglePresentation={() => setPresentationMode(!presentationMode)}
          presentationMode={presentationMode}
          refreshing={refreshing}
          periodLabel={periodLabel}
          periods={periods}
          selectedPeriodId={selectedPeriodId}
          onPeriodChange={setSelectedPeriodId}
          dataStatus={dataQuality.status}
          hideEditingControls={presentationMode}
        />
        <main className="flex-1 px-4 py-5 sm:px-6 print:px-0">
          <PageRouter page={page} />
          {!presentationMode && (
            <footer className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-400 print:mt-4">
              MultiChoice Uganda · {periodLabel} Sales Analytics & P&L Intelligence ·{' '}
              {formatUGX(result.baseRevenue)} total revenue · Margin after incentive{' '}
              {formatPercent(result.profitMarginAfterIncentive)}
            </footer>
          )}
        </main>
      </div>

      {showResetConfirm && (
        <Modal
          title="Reset Assumptions?"
          onClose={() => setShowResetConfirm(false)}
          onConfirm={() => {
            resetAssumptions();
            setShowResetConfirm(false);
          }}
          confirmLabel="Reset to defaults"
        >
          <p className="text-sm text-slate-600">
            This restores all editable assumptions to the August 2026 base case defaults,
            including a 0% revenue uplift. Source data is never edited.
          </p>
        </Modal>
      )}

      {showSaveModal && (
        <Modal
          title="Save Scenario"
          onClose={() => setShowSaveModal(false)}
          onConfirm={() => {
            if (!scenarioName.trim()) return;
            saveScenario(scenarioName.trim());
            setShowSaveModal(false);
          }}
          confirmLabel="Save"
        >
          <label className="block text-xs font-semibold text-[#12263f]">Scenario name</label>
          <input
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder="e.g. 30M Incentive"
            list="scenario-suggestions"
          />
          <datalist id="scenario-suggestions">
            <option value="Base Case" />
            <option value="30M Incentive" />
            <option value="20M Incentive" />
            <option value="Lower POS Commission" />
            <option value="High Growth Case" />
          </datalist>
        </Modal>
      )}
    </div>
  );
}

function PageRouter({ page }: { page: PageId }) {
  switch (page) {
    case 'dashboard':
      return <DashboardPage />;
    case 'pnl':
      return <PnLPage />;
    case 'revenue':
      return <RevenuePage />;
    case 'subscriptions':
      return <SubscriptionsPage />;
    case 'hardware':
      return <HardwarePage />;
    case 'partners':
      return <PartnersPage />;
    case 'trends':
      return <TrendsPage />;
    case 'distribution':
      return <DistributionPage />;
    case 'anomalies':
      return <AnomaliesPage />;
    case 'forecasting':
      return <ForecastingPage />;
    case 'simulator':
      return <SimulatorPage />;
    case 'scenario-compare':
      return <ScenarioComparePage />;
    case 'data-import':
      return <DataImportPage />;
    case 'data-quality':
      return <DataQualityPage />;
    case 'data-management':
      return <DataManagementPage />;
    case 'assumptions':
      return <AssumptionsPage />;
    case 'costs':
      return <CostsPage />;
    case 'data':
      return <DataPage />;
    default:
      return <DashboardPage />;
  }
}

function Modal({
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1626]/50 p-4 print:hidden">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-bold text-[#12263f]">{title}</h3>
        <div className="mt-3">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-xl bg-[#12263f] px-4 py-2 text-sm font-semibold text-white"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ScenarioProvider>
      <AppShell />
    </ScenarioProvider>
  );
}
