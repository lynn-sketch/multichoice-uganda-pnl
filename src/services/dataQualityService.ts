import type { DataQualitySummary, ImportStep } from '../types';

export const IMPORT_STEPS: { id: ImportStep; label: string }[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'validate', label: 'Validate' },
  { id: 'map', label: 'Map' },
  { id: 'process', label: 'Process' },
  { id: 'review', label: 'Review' },
  { id: 'approve', label: 'Approve' },
];

/** Baseline quality summary for the embedded August 2026 source dataset. */
export function getBaselineDataQuality(): DataQualitySummary {
  return {
    rowsImported: 18,
    validRows: 18,
    warnings: 1,
    failedRows: 0,
    duplicates: 0,
    missingValues: 0,
    unmatchedRecords: 0,
    score: 94,
    status: 'warnings',
    issues: [
      {
        id: 'pad-estimate',
        type: 'warning',
        column: 'Ungrouped PAD Revenue',
        message:
          'Estimated Ungrouped PAD Revenue is modeled as an estimate, not a fully classified package total.',
        severity: 'warning',
      },
      {
        id: 'partner-coverage',
        type: 'unmatched',
        column: 'Active Partner Base',
        message:
          'Performance incentive uses the currently matched partner hardware dataset (4 partners), not all 1,704 active partners.',
        severity: 'info',
        recordIds: ['rahim', 'st-impex', 'ericom', 'nyanzi'],
      },
    ],
  };
}
