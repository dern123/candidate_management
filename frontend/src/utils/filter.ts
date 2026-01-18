import type { Candidate, CandidateFiltersState } from "../types/candidate";

export function filterCandidates(candidates: Candidate[], filters: CandidateFiltersState) {
    
    const loverCaseSearch = filters.search.trim().toLowerCase();
    return candidates.filter((c) => {
        const OkStatus = filters.status === "all" || c.status === filters.status;
        const OkSearch = loverCaseSearch.length === 0 ? true : c.name.toLowerCase().includes(loverCaseSearch);
        return OkStatus && OkSearch;
    }) 
}