import { describe, expect, it } from 'vitest';
import { defaultAssumptions } from '../data/august2026';
import { calculatePnL, calculatePartnerIncentives } from './calculations';
import { partnerHardwareData } from '../data/august2026';

describe('P&L calculation engine', () => {
  const result = calculatePnL(defaultAssumptions);

  it('reconciles total revenue', () => {
    expect(result.baseRevenue).toBe(1_063_161_260);
  });

  it('reconciles total base costs', () => {
    expect(result.totalBaseCosts).toBe(320_894_265);
  });

  it('reconciles base profit', () => {
    expect(result.baseProfit).toBe(742_266_995);
  });

  it('reconciles base profit margin ≈ 69.82%', () => {
    expect(result.baseProfitMargin).toBeCloseTo(0.6982, 4);
  });

  it('applies mega dealer incentive of 30M', () => {
    expect(result.megaDealerRenewableIncentive).toBe(30_000_000);
    expect(result.totalCostsWithIncentive).toBe(350_894_265);
  });

  it('reconciles profit after incentive', () => {
    expect(result.profitAfterIncentive).toBe(712_266_995);
  });

  it('reconciles margin after incentive ≈ 67.00%', () => {
    expect(result.profitMarginAfterIncentive).toBeCloseTo(0.67, 4);
  });

  it('calculates hardware revenues from units × values', () => {
    expect(result.dstvHardwareRevenue).toBe(259_100_000);
    expect(result.gotvHardwareRevenue).toBe(89_987_000);
    expect(result.totalHardwareRevenue).toBe(349_087_000);
  });

  it('calculates performance incentive at default threshold', () => {
    expect(result.performanceIncentive).toBe(122_200);
    expect(result.qualifyingSalesValue).toBe(2_444_000);
    expect(result.qualifyingPartners.map((p) => p.partner)).toEqual([
      'Ericom',
      'Nyanziqualityelectronics',
    ]);
  });

  it('updates qualifying partners when target changes', () => {
    const high = calculatePartnerIncentives(partnerHardwareData, 50, 0.05);
    expect(high.qualifyingPartners.map((p) => p.partner)).toEqual([
      'Nyanziqualityelectronics',
    ]);
    expect(high.performanceIncentive).toBe(72_550);

    const low = calculatePartnerIncentives(partnerHardwareData, 20, 0.05);
    expect(low.qualifyingPartners).toHaveLength(4);
  });

  it('models revenue uplift on scenario revenue only', () => {
    const uplifted = calculatePnL({
      ...defaultAssumptions,
      revenueUpliftFromMegaDealer: 0.1,
    });
    expect(uplifted.baseRevenue).toBe(1_063_161_260);
    expect(uplifted.scenarioRevenue).toBeCloseTo(1_063_161_260 * 1.1, 0);
    expect(uplifted.breakEvenUpliftPercentage).toBeCloseTo(
      30_000_000 / 1_063_161_260,
      6,
    );
  });
});
