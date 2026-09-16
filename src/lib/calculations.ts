import {
  hardwareSourceData,
  partnerHardwareData,
} from '../data/august2026';
import type {
  Assumptions,
  CalculationResult,
  HardwareSourceData,
  PartnerHardwareRow,
  PartnerIncentiveResult,
} from '../types';

export function calculateHardwareRevenue(
  units: number,
  valuePerUnit: number,
): number {
  return units * valuePerUnit;
}

export function calculateSubscriptionRevenue(source: HardwareSourceData): number {
  return (
    source.classifiedSubscriptionRevenue + source.estimatedUngroupedPadRevenue
  );
}

export function calculateHardwareCommission(
  totalHardwareUnits: number,
  commissionPerUnit: number,
): number {
  return totalHardwareUnits * commissionPerUnit;
}

export function calculateSubscriptionCommission(
  subscriptionRevenue: number,
  megaDealerRate: number,
  posRate: number,
): number {
  return subscriptionRevenue * (megaDealerRate + posRate);
}

export function calculateNewPosCount(
  activePartnerBase: number,
  newPosTargetRate: number,
): number {
  return Math.round(activePartnerBase * newPosTargetRate);
}

export function calculatePartnerIncentives(
  partners: PartnerHardwareRow[],
  performanceSalesTarget: number,
  performanceIncentiveRate: number,
): {
  allPartners: PartnerIncentiveResult[];
  qualifyingPartners: PartnerIncentiveResult[];
  qualifyingSalesValue: number;
  performanceIncentive: number;
} {
  const allPartners = partners.map((partner) => {
    const qualifies = partner.matchedUnits >= performanceSalesTarget;
    const estimatedIncentive = qualifies
      ? partner.knownHardwareSalesValue * performanceIncentiveRate
      : 0;
    return { ...partner, qualifies, estimatedIncentive };
  });

  const qualifyingPartners = allPartners.filter((p) => p.qualifies);
  const qualifyingSalesValue = qualifyingPartners.reduce(
    (sum, p) => sum + p.knownHardwareSalesValue,
    0,
  );
  const performanceIncentive = qualifyingSalesValue * performanceIncentiveRate;

  return {
    allPartners,
    qualifyingPartners,
    qualifyingSalesValue,
    performanceIncentive,
  };
}

export function calculatePnL(
  assumptions: Assumptions,
  source: HardwareSourceData = hardwareSourceData,
  partners: PartnerHardwareRow[] = partnerHardwareData,
): CalculationResult {
  const totalHardwareUnits = source.dstvUnits + source.gotvUnits;

  const dstvHardwareRevenue = calculateHardwareRevenue(
    source.dstvUnits,
    assumptions.dstvHardwareValue,
  );
  const gotvHardwareRevenue = calculateHardwareRevenue(
    source.gotvUnits,
    assumptions.gotvHardwareValue,
  );
  const totalHardwareRevenue = dstvHardwareRevenue + gotvHardwareRevenue;
  const subscriptionRevenue = calculateSubscriptionRevenue(source);
  const baseRevenue = totalHardwareRevenue + subscriptionRevenue;

  const scenarioRevenue =
    baseRevenue * (1 + assumptions.revenueUpliftFromMegaDealer);

  const hardwareCommission = calculateHardwareCommission(
    totalHardwareUnits,
    assumptions.hardwareCommissionPerUnit,
  );
  const subscriptionCommission = calculateSubscriptionCommission(
    subscriptionRevenue,
    assumptions.megaDealerSubscriptionCommission,
    assumptions.posSubscriptionCommission,
  );

  const {
    allPartners,
    qualifyingPartners,
    qualifyingSalesValue,
    performanceIncentive,
  } = calculatePartnerIncentives(
    partners,
    assumptions.performanceSalesTarget,
    assumptions.performanceIncentiveRate,
  );

  const newPosCount = calculateNewPosCount(
    source.activePartnerBase,
    assumptions.newPosTargetRate,
  );
  const newPosIncentiveCost = newPosCount * assumptions.newPosIncentive;
  const stockCollectionFee =
    totalHardwareUnits * assumptions.stockCollectionFeePerUnit;

  const totalBaseCosts =
    hardwareCommission +
    subscriptionCommission +
    performanceIncentive +
    newPosIncentiveCost +
    stockCollectionFee;

  const baseProfit = baseRevenue - totalBaseCosts;
  const baseProfitMargin = baseRevenue === 0 ? 0 : baseProfit / baseRevenue;

  const megaDealerRenewableIncentive = assumptions.megaDealerRenewableIncentive;
  const totalCostsWithIncentive =
    totalBaseCosts + megaDealerRenewableIncentive;
  const profitAfterIncentive = baseRevenue - totalCostsWithIncentive;
  const profitMarginAfterIncentive =
    baseRevenue === 0 ? 0 : profitAfterIncentive / baseRevenue;

  const costIncreaseFromIncentive = megaDealerRenewableIncentive;
  const profitReductionFromIncentive = megaDealerRenewableIncentive;
  const marginChangeFromIncentive =
    profitMarginAfterIncentive - baseProfitMargin;

  const breakEvenUpliftPercentage =
    baseRevenue === 0 ? 0 : megaDealerRenewableIncentive / baseRevenue;

  // Scenario path with optional revenue uplift (costs unchanged unless assumptions change)
  const scenarioBaseCosts = totalBaseCosts;
  const scenarioProfitBeforeIncentive = scenarioRevenue - scenarioBaseCosts;
  const scenarioProfitAfterIncentive =
    scenarioRevenue - (scenarioBaseCosts + megaDealerRenewableIncentive);
  const scenarioMarginBeforeIncentive =
    scenarioRevenue === 0 ? 0 : scenarioProfitBeforeIncentive / scenarioRevenue;
  const scenarioMarginAfterIncentive =
    scenarioRevenue === 0 ? 0 : scenarioProfitAfterIncentive / scenarioRevenue;

  return {
    dstvHardwareRevenue,
    gotvHardwareRevenue,
    totalHardwareUnits,
    totalHardwareRevenue,
    subscriptionRevenue,
    baseRevenue,
    scenarioRevenue,
    hardwareCommission,
    subscriptionCommission,
    performanceIncentive,
    qualifyingSalesValue,
    qualifyingPartners,
    allPartners,
    newPosCount,
    newPosIncentiveCost,
    stockCollectionFee,
    totalBaseCosts,
    baseProfit,
    baseProfitMargin,
    megaDealerRenewableIncentive,
    totalCostsWithIncentive,
    profitAfterIncentive,
    profitMarginAfterIncentive,
    costIncreaseFromIncentive,
    profitReductionFromIncentive,
    marginChangeFromIncentive,
    breakEvenUpliftPercentage,
    scenarioBaseCosts,
    scenarioProfitBeforeIncentive,
    scenarioProfitAfterIncentive,
    scenarioMarginBeforeIncentive,
    scenarioMarginAfterIncentive,
  };
}
