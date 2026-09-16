import * as XLSX from 'xlsx';
import { downloadCsv } from './format';
import type {
  Assumptions,
  CalculationResult,
  DashboardFilters,
  SubscriptionPackage,
} from '../types';
import { filterPackages, filterPartners, packageAnalytics } from '../services/analyticsService';

export function periodSlug(periodLabel: string): string {
  return periodLabel.replace(/\s+/g, '_').replace(/[^A-Za-z0-9_-]/g, '');
}

export function exportFilename(
  kind: string,
  periodLabel: string,
  ext: string,
): string {
  return `MultiChoice_${kind}_${periodSlug(periodLabel)}.${ext}`;
}

function sheetFromRows(rows: (string | number | boolean | null | undefined)[][]) {
  return XLSX.utils.aoa_to_sheet(
    rows.map((r) => r.map((c) => (c === null || c === undefined ? '' : c))),
  );
}

export interface ExportContext {
  periodLabel: string;
  assumptions: Assumptions;
  result: CalculationResult;
  baseResult: CalculationResult;
  filters: DashboardFilters;
  packages: SubscriptionPackage[];
  scenarioLabel?: string;
}

function executiveSummarySheet(ctx: ExportContext) {
  const { result, periodLabel, scenarioLabel, filters } = ctx;
  return sheetFromRows([
    ['MultiChoice Uganda — Executive Summary'],
    ['Reporting Period', periodLabel],
    ['Scenario', scenarioLabel ?? 'Current live assumptions'],
    ['Brand Filter', filters.brand],
    ['Generated At', new Date().toISOString()],
    [],
    ['KPI', 'Value'],
    ['Total Revenue', result.baseRevenue],
    ['Hardware Revenue', result.totalHardwareRevenue],
    ['Subscription Revenue', result.subscriptionRevenue],
    ['Total Base Costs', result.totalBaseCosts],
    ['Base Profit', result.baseProfit],
    ['Base Profit Margin', result.baseProfitMargin],
    ['Mega Dealer Incentive', result.megaDealerRenewableIncentive],
    ['Total Costs With Incentive', result.totalCostsWithIncentive],
    ['Profit After Incentive', result.profitAfterIncentive],
    ['Profit Margin After Incentive', result.profitMarginAfterIncentive],
    ['Scenario Revenue', result.scenarioRevenue],
    ['Scenario Profit After Incentive', result.scenarioProfitAfterIncentive],
  ]);
}

function pnlSheet(ctx: ExportContext) {
  const { result } = ctx;
  return sheetFromRows([
    ['P&L Statement'],
    ['Line Item', 'Amount (UGX)'],
    ['Hardware Revenue', result.totalHardwareRevenue],
    ['Subscription Revenue', result.subscriptionRevenue],
    ['Total Revenue', result.baseRevenue],
    ['Hardware Commission', result.hardwareCommission],
    ['Subscription Commission', result.subscriptionCommission],
    ['Performance Incentive', result.performanceIncentive],
    ['New POS Incentive', result.newPosIncentiveCost],
    ['Stock Collection Fee', result.stockCollectionFee],
    ['Total Base Costs', result.totalBaseCosts],
    ['Base Profit', result.baseProfit],
    ['Base Margin', result.baseProfitMargin],
    ['Mega Dealer Renewable Incentive', result.megaDealerRenewableIncentive],
    ['Profit After Incentive', result.profitAfterIncentive],
    ['Profit Margin After Incentive', result.profitMarginAfterIncentive],
  ]);
}

function assumptionsSheet(ctx: ExportContext) {
  const a = ctx.assumptions;
  return sheetFromRows([
    ['Business Assumptions (current scenario)'],
    ['Assumption', 'Value'],
    ['DStv Hardware Value', a.dstvHardwareValue],
    ['GOtv Hardware Value', a.gotvHardwareValue],
    ['Hardware Commission per Unit', a.hardwareCommissionPerUnit],
    ['Mega Dealer Subscription Commission', a.megaDealerSubscriptionCommission],
    ['POS Subscription Commission', a.posSubscriptionCommission],
    ['Performance Sales Target', a.performanceSalesTarget],
    ['Performance Incentive Rate', a.performanceIncentiveRate],
    ['New POS Target Rate', a.newPosTargetRate],
    ['New POS Incentive', a.newPosIncentive],
    ['Stock Collection Fee per Unit', a.stockCollectionFeePerUnit],
    ['Mega Dealer Renewable Incentive', a.megaDealerRenewableIncentive],
    ['Revenue Uplift from Mega Dealer', a.revenueUpliftFromMegaDealer],
  ]);
}

