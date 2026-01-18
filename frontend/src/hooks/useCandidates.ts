import { useCallback, useEffect, useRef, useState } from "react";
import type { Candidate, CandidateFiltersState, CandidateStatus } from "../types/candidate";
import { fetchCandidates, updateCandidateStatus } from "../api/api";

type UseCandidatesReturn = {
    data: Candidate[];
    loading: boolean;
    error: string | null;
    filters: CandidateFiltersState;
    setFilters: (next: CandidateFiltersState) => void;

    refetch: () => Promise<void>;
    updateStatus: (id: number, status: CandidateStatus) => Promise<void>;
};

export function useCandidates(): UseCandidatesReturn {
    const [data, setData] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<CandidateFiltersState>({
        status: "all",
        search: "",
    });

    const rollbackRef = useRef(new Map<number, CandidateStatus>());

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await fetchCandidates();
            setData(list);
        } catch (e: any) {
            setError(e?.message ? e.message : "Failed to fetch candidates");
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    const updateStatus = useCallback(async (id: number, next: CandidateStatus) => {
        setData((current) => {
            const target = current.find((c) => c.id === id);
            if (target && !rollbackRef.current.has(id)) {
                rollbackRef.current.set(id, target.status);
            }
            return current.map((c) => c.id === id ? { ...c, status: next } : c);
        });

        try {
            const updated = await updateCandidateStatus(id, next);
            setData((current) => current.map((c) => {
                if(c.id === id) {
                    return {
                    ...c,
                    status: (updated as any).status ?? next,
                    name: (updated as any).name ?? c.name,
                    position: (updated as any).position ?? c.position,
                }
                }
                return c;
            })
        );
        rollbackRef.current.delete(id);
        } catch (e) {
            const prev = rollbackRef.current.get(id);
            if (prev) {
                setData((current) => current.map((c) => c.id === id ? { ...c, status: prev! } : c));
            }
            rollbackRef.current.delete(id);
            throw e;
        }
    }, []);

    return {
        data,
        loading,
        error,
        filters,
        setFilters,
        refetch,
        updateStatus,
    };
}