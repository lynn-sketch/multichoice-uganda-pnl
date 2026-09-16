import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { availablePeriods, defaultAssumptions } from '../data/august2026';
import { calculatePnL } from '../lib/calculations';
import {
  createSavedScenario,
  loadSavedScenarios,
  persistSavedScenarios,
} from '../lib/scenarioStorage';
import { generateInsights } from '../services/insightService';
import { subscriptionPackages } from '../data/august2026';
import { getBaselineDataQuality } from '../services/dataQualityService';
import type {
  Assumptions,
  BrandFilter,
  CalculationResult,
  DashboardFilters,
  DataQualitySummary,
  ImportStep,
  InsightCardData,
  PageId,
  SavedScenario,
} from '../types';

const defaultFilters: DashboardFilters = {
  brand: 'All',
  packageId: null,
  partnerId: null,
  partnerType: 'All',
  qualification: 'All',
  salesRangeMin: null,
  salesRangeMax: null,
  search: '',
};

interface ScenarioContextValue {
  page: PageId;
  setPage: (page: PageId) => void;
  assumptions: Assumptions;
  updateAssumption: <K extends keyof Assumptions>(
    key: K,
    value: Assumptions[K],
  ) => void;
  setAssumptions: (next: Assumptions) => void;
  resetAssumptions: () => void;
  result: CalculationResult;
  baseResult: CalculationResult;
  insights: InsightCardData[];
  savedScenarios: SavedScenario[];
  saveScenario: (name: string) => SavedScenario;
  deleteScenario: (id: string) => void;
  loadScenario: (id: string) => void;
  compareA: string | null;
  compareB: string | null;
  setCompareA: (id: string | null) => void;
  setCompareB: (id: string | null) => void;
  filters: DashboardFilters;
  setBrandFilter: (brand: BrandFilter) => void;
  setPackageFilter: (id: string | null) => void;
  setPartnerFilter: (id: string | null) => void;
  updateFilters: (patch: Partial<DashboardFilters>) => void;
  clearFilters: () => void;
  presentationMode: boolean;
  setPresentationMode: (on: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (on: boolean) => void;
  selectedPeriodId: string;
  setSelectedPeriodId: (id: string) => void;
  periods: typeof availablePeriods;
  dataQuality: DataQualitySummary;
  importStep: ImportStep;
  setImportStep: (step: ImportStep) => void;
  excludedAnomalyIds: Set<string>;
  toggleAnomalyExclusion: (id: string) => void;
  refreshing: boolean;
  refresh: () => void;
}

const ScenarioContext = createContext<ScenarioContextValue | null>(null);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>('dashboard');
  const [assumptions, setAssumptions] = useState<Assumptions>({
    ...defaultAssumptions,
  });
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(() =>
    loadSavedScenarios(),
  );
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [presentationMode, setPresentationMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPeriodId, setSelectedPeriodId] = useState(
    availablePeriods[0]?.id ?? '2026-08',
  );
  const [importStep, setImportStep] = useState<ImportStep>('upload');
  const [excludedAnomalyIds, setExcludedAnomalyIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [refreshing, setRefreshing] = useState(false);
  const dataQuality = useMemo(() => getBaselineDataQuality(), []);

  const result = useMemo(() => calculatePnL(assumptions), [assumptions]);
  const baseResult = useMemo(() => calculatePnL(defaultAssumptions), []);
  const insights = useMemo(
    () =>
      generateInsights(
        result,
        subscriptionPackages,
        assumptions.performanceSalesTarget,
      ),
    [result, assumptions.performanceSalesTarget],
  );

  const updateAssumption = useCallback(
    <K extends keyof Assumptions>(key: K, value: Assumptions[K]) => {
      setAssumptions((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetAssumptions = useCallback(() => {
    setAssumptions({ ...defaultAssumptions });
  }, []);

  const saveScenario = useCallback(
    (name: string) => {
      const scenario = createSavedScenario(name, assumptions);
      setSavedScenarios((prev) => {
        const next = [scenario, ...prev];
        persistSavedScenarios(next);
        return next;
      });
      return scenario;
    },
    [assumptions],
  );

  const deleteScenario = useCallback((id: string) => {
    setSavedScenarios((prev) => {
      const next = prev.filter((s) => s.id !== id);
      persistSavedScenarios(next);
      return next;
    });
    setCompareA((prev) => (prev === id ? null : prev));
    setCompareB((prev) => (prev === id ? null : prev));
  }, []);

  const loadScenario = useCallback(
    (id: string) => {
      const found = savedScenarios.find((s) => s.id === id);
      if (found) setAssumptions({ ...found.assumptions });
    },
    [savedScenarios],
  );

  const setBrandFilter = useCallback((brand: BrandFilter) => {
    setFilters((prev) => ({ ...prev, brand }));
  }, []);

  const setPackageFilter = useCallback((id: string | null) => {
    setFilters((prev) => ({ ...prev, packageId: id }));
  }, []);

  const setPartnerFilter = useCallback((id: string | null) => {
    setFilters((prev) => ({ ...prev, partnerId: id }));
  }, []);

  const updateFilters = useCallback((patch: Partial<DashboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const clearFilters = useCallback(() => setFilters(defaultFilters), []);

  const toggleAnomalyExclusion = useCallback((id: string) => {
    setExcludedAnomalyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  }, []);

  const value = useMemo(
    () => ({
      page,
      setPage,
      assumptions,
      updateAssumption,
      setAssumptions,
      resetAssumptions,
      result,
      baseResult,
      insights,
      savedScenarios,
      saveScenario,
      deleteScenario,
      loadScenario,
      compareA,
      compareB,
      setCompareA,
      setCompareB,
      filters,
      setBrandFilter,
      setPackageFilter,
      setPartnerFilter,
      updateFilters,
      clearFilters,
      presentationMode,
      setPresentationMode,
      sidebarCollapsed,
      setSidebarCollapsed,
      selectedPeriodId,
      setSelectedPeriodId,
      periods: availablePeriods,
      dataQuality,
      importStep,
      setImportStep,
      excludedAnomalyIds,
      toggleAnomalyExclusion,
      refreshing,
      refresh,
    }),
    [
      page,
      assumptions,
      updateAssumption,
      resetAssumptions,
      result,
      baseResult,
      insights,
      savedScenarios,
      saveScenario,
      deleteScenario,
      loadScenario,
      compareA,
      compareB,
      filters,
      setBrandFilter,
      setPackageFilter,
      setPartnerFilter,
      updateFilters,
      clearFilters,
      presentationMode,
      sidebarCollapsed,
      selectedPeriodId,
      dataQuality,
      importStep,
      excludedAnomalyIds,
      toggleAnomalyExclusion,
      refreshing,
      refresh,
    ],
  );

  return (
    <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>
  );
}

export function useScenario() {
  const ctx = useContext(ScenarioContext);
  if (!ctx) throw new Error('useScenario must be used within ScenarioProvider');
  return ctx;
}
