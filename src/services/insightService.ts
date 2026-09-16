import { formatNumber, formatPercent, formatUGX, formatUGXCompact } from '../lib/format';
import type {
  CalculationResult,
  InsightCardData,
  SubscriptionPackage,
} from '../types';
import { concentrationTopN, herfindahl } from './statisticsService';

export function generateInsights(
  result: CalculationResult,
  packages: SubscriptionPackage[],
  assumptionsTarget: number,
): InsightCardData[] {
  const insights: InsightCardData[] = [];
  const revenue = result.baseRevenue || 1;

  insights.push({
    id: 'sub-share',
    title: 'Subscription mix',
    body: `Subscription revenue represents ${formatPercent(result.subscriptionRevenue / revenue)} of total revenue.`,
    category: 'revenue',
  });

  insights.push({
    id: 'hw-share',
    title: 'Hardware mix',
    body: `Hardware revenue represents ${formatPercent(result.totalHardwareRevenue / revenue)} of total revenue (${formatUGXCompact(result.totalHardwareRevenue)}).`,
    category: 'revenue',
  });

  if (packages.length) {
    const top = [...packages].sort((a, b) => b.revenue - a.revenue)[0];
    insights.push({
      id: 'top-package',
      title: 'Top package by revenue',
      body: `${top.name} generated the largest subscription revenue among currently loaded packages (${formatUGXCompact(top.revenue)}).`,
      category: 'subscription',
    });

    const packageRevenues = packages.map((p) => p.revenue);
    const topShare = concentrationTopN(packageRevenues, 1);
    insights.push({
      id: 'package-concentration',
      title: 'Package concentration',
      body: `The top package accounts for ${formatPercent(topShare)} of classified package revenue.`,
      category: 'subscription',
    });

    const shares = packageRevenues.map(
      (r) => r / Math.max(1, packageRevenues.reduce((a, b) => a + b, 0)),
    );
    insights.push({
      id: 'hhi-packages',
      title: 'Package HHI',
      body: `Package revenue Herfindahl–Hirschman index is ${herfindahl(shares).toFixed(3)} (1.0 = fully concentrated).`,
      category: 'subscription',
    });
  }

  insights.push({
    id: 'mega-incentive',
    title: 'Mega dealer incentive effect',
    body: `The Mega Dealer incentive reduces modeled profit by ${formatUGXCompact(result.megaDealerRenewableIncentive)} under the current assumptions.`,
    category: 'scenario',
  });

  insights.push({
    id: 'qualifying-partners',
    title: 'Performance qualification',
    body: `${formatNumber(result.qualifyingPartners.length)} partner${result.qualifyingPartners.length === 1 ? '' : 's'} in the currently matched partner dataset meet the ${formatNumber(assumptionsTarget)}-unit performance threshold.`,
    category: 'partner',
  });

  const costs = result.totalBaseCosts || 1;
  const largestCost =
    result.subscriptionCommission >= result.hardwareCommission
      ? { name: 'Subscription Commission', value: result.subscriptionCommission }
      : { name: 'Hardware Commission', value: result.hardwareCommission };

  insights.push({
    id: 'cost-driver',
    title: 'Largest base cost',
    body: `${largestCost.name} is the largest base cost component at ${formatPercent(largestCost.value / costs)} of total base costs (${formatUGX(largestCost.value)}).`,
    category: 'cost',
  });

  insights.push({
    id: 'margin',
    title: 'Margin after incentive',
    body: `Profit margin after incentive is ${formatPercent(result.profitMarginAfterIncentive)} versus base margin of ${formatPercent(result.baseProfitMargin)}.`,
    category: 'profit',
  });

  if (result.allPartners.length) {
    const partnerValues = result.allPartners.map((p) => p.knownHardwareSalesValue);
    const partnerConc = concentrationTopN(partnerValues, Math.max(1, Math.ceil(partnerValues.length * 0.1)));
    insights.push({
      id: 'partner-concentration',
      title: 'Partner concentration (matched set)',
      body: `Within the matched partner hardware dataset, the top ${Math.max(1, Math.ceil(partnerValues.length * 0.1))} partner(s) account for ${formatPercent(partnerConc)} of known hardware sales value.`,
      category: 'partner',
    });
  }

  return insights;
}
