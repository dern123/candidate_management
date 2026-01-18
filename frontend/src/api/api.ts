import axios from "axios";
import {type CandidateDetails, type Candidate, type CandidateStatus } from "../types/candidate";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "localhost:3002",
    headers: {
        "Content-Type": "application/json",
    },
});

export async function fetchCandidates() {
    const res = await api.get<Candidate[]>("/api/candidates");
    return res.data;
}
export async function fetchCandidateById(id: number) {
    const res = await api.get<CandidateDetails>(`/api/candidates/${id}`);
    return res.data;
}
export async function updateCandidateStatus(id: number, status: CandidateStatus) {
    const res = await api.patch<Candidate | CandidateDetails>(`/api/candidates/${id}/status`,
        { status });
    return res.data;
}
