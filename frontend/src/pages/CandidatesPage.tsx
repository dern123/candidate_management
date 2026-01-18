import { useMemo, useState } from "react";
import { CandidateFilters } from "../components/CandidateFilters";
import { CandidateGrid } from "../components/CandidateGrid";
import { filterCandidates } from "../utils/filter";
import { useCandidates } from "../hooks/useCandidates";
import type { Candidate } from "../types/candidate";
import { CandidateDetailsModal } from "../components/CandidateDetailsModal";

export function CandidatePage() {
    const {data,loading,error, refetch, filters, setFilters, updateStatus} = useCandidates();
    const [selectedId, setSelectedId] = useState<number|null>(null);

    const filtered = useMemo(() => filterCandidates(data, filters), [data,filters]);
    const selectedCandidate = useMemo<Candidate | null>(() => {
        if (selectedId == null) return null;

        return data.find((c) => c.id === selectedId) ?? null;
    }, [data, selectedId]);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-6xl p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <CandidateFilters filters={filters} onChange={setFilters} />

                    <button
                        onClick={refetch}
                        disabled={loading}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Refresh
                    </button>
                </div>
                <div className="mt-4">
                    {loading && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                        Loading…
                        </div>
                    )}
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    {!loading && !error && (
                        <div className="mt-4">
                            <CandidateGrid candidates={filtered} onViewDetails={setSelectedId} />
                        </div>
                    )}
                </div>
                <CandidateDetailsModal
                    open={selectedId != null}
                    candidatePreview={selectedCandidate}
                    candidateId={selectedId}
                    onClose={() => setSelectedId(null)}
                    onChangeStatus={updateStatus}
                />
            </div>
       </div> 
    );
}