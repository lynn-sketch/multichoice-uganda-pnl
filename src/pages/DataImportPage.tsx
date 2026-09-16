import type { ReactNode } from 'react';
import { Check, Circle, Loader2 } from 'lucide-react';
import { PageHeader } from '../components/EmptyState';
import { useScenario } from '../context/ScenarioContext';
import { IMPORT_STEPS } from '../services/dataQualityService';
import type { ImportStep } from '../types';

const order: ImportStep[] = IMPORT_STEPS.map((s) => s.id);

export function DataImportPage() {
  const { importStep, setImportStep } = useScenario();
  const currentIdx = order.indexOf(importStep);

  const advance = () => {
    if (currentIdx < order.length - 1) setImportStep(order[currentIdx + 1]);
  };
  const back = () => {
    if (currentIdx > 0) setImportStep(order[currentIdx - 1]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Import"
        subtitle="Guided import workflow for monthly sales datasets. Source data remains unchanged until Approve."
      />

      <ol className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {IMPORT_STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <li
              key={step.id}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                done
                  ? 'bg-emerald-50 text-emerald-700'
                  : active
                    ? 'bg-cyan-50 text-cyan-800'
                    : 'bg-slate-50 text-slate-400'
              }`}
            >
              {done ? (
                <Check className="h-3.5 w-3.5" />
              ) : active ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Circle className="h-3.5 w-3.5" />
              )}
              {idx + 1}. {step.label}
            </li>
          );
        })}
      </ol>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {importStep === 'upload' && (
          <StepBody
            title="1. Upload"
            body="Select a CSV or Excel extract for a reporting period. Files stay in the browser for this frontend version."
          >
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              Drop file here or choose a file to begin validation.
              <div className="mt-3">
                <input type="file" accept=".csv,.xlsx,.xls" className="text-xs" />
              </div>
            </div>
          </StepBody>
        )}
        {importStep === 'validate' && (
          <StepBody
            title="2. Validate"
            body="Schema checks, required columns, duplicate detection and type coercion run before mapping."
          />
        )}
        {importStep === 'map' && (
          <StepBody
            title="3. Map"
            body="Map source columns to the MultiChoice P&L model fields (hardware units, packages, partners)."
          />
        )}
        {importStep === 'process' && (
          <StepBody
            title="4. Process"
            body="Processing dataset… Calculating aggregates for the selected reporting period."
          />
        )}
        {importStep === 'review' && (
          <StepBody
            title="5. Review"
            body="Review validation outcomes and sample rows before approving into the analytics store."
          />
        )}
        {importStep === 'approve' && (
          <StepBody
            title="6. Approve"
            body="Approve to register the period in Data Management. August 2026 embedded data remains available regardless."
          />
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={back}
            disabled={currentIdx === 0}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={advance}
            disabled={currentIdx === order.length - 1}
            className="rounded-xl bg-[#12263f] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function StepBody({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <h4 className="text-base font-bold text-[#12263f]">{title}</h4>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
      {children}
    </div>
  );
}
