export interface HardwareSourceData {
  dstvUnits: number;
  gotvUnits: number;
  classifiedSubscriptionRevenue: number;
  estimatedUngroupedPadRevenue: number;
  activePartnerBase: number;
}

export interface Assumptions {
  dstvHardwareValue: number;
  gotvHardwareValue: number;
  hardwareCommissionPerUnit: number;
  megaDealerSubscriptionCommission: number;
  posSubscriptionCommission: number;
  performanceSalesTarget: number;
  performanceIncentiveRate: number;
  newPosTargetRate: number;
  newPosIncentive: number;
  stockCollectionFeePerUnit: number;
  megaDealerRenewableIncentive: number;
  revenueUpliftFromMegaDealer: number;
}

export type PartnerType = 'Dealer' | 'POS' | 'Mega Dealer' | 'Unknown';

export interface PartnerHardwareRow {
  id: string;
  partner: string;
  partnerType: PartnerType;
  dstvUnits: number;
  gotvUnits: number;
  knownHardwareSalesValue: number;
  matchedUnits: number;
}

export interface SubscriptionPackage {
  id: string;
  name: string;
  brand: 'DStv' | 'GOtv';
  revenue: number;
  salesVolume: number;
}

export interface PartnerIncentiveResult extends PartnerHardwareRow {
  qualifies: boolean;
  estimatedIncentive: number;
}

export interface CalculationResult {
  dstvHardwareRevenue: number;
  gotvHardwareRevenue: number;
  totalHardwareUnits: number;
  totalHardwareRevenue: number;
  subscriptionRevenue: number;
  baseRevenue: number;
  scenarioRevenue: number;
  hardwareCommission: number;
  subscriptionCommission: number;
  performanceIncentive: number;
  qualifyingSalesValue: number;
  qualifyingPartners: PartnerIncentiveResult[];
  allPartners: PartnerIncentiveResult[];
  newPosCount: number;
  newPosIncentiveCost: number;
  stockCollectionFee: number;
  totalBaseCosts: number;
  baseProfit: number;
  baseProfitMargin: number;
  megaDealerRenewableIncentive: number;
  totalCostsWithIncentive: number;
  profitAfterIncentive: number;
  profitMarginAfterIncentive: number;
  costIncreaseFromIncentive: number;
  profitReductionFromIncentive: number;
  marginChangeFromIncentive: number;
  breakEvenUpliftPercentage: number;
  scenarioBaseCosts: number;
  scenarioProfitBeforeIncentive: number;
  scenarioProfitAfterIncentive: number;
  scenarioMarginBeforeIncentive: number;
  scenarioMarginAfterIncentive: number;
}

export interface SavedScenario {
  id: string;
  name: string;
  createdAt: string;
  assumptions: Assumptions;
}

export type BrandFilter = 'All' | 'DStv' | 'GOtv';

export interface DashboardFilters {
  brand: BrandFilter;
  packageId: string | null;
  partnerId: string | null;
  partnerType: PartnerType | 'All';
  qualification: 'All' | 'Qualifies' | 'Does Not Qualify';
  salesRangeMin: number | null;
  salesRangeMax: number | null;
  search: string;
}

export type DataStatus = 'validated' | 'warnings' | 'errors' | 'empty';

export type ImportStep =
  | 'upload'
  | 'validate'
  | 'map'
  | 'process'
  | 'review'
  | 'approve';

export interface DataQualityIssue {
  id: string;
  type: 'missing' | 'duplicate' | 'unmatched' | 'warning' | 'failed';
  column?: string;
  message: string;
  recordIds?: string[];
  severity: 'info' | 'warning' | 'error';
}

export interface DataQualitySummary {
  rowsImported: number;
  validRows: number;
  warnings: number;
  failedRows: number;
  duplicates: number;
  missingValues: number;
  unmatchedRecords: number;
  score: number;
  issues: DataQualityIssue[];
  status: DataStatus;
}

export interface AnomalyRecord {
  id: string;
  metric: string;
  label: string;
  value: number;
  method: 'IQR' | 'Z-score';
  reason: string;
  excluded: boolean;
}

export interface InsightCardData {
  id: string;
  title: string;
  body: string;
  category: 'revenue' | 'cost' | 'profit' | 'partner' | 'subscription' | 'scenario';
}

export interface PeriodMeta {
  id: string;
  label: string;
  isCurrent: boolean;
}

export type PageId =
  | 'dashboard'
  | 'pnl'
  | 'revenue'
  | 'subscriptions'
  | 'hardware'
  | 'partners'
  | 'trends'
  | 'distribution'
  | 'anomalies'
  | 'forecasting'
  | 'simulator'
  | 'scenario-compare'
  | 'data-import'
  | 'data-quality'
  | 'data-management'
  | 'assumptions'
  // legacy aliases kept for compatibility
  | 'costs'
  | 'data';

export interface NavSection {
  id: string;
  label: string;
  items: { id: PageId; label: string }[];
}

export interface DescriptiveStats {
  count: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  p25: number;
  p75: number;
  p90: number;
}
