import type { Candidate } from "../types/candidate";
import { CandidateCard } from "./CandidateCard";

export function CandidateGrid(props: {
    candidates: Candidate[];
    onViewDetails: (id: number) => void;
}) {
    return (
        <div style={{display: "grid",
            gap:12,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}>
            {props.candidates.map((c) => (
                <CandidateCard 
                    key={c.id} candidate={c} onViewDetails={()=>props.onViewDetails(c.id)}
                />
            ))}
        </div>
    );
}