function revenueSheet(ctx: ExportContext) {
  const { result } = ctx;
  return sheetFromRows([
    ['Revenue Analysis'],
    ['Metric', 'Value'],
    ['Total Revenue', result.baseRevenue],
    ['Hardware Revenue', result.totalHardwareRevenue],
    ['DStv Hardware Revenue', result.dstvHardwareRevenue],
    ['GOtv Hardware Revenue', result.gotvHardwareRevenue],
    ['Subscription Revenue', result.subscriptionRevenue],
    ['Hardware Units', result.totalHardwareUnits],
  ]);
}

function subscriptionSheet(ctx: ExportContext) {
  const rate =
    ctx.assumptions.megaDealerSubscriptionCommission +
    ctx.assumptions.posSubscriptionCommission;
  const filtered = filterPackages(
    ctx.packages,
    ctx.filters.brand,
    ctx.filters.packageId,
    ctx.filters.search,
  );
  const rows = packageAnalytics(filtered, rate);
  return sheetFromRows([
    ['Subscription Analysis'],
    [
      'Brand',
      'Package',
      'Sales Volume',
      'Revenue',
      'Rate Card',
      'Revenue Share',
      'Commission',
    ],
    ...rows.map((p) => [
      p.brand,
      p.name,
      p.salesVolume,
      p.revenue,
      p.rateCard,
      p.revenueShare,
      p.commission,
    ]),
  ]);
}

function partnerSheet(ctx: ExportContext) {
  const partners = filterPartners(ctx.result.allPartners, ctx.filters);
  return sheetFromRows([
    ['Partner Performance (matched dataset — current filters)'],
    [
      'Partner',
      'Type',
      'DStv Units',
      'GOtv Units',
      'Matched Units',
      'Known Hardware Sales Value',
      'Qualifies',
      'Estimated Incentive',
    ],
    ...partners.map((p) => [
      p.partner,
      p.partnerType,
      p.dstvUnits,
      p.gotvUnits,
      p.matchedUnits,
      p.knownHardwareSalesValue,
      p.qualifies ? 'Yes' : 'No',
      p.estimatedIncentive,
    ]),
  ]);
}

function scenarioSheet(ctx: ExportContext) {
  const { result, baseResult } = ctx;
  return sheetFromRows([
    ['Scenario Analysis — Base Case vs Current'],
    ['Metric', 'Base Case', 'Current Scenario', 'Difference'],
    [
      'Revenue',
      baseResult.baseRevenue,
      result.scenarioRevenue,
      result.scenarioRevenue - baseResult.baseRevenue,
    ],
    [
      'Costs',
      baseResult.totalCostsWithIncentive,
      result.totalCostsWithIncentive,
      result.totalCostsWithIncentive - baseResult.totalCostsWithIncentive,
    ],
    [
      'Profit',
      baseResult.profitAfterIncentive,
      result.scenarioProfitAfterIncentive,
      result.scenarioProfitAfterIncentive - baseResult.profitAfterIncentive,
    ],
    [
      'Margin',
      baseResult.profitMarginAfterIncentive,
      result.scenarioMarginAfterIncentive,
      result.scenarioMarginAfterIncentive - baseResult.profitMarginAfterIncentive,
    ],
    [],
    ['Break-even Uplift %', result.breakEvenUpliftPercentage],
    ['Profit Reduction from Incentive', result.profitReductionFromIncentive],
  ]);
}

function downloadWorkbook(
  filename: string,
  sheets: { name: string; sheet: XLSX.WorkSheet }[],
) {
  const wb = XLSX.utils.book_new();
  for (const { name, sheet } of sheets) {
    XLSX.utils.book_append_sheet(wb, sheet, name.slice(0, 31));
  }
  XLSX.writeFile(wb, filename);
}

/** P&L-focused Excel workbook from current calculation state. */
export function exportPnLExcel(ctx: ExportContext) {
  downloadWorkbook(exportFilename('PnL', ctx.periodLabel, 'xlsx'), [
    { name: 'P&L', sheet: pnlSheet(ctx) },
    { name: 'Assumptions', sheet: assumptionsSheet(ctx) },
    { name: 'Executive Summary', sheet: executiveSummarySheet(ctx) },
  ]);
}

