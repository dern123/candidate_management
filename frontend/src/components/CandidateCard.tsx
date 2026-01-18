import { STATUS_OPTIONS, type Candidate } from "../types/candidate";
import { initials } from "../utils/card";

function statusLabel(status: Candidate["status"]) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
}

function statusPillClass(status: Candidate["status"]) {
  switch (status) {
    case "active":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "interview":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "rejected":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export function CandidateCard(props: {
    candidate: Candidate;
    onViewDetails: () => void;
}) {
    const c = props.candidate;
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
                {c.avatarUrl ? (
                    <img
                        src={c.avatarUrl}
                        alt={`${c.name} avatar`}
                        className="h-10 w-10 rounded-full object-cover"
                        />
                ) : (
                    <div className="grid h-10 w-10 place-items-center  rounded-full border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700">
                   {initials(c.name)} 
                </div>
                )}

                <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-slate-900">{c.name}</div>
                    <div className="truncate text-sm text-slate-600">{c.position}</div>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
                <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusPillClass(
                        c.status
                    )}`}
                    >
                        {statusLabel(c.status)}
                </span>

                <button
                    onClick={props.onViewDetails}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
                    >
                        View details
                </button>
            </div>
        </div>
    );
}