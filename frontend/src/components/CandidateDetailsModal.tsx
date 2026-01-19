import { useEffect, useState } from "react";
import type { CandidateDetails, Candidate, CandidateStatus } from "../types/candidate";
import { STATUS_OPTIONS } from "../types/candidate";
import { fetchCandidateById } from "../api/api";

export function CandidateDetailsModal(props: {
  open: boolean;
  candidateId: number | null;
  candidatePreview: Candidate | null;
  onClose: () => void;
  onChangeStatus: (id: number, next: CandidateStatus) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<CandidateDetails | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    if (!props.open || props.candidateId == null) return;

    setLoading(true);
    setError(null);
    setDetails(null);

    fetchCandidateById(props.candidateId)
      .then((d) => setDetails(d))
      .catch((e: any) => setError(e?.message ?? "Failed to load details"))
      .finally(() => setLoading(false));
  }, [props.open, props.candidateId]);

  if (!props.open) return null;

  const headerName = details?.name ?? props.candidatePreview?.name ?? "Candidate";
  const currentStatus = details?.status ?? props.candidatePreview?.status ?? "active";
  const userSkills = (details?.skills ?? [])
    .map((item: any) => item?.skill ?? item)
    .filter((s: any) => s && typeof s.name === "string" && s.name.trim().length > 0);

  return (
    <div
      onClick={props.onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="text-base font-extrabold text-slate-900">{headerName}</div>
          <button
            onClick={props.onClose}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {loading && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading…
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && details && (
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2 text-sm text-slate-800">
              <div><span className="font-semibold">Position:</span> {details.position}</div>
              <div><span className="font-semibold">Email:</span> {details.email}</div>
              <div><span className="font-semibold">Phone:</span> {details.phone}</div>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-semibold text-slate-900">Skills</div>
              <div className="flex flex-wrap gap-2">
                {userSkills.length > 0 ? (
                  userSkills.map((s: any, idx: number) => (
                    <span
                      key={s.id ?? `${s.name}-${idx}`}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {s.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">No skills</span>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-semibold text-slate-900">Description</div>
              <p className="text-sm leading-relaxed text-slate-700">{details.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm font-semibold text-slate-900">Status</div>

              <select
                value={currentStatus}
                disabled={savingStatus}
                onChange={async (e) => {
                  if (props.candidateId == null) return;
                  const next = e.target.value as CandidateStatus;

                  setSavingStatus(true);
                  try {
                    await props.onChangeStatus(props.candidateId, next);
                    setDetails((prev) => (prev ? { ...prev, status: next } : prev));
                  } finally {
                    setSavingStatus(false);
                  }
                }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              {savingStatus && <span className="text-sm text-slate-500">Saving…</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
