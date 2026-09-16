import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
  label?: string;
}

export function InfoTooltip({ text, label = 'More information' }: InfoTooltipProps) {
  return (
    <span className="group relative inline-flex items-center">
      <button
        type="button"
        className="inline-flex text-slate-400 transition hover:text-cyan-600 focus:outline-none"
        aria-label={label}
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg bg-navy-900 px-3 py-2 text-left text-xs leading-relaxed text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
