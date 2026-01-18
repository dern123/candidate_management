import { STATUS_OPTIONS, type CandidateFiltersState } from "../types/candidate";

export function CandidateFilters(props: {
  filters: CandidateFiltersState;
  onChange: (next: CandidateFiltersState) => void;
}) {
    const { filters } = props;
    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
                <select
                value={filters.status}
                onChange={(e) => props.onChange({ ...filters, status: e.target.value as any })}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-200"
                >
                <option value="all">All statuses</option>
                {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                    {o.label}
                    </option>
                ))}
                </select>
            </div>

            <input
                value={filters.search}
                onChange={(e) => props.onChange({ ...filters, search: e.target.value })}
                placeholder="Search by name…"
                className="h-10 w-64 max-w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200"
            />
        </div>
    );
}