import { describe, expect, it } from 'vitest';
import { defaultAssumptions, subscriptionPackages } from '../data/august2026';
import { calculatePnL } from './calculations';
import {
  exportFilename,
  periodSlug,
  type ExportContext,
} from './exportService';

const emptyFilters = {
  brand: 'All' as const,
  packageId: null,
  partnerId: null,
  partnerType: 'All' as const,
  qualification: 'All' as const,
  salesRangeMin: null,
  salesRangeMax: null,
  search: '',
};

describe('export helpers', () => {
  it('builds meaningful filenames', () => {
    expect(periodSlug('August 2026')).toBe('August_2026');
    expect(exportFilename('PnL', 'August 2026', 'xlsx')).toBe(
      'MultiChoice_PnL_August_2026.xlsx',
    );
    expect(exportFilename('Dashboard', 'August 2026', 'pdf')).toBe(
      'MultiChoice_Dashboard_August_2026.pdf',
    );
  });

  it('export context uses live calculation outputs that change with assumptions', () => {
    const base = calculatePnL(defaultAssumptions);
    const reduced = calculatePnL({
      ...defaultAssumptions,
      megaDealerRenewableIncentive: 20_000_000,
    });

    const baseCtx: ExportContext = {
      periodLabel: 'August 2026',
      assumptions: defaultAssumptions,
      result: base,
      baseResult: base,
      filters: emptyFilters,
      packages: subscriptionPackages,
    };
    const reducedCtx: ExportContext = {
      ...baseCtx,
      assumptions: {
        ...defaultAssumptions,
        megaDealerRenewableIncentive: 20_000_000,
      },
      result: reduced,
    };

    expect(baseCtx.result.profitAfterIncentive).toBe(712_266_995);
    expect(reducedCtx.result.profitAfterIncentive).toBe(722_266_995);
    expect(reducedCtx.result.totalCostsWithIncentive).toBe(
      baseCtx.result.totalCostsWithIncentive - 10_000_000,
    );
    expect(reducedCtx.result.baseRevenue).toBe(baseCtx.result.baseRevenue);
  });
});
