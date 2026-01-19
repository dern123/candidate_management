export type CandidateStatus = "active" | "interview" | "rejected";

export type Skill = {
    id: string;
    name: string;
}

export type CandidateSkill = {
  candidateId: number;
  skillId: number;
  skill: Skill;
};

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
    skills: CandidateSkill[];
    createdAt: string;
    updatedAt: string;
}

export const STATUS_OPTIONS: Array<{value: CandidateStatus; label: string}> = [
    {value: "active", label: "Active"},
    {value: "interview", label: "Interview"},
    {value: "rejected", label: "Rejected"},
];

export type CandidateFiltersState = {
  status: CandidateStatus | "all";
  search: string;
};