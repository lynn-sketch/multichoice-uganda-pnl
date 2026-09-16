import {
  hardwareSourceData,
  historicalPeriods,
  subscriptionPackages,
} from '../data/august2026';
import type {
  BrandFilter,
  CalculationResult,
  DashboardFilters,
  PartnerIncentiveResult,
  SubscriptionPackage,
} from '../types';
import { concentrationTopN, describe, histogramBins, boxPlotSummary } from './statisticsService';

export function filterPackages(
  packages: SubscriptionPackage[],
  brand: BrandFilter,
  packageId: string | null,
  search = '',
): SubscriptionPackage[] {
  return packages.filter((p) => {
    if (brand !== 'All' && p.brand !== brand) return false;
    if (packageId && p.id !== packageId) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
}

export function filterPartners(
  partners: PartnerIncentiveResult[],
  filters: DashboardFilters,
): PartnerIncentiveResult[] {
  return partners.filter((p) => {
    if (filters.partnerType !== 'All' && p.partnerType !== filters.partnerType) return false;
    if (filters.qualification === 'Qualifies' && !p.qualifies) return false;
    if (filters.qualification === 'Does Not Qualify' && p.qualifies) return false;
    if (filters.partnerId && p.id !== filters.partnerId) return false;
    if (filters.brand === 'DStv' && p.dstvUnits <= 0) return false;
    if (filters.brand === 'GOtv' && p.gotvUnits <= 0) return false;
    if (filters.salesRangeMin != null && p.matchedUnits < filters.salesRangeMin) return false;
    if (filters.salesRangeMax != null && p.matchedUnits > filters.salesRangeMax) return false;
    if (
      filters.search &&
      !p.partner.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
}

export function packageAnalytics(
  packages: SubscriptionPackage[],
  subscriptionCommissionRate: number,
) {
  const totalRevenue = packages.reduce((s, p) => s + p.revenue, 0);
  const totalVolume = packages.reduce((s, p) => s + p.salesVolume, 0);
  return packages.map((p) => ({
    ...p,
    rateCard: p.salesVolume > 0 ? p.revenue / p.salesVolume : 0,
    revenueShare: totalRevenue === 0 ? 0 : p.revenue / totalRevenue,
    commission: p.revenue * subscriptionCommissionRate,
    totalRevenue,
    totalVolume,
  }));
}

export function buildExecutiveAnalytics(result: CalculationResult) {
  const classifiedPackages = subscriptionPackages;
  const dstvPkgRev = classifiedPackages
    .filter((p) => p.brand === 'DStv')
    .reduce((s, p) => s + p.revenue, 0);
  const gotvPkgRev = classifiedPackages
    .filter((p) => p.brand === 'GOtv')
    .reduce((s, p) => s + p.revenue, 0);

  return {
    revenueComposition: [
      { name: 'Hardware', value: result.totalHardwareRevenue, key: 'hardware' },
      { name: 'Subscription', value: result.subscriptionRevenue, key: 'subscription' },
    ],
    brandRevenue: [
      { name: 'DStv Hardware', value: result.dstvHardwareRevenue, brand: 'DStv' as const },
      { name: 'GOtv Hardware', value: result.gotvHardwareRevenue, brand: 'GOtv' as const },
      { name: 'DStv Packages', value: dstvPkgRev, brand: 'DStv' as const },
      { name: 'GOtv Packages', value: gotvPkgRev, brand: 'GOtv' as const },
    ],
    costBreakdown: [
      { name: 'Hardware Commission', value: result.hardwareCommission },
      { name: 'Subscription Commission', value: result.subscriptionCommission },
      { name: 'Performance Incentive', value: result.performanceIncentive },
      { name: 'New POS Incentive', value: result.newPosIncentiveCost },
      { name: 'Stock Collection Fee', value: result.stockCollectionFee },
    ],
    hasHistoricalTrends: historicalPeriods.length >= 1,
    activePartners: hardwareSourceData.activePartnerBase,
    matchedPartnerCount: result.allPartners.length,
  };
}

export function buildDistributionAnalytics(partners: PartnerIncentiveResult[]) {
  const units = partners.map((p) => p.matchedUnits);
  const values = partners.map((p) => p.knownHardwareSalesValue);
  const unitStats = describe(units);
  const valueStats = describe(values);
  const sorted = [...partners].sort((a, b) => b.matchedUnits - a.matchedUnits);
  const topCount = Math.max(1, Math.ceil(partners.length * 0.1));
  const top = sorted.slice(0, topCount);
  const topUnits = top.reduce((s, p) => s + p.matchedUnits, 0);
  const allUnits = units.reduce((a, b) => a + b, 0);

  return {
    unitStats,
    valueStats,
    unitHistogram: histogramBins(units, Math.min(5, Math.max(2, partners.length))),
    valueHistogram: histogramBins(values, Math.min(5, Math.max(2, partners.length))),
    boxUnits: boxPlotSummary(units),
    boxValues: boxPlotSummary(values),
    top10Share: allUnits === 0 ? 0 : topUnits / allUnits,
    medianUnits: unitStats?.median ?? null,
    topConcentration: concentrationTopN(units, topCount),
    insufficient: partners.length < 2,
  };
}

export function buildWaterfall(result: CalculationResult) {
  return [
    { name: 'Total Revenue', value: result.baseRevenue, kind: 'total' as const },
    { name: 'Hardware Commission', value: -result.hardwareCommission, kind: 'cost' as const },
    { name: 'Subscription Commission', value: -result.subscriptionCommission, kind: 'cost' as const },
    { name: 'Performance Incentive', value: -result.performanceIncentive, kind: 'cost' as const },
    { name: 'New POS Incentive', value: -result.newPosIncentiveCost, kind: 'cost' as const },
    { name: 'Stock Collection Fee', value: -result.stockCollectionFee, kind: 'cost' as const },
    { name: 'Base Profit', value: result.baseProfit, kind: 'subtotal' as const },
    { name: 'Mega Dealer Incentive', value: -result.megaDealerRenewableIncentive, kind: 'cost' as const },
    { name: 'Profit After Incentive', value: result.profitAfterIncentive, kind: 'total' as const },
  ];
}
