import { formatUGX } from '../lib/format';
import type { PartnerIncentiveResult } from '../types';

interface PartnerTableProps {
  partners: PartnerIncentiveResult[];
  note?: string;
}

export function PartnerTable({ partners, note }: PartnerTableProps) {
  return (
    <div className="space-y-3">
      {note && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          {note}
        </p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-[#12263f] text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Partner Name</th>
              <th className="px-4 py-3 font-semibold">Partner Type</th>
              <th className="px-4 py-3 font-semibold">DStv Units</th>
              <th className="px-4 py-3 font-semibold">GOtv Units</th>
              <th className="px-4 py-3 font-semibold">Matched Units</th>
              <th className="px-4 py-3 font-semibold">Hardware Sales Value</th>
              <th className="px-4 py-3 font-semibold">Qualifies?</th>
              <th className="px-4 py-3 font-semibold">Estimated Incentive</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-[#12263f]">{p.partner}</td>
                <td className="px-4 py-3">{p.partnerType}</td>
                <td className="px-4 py-3 tabular-nums">{p.dstvUnits}</td>
                <td className="px-4 py-3 tabular-nums">{p.gotvUnits}</td>
                <td className="px-4 py-3 tabular-nums font-semibold">{p.matchedUnits}</td>
                <td className="px-4 py-3 tabular-nums">{formatUGX(p.knownHardwareSalesValue)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      p.qualifies
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {p.qualifies ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 tabular-nums font-semibold text-[#12263f]">
                  {formatUGX(p.estimatedIncentive)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
