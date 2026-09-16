import type {
  Assumptions,
  HardwareSourceData,
  PartnerHardwareRow,
  SubscriptionPackage,
} from '../types';

export const PERIOD_LABEL = 'August 2026';
export const COMPANY_NAME = 'MultiChoice Uganda';

export const hardwareSourceData: HardwareSourceData = {
  dstvUnits: 10364,
  gotvUnits: 3103,
  classifiedSubscriptionRevenue: 657_264_000,
  estimatedUngroupedPadRevenue: 56_810_260,
  activePartnerBase: 1704,
};

export const defaultAssumptions: Assumptions = {
  dstvHardwareValue: 25_000,
  gotvHardwareValue: 29_000,
  hardwareCommissionPerUnit: 8_500,
  megaDealerSubscriptionCommission: 0.05,
  posSubscriptionCommission: 0.2,
  performanceSalesTarget: 35,
  performanceIncentiveRate: 0.05,
  newPosTargetRate: 0.02,
  newPosIncentive: 25_000,
  stockCollectionFeePerUnit: 2_000,
  megaDealerRenewableIncentive: 30_000_000,
  revenueUpliftFromMegaDealer: 0,
};

export const partnerHardwareData: PartnerHardwareRow[] = [
  {
    id: 'rahim',
    partner: 'Rahim electronics',
    partnerType: 'POS',
    dstvUnits: 23,
    gotvUnits: 5,
    knownHardwareSalesValue: 720_000,
    matchedUnits: 28,
  },
  {
    id: 'st-impex',
    partner: 'St. Impex Limited / Amir Bhai',
    partnerType: 'Dealer',
    dstvUnits: 14,
    gotvUnits: 9,
    knownHardwareSalesValue: 611_000,
    matchedUnits: 23,
  },
  {
    id: 'ericom',
    partner: 'Ericom',
    partnerType: 'Dealer',
    dstvUnits: 20,
    gotvUnits: 17,
    knownHardwareSalesValue: 993_000,
    matchedUnits: 37,
  },
  {
    id: 'nyanzi',
    partner: 'Nyanziqualityelectronics',
    partnerType: 'POS',
    dstvUnits: 36,
    gotvUnits: 19,
    knownHardwareSalesValue: 1_451_000,
    matchedUnits: 55,
  },
];

/** Currently only one reporting period is loaded. Historical arrays stay empty until more periods are imported. */
export const availablePeriods: { id: string; label: string; isCurrent: boolean }[] = [
  { id: '2026-08', label: 'August 2026', isCurrent: true },
];

export const historicalPeriods: never[] = [];

export const subscriptionPackages: SubscriptionPackage[] = [
  { id: 'dstv-access', name: 'DStv Access', brand: 'DStv', revenue: 57_036_000, salesVolume: 1164 },
  { id: 'dstv-compact', name: 'DStv Compact', brand: 'DStv', revenue: 342_480_000, salesVolume: 2854 },
  { id: 'dstv-compact-plus', name: 'DStv Compact Plus', brand: 'DStv', revenue: 48_285_000, salesVolume: 261 },
  { id: 'dstv-play', name: 'DStv Play Essential', brand: 'DStv', revenue: 270_000, salesVolume: 1 },
  { id: 'dstv-stay', name: 'DStv Stay Ultra', brand: 'DStv', revenue: 115_000, salesVolume: 1 },
  { id: 'dstv-family', name: 'DStv Family', brand: 'DStv', revenue: 19_000_000, salesVolume: 250 },
  { id: 'dstv-lite', name: 'DStv Lite', brand: 'DStv', revenue: 99_841_000, salesVolume: 5873 },
  { id: 'dstv-premium', name: 'DStv Premium', brand: 'DStv', revenue: 8_000_000, salesVolume: 25 },
  { id: 'gotv-lite', name: 'GOtv Lite', brand: 'GOtv', revenue: 22_095_000, salesVolume: 1473 },
  { id: 'gotv-max', name: 'GOtv Max', brand: 'GOtv', revenue: 6_728_000, salesVolume: 116 },
  { id: 'gotv-plus', name: 'GOtv Plus', brand: 'GOtv', revenue: 24_768_000, salesVolume: 688 },
  { id: 'gotv-supa', name: 'GOtv Supa', brand: 'GOtv', revenue: 3_496_000, salesVolume: 46 },
  { id: 'gotv-supa-plus', name: 'GOtv Supa Plus', brand: 'GOtv', revenue: 7_440_000, salesVolume: 62 },
  { id: 'gotv-value', name: 'GOtv Value', brand: 'GOtv', revenue: 17_710_000, salesVolume: 805 },
];

export const assumptionTooltips: Record<keyof Assumptions, string> = {
  dstvHardwareValue:
    'Assumed hardware value credited per DStv unit. Changes recalculate DStv hardware revenue.',
  gotvHardwareValue:
    'Assumed hardware value credited per GOtv unit. Changes recalculate GOtv hardware revenue.',
  hardwareCommissionPerUnit:
    'Commission paid per hardware unit sold across DStv and GOtv. Multiplied by total hardware units.',
  megaDealerSubscriptionCommission:
    'Mega dealer share of subscription commission, applied to total subscription revenue.',
  posSubscriptionCommission:
    'POS share of subscription commission, applied to total subscription revenue.',
  performanceSalesTarget:
    'Minimum matched hardware units a partner must achieve to qualify for the performance incentive. Based on the currently matched partner hardware dataset only.',
  performanceIncentiveRate:
    'Percentage of qualifying partners’ known hardware sales value paid as performance incentive.',
  newPosTargetRate:
    'Target rate used to estimate new POS count from the active partner base (rounded).',
  newPosIncentive:
    'Incentive amount paid per estimated new POS.',
  stockCollectionFeePerUnit:
    'Stock collection fee charged per hardware unit.',
  megaDealerRenewableIncentive:
    'Fixed mega dealer renewable incentive modeled as an incremental cost on top of base costs.',
  revenueUpliftFromMegaDealer:
    'Optional scenario assumption: expected revenue uplift linked to the mega dealer incentive. Does not change observed base data.',
};
