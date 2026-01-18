import { STATUS_OPTIONS, type Candidate } from "../types/candidate";
import { initials } from "../utils/card";

export function CandidateCard(props: {
    candidate: Candidate;
    onViewDetails: () => void;
}) {
    const c = props.candidate;

    return (
        <div className="rouded-2xl border border-slate-200 bg-white p-4 shadow-sa">
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
        </div>
    );
}