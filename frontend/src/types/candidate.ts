export type CandidateStatus = "active" | "interview" | "rejected";

export type Skill = {
    id: string;
    name: string;
}

export interface Candidate {
    id: number;
    name: string;
    position: string;
    status: CandidateStatus;
    avatarUrl?: string;
}

export type CandidateDetails = Candidate & {
    email: string;
    phone: string;
    description?: string;
    skills: Skill[];
    createdAt: string;
    updatedAt: string;
}