/** Full multi-sheet analysis workbook. */
export function exportFullAnalysisExcel(ctx: ExportContext) {
  downloadWorkbook(exportFilename('Full_Analysis', ctx.periodLabel, 'xlsx'), [
    { name: 'Executive Summary', sheet: executiveSummarySheet(ctx) },
    { name: 'P&L', sheet: pnlSheet(ctx) },
    { name: 'Assumptions', sheet: assumptionsSheet(ctx) },
    { name: 'Revenue Analysis', sheet: revenueSheet(ctx) },
    { name: 'Subscription Analysis', sheet: subscriptionSheet(ctx) },
    { name: 'Partner Performance', sheet: partnerSheet(ctx) },
    { name: 'Scenario Analysis', sheet: scenarioSheet(ctx) },
  ]);
}

/** Current scenario assumptions + outputs as Excel. */
export function exportCurrentScenarioExcel(ctx: ExportContext) {
  downloadWorkbook(exportFilename('Scenario', ctx.periodLabel, 'xlsx'), [
    { name: 'Assumptions', sheet: assumptionsSheet(ctx) },
    { name: 'Scenario Analysis', sheet: scenarioSheet(ctx) },
    { name: 'P&L', sheet: pnlSheet(ctx) },
  ]);
}

/** Lightweight scenario CSV (legacy / quick export). */
export function exportCurrentScenarioCsv(ctx: ExportContext) {
  const { assumptions: a, result, periodLabel } = ctx;
  downloadCsv(exportFilename('Scenario', periodLabel, 'csv'), [
    ['Metric', 'Value'],
    ['Period', periodLabel],
    ['Company', 'MultiChoice Uganda'],
    ['DStv Hardware Value', a.dstvHardwareValue],
    ['GOtv Hardware Value', a.gotvHardwareValue],
    ['Hardware Commission per Unit', a.hardwareCommissionPerUnit],
    ['Mega Dealer Subscription Commission', a.megaDealerSubscriptionCommission],
    ['POS Subscription Commission', a.posSubscriptionCommission],
    ['Performance Sales Target', a.performanceSalesTarget],
    ['Performance Incentive Rate', a.performanceIncentiveRate],
    ['New POS Target Rate', a.newPosTargetRate],
    ['New POS Incentive', a.newPosIncentive],
    ['Stock Collection Fee per Unit', a.stockCollectionFeePerUnit],
    ['Mega Dealer Renewable Incentive', a.megaDealerRenewableIncentive],
    ['Revenue Uplift', a.revenueUpliftFromMegaDealer],
    ['Total Revenue', result.baseRevenue],
    ['Scenario Revenue', result.scenarioRevenue],
    ['Total Base Costs', result.totalBaseCosts],
    ['Base Profit', result.baseProfit],
    ['Profit After Incentive', result.profitAfterIncentive],
    ['Profit Margin After Incentive', result.profitMarginAfterIncentive],
  ]);
}

export function exportTableExcel(
  filename: string,
  sheetName: string,
  rows: (string | number)[][],
) {
  downloadWorkbook(filename, [{ name: sheetName, sheet: sheetFromRows(rows) }]);
}

export function exportChartDataCsv(
  chartTitle: string,
  periodLabel: string,
  rows: (string | number)[][],
) {
  const safe = chartTitle.replace(/\s+/g, '_').replace(/[^A-Za-z0-9_-]/g, '');
  downloadCsv(`MultiChoice_${safe}_${periodSlug(periodLabel)}.csv`, rows);
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

const captureOptions = {
  backgroundColor: '#f3f6fa',
  scale: 2,
  useCORS: true,
  logging: false,
  ignoreElements: (el: Element) =>
    el.classList?.contains('export-hide') ||
    el.classList?.contains('print:hidden'),
};

/** Capture a DOM node as PNG. */
export async function exportElementPng(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(element, captureOptions);
  triggerDownload(canvas.toDataURL('image/png'), filename);
}

/** Capture a DOM node as multi-page PDF. */
export async function exportElementPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);
  const canvas = await html2canvas(element, captureOptions);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const usableWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * usableWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, 'PNG', margin, position, usableWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    position = margin - (imgHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, position, usableWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  pdf.save(filename);
}
