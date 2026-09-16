import { X } from 'lucide-react';
import { useScenario } from '../context/ScenarioContext';
import type { BrandFilter } from '../types';

interface FilterBarProps {
  showBrand?: boolean;
  showSearch?: boolean;
  showPartnerType?: boolean;
  showQualification?: boolean;
  searchPlaceholder?: string;
}

export function FilterBar({
  showBrand = true,
  showSearch = false,
  showPartnerType = false,
  showQualification = false,
  searchPlaceholder = 'Search…',
}: FilterBarProps) {
  const { filters, updateFilters, clearFilters, setBrandFilter } = useScenario();

  const active: string[] = [];
  if (filters.brand !== 'All') active.push(`Brand: ${filters.brand}`);
  if (filters.packageId) active.push(`Package: ${filters.packageId}`);
  if (filters.partnerId) active.push(`Partner: ${filters.partnerId}`);
  if (filters.partnerType !== 'All') active.push(`Type: ${filters.partnerType}`);
  if (filters.qualification !== 'All') active.push(filters.qualification);
  if (filters.search) active.push(`Search: ${filters.search}`);

  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {showBrand && (
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(['All', 'DStv', 'GOtv'] as BrandFilter[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBrandFilter(b)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  filters.brand === b
                    ? 'bg-[#12263f] text-white'
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}
        {showPartnerType && (
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
            value={filters.partnerType}
            onChange={(e) =>
              updateFilters({
                partnerType: e.target.value as typeof filters.partnerType,
              })
            }
          >
            <option value="All">All partner types</option>
            <option value="Dealer">Dealer</option>
            <option value="POS">POS</option>
            <option value="Mega Dealer">Mega Dealer</option>
            <option value="Unknown">Unknown</option>
          </select>
        )}
        {showQualification && (
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
            value={filters.qualification}
            onChange={(e) =>
              updateFilters({
                qualification: e.target.value as typeof filters.qualification,
              })
            }
          >
            <option value="All">All qualification</option>
            <option value="Qualifies">Qualifies</option>
            <option value="Does Not Qualify">Does not qualify</option>
          </select>
        )}
        {showSearch && (
          <input
            className="min-w-[180px] flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-cyan-400"
            placeholder={searchPlaceholder}
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        )}
        {active.length > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <X className="h-3.5 w-3.5" />
            Clear Filters
          </button>
        )}
      </div>
      {active.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {active.map((a) => (
            <span
              key={a}
              className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-semibold text-cyan-800"
            >
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
