import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { userApi, type PartnerSearchFilters, type PartnerSearchResponse, type UserProfile, type MatchRequestListResponse } from "../../../../utils/api";
import { TopNav } from "../TopNav";

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};



function toInterestsArray(value: string): string[] {
    return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function ageToLabel(ageMin: number | null, ageMax: number | null): string {
    if (ageMin === null && ageMax === null) return "Any age";
    if (ageMin !== null && ageMax !== null) return `${ageMin}–${ageMax}`;
    if (ageMin !== null) return `${ageMin}+`;
    return `≤ ${ageMax}`;
}

function computeAgeFromDob(dob: string | null): number | null {
    if (!dob) return null;
    const d = new Date(dob);
    if (Number.isNaN(d.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
    return age;
}

function Avatar({ profile }: { profile: Pick<UserProfile, "name" | "avatar_url"> }) {
    const initials = (profile.name || "").trim().slice(0, 1).toUpperCase() || "M";
    return (
        <div
            style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                overflow: "hidden",
                border: "1px solid var(--border-subtle)",
                background: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.06))",
                flexShrink: 0,
            }}
        >
            {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "var(--text-primary)" }}>
                    {initials}
                </div>
            )}
        </div>
    );
}

function ProfileCard({
    profile,
    requestedIds,
    onRequest,
    onOpenDetails,
}: {
    profile: PartnerSearchResponse["results"][number];
    requestedIds: Set<number>;
    onRequest: (receiverId: number) => void;
    onOpenDetails: (p: PartnerSearchResponse["results"][number]) => void;
}) {
    const age = computeAgeFromDob(profile.date_of_birth);
    const interests = profile.interests ? toInterestsArray(profile.interests) : [];
    const canRequest = !requestedIds.has(profile.id);

    return (
        <motion.div
            variants={fadeUp}
            style={{
                background: "linear-gradient(135deg, var(--bg-card-hover) 0%, var(--bg-card) 100%)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 14,
                padding: 14,
                boxShadow: "var(--shadow-md)",
            }}
        >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Avatar profile={{ name: profile.name, avatar_url: profile.avatar_url }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ fontWeight: 900, color: "var(--text-primary)", fontSize: "1.02rem" }}>{profile.name}</div>
                        <div style={{ color: "var(--blue-vivid)", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                            {age !== null ? `${age} yrs` : "—"}
                        </div>
                    </div>
                    <div style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: "0.78rem", marginTop: 4, wordBreak: "break-word" }}>
                        {profile.profession || "Profession not set"}
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.75rem", marginTop: 6, wordBreak: "break-word" }}>
                        {profile.location || "Location not set"}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {interests.slice(0, 4).map((x) => (
                    <span
                        key={x}
                        style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            border: "1px solid var(--border-subtle)",
                            background: "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(59,130,246,0.04))",
                            color: "var(--text-primary)",
                            fontWeight: 800,
                            fontSize: "0.72rem",
                        }}
                    >
                        {x}
                    </span>
                ))}
                {interests.length > 4 && (
                    <span style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: "0.72rem" }}>+{interests.length - 4}</span>
                )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button
                    type="button"
                    onClick={() => onOpenDetails(profile)}
                    style={{
                        flex: 1,
                        padding: "11px 12px",
                        background: "transparent",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: 10,
                        color: "var(--text-primary)",
                        fontWeight: 900,
                        cursor: "pointer",
                    }}
                >
                    View
                </button>
                <button
                    type="button"
                    onClick={() => onRequest(profile.id)}
                    disabled={!canRequest}
                    style={{
                        flex: 1,
                        padding: "11px 12px",
                        background: canRequest ? "linear-gradient(135deg, var(--blue-neon), var(--blue-vivid))" : "rgba(59,130,246,0.25)",
                        border: "none",
                        borderRadius: 10,
                        color: "#fff",
                        fontWeight: 900,
                        cursor: canRequest ? "pointer" : "not-allowed",
                    }}
                >
                    {canRequest ? "Request" : "Requested"}
                </button>
            </div>
        </motion.div>
    );
}

function SearchFilters({
    filters,
    onChange,
    interestsOptions,
}: {
    filters: PartnerSearchFilters & { pageSize?: number };
    onChange: (next: PartnerSearchFilters) => void;
    interestsOptions: string[];
}) {
    const set = <K extends keyof PartnerSearchFilters>(key: K, value: PartnerSearchFilters[K]) => {
        onChange({ ...filters, [key]: value });
    };

    return (
        <motion.div
            variants={fadeUp}
            style={{
                background: "linear-gradient(135deg, var(--bg-card-hover) 0%, var(--bg-card) 100%)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 14,
                padding: 14,
                boxShadow: "var(--shadow-md)",
            }}
        >
            <div style={{ fontWeight: 950, color: "var(--text-primary)", marginBottom: 10 }}>Search filters</div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <div style={{ flex: "1 1 220px" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "var(--text-muted)", marginBottom: 6 }}>Keyword</label>
                    <input
                        value={filters.keyword ?? ""}
                        onChange={(e) => set("keyword", e.target.value || undefined)}
                        style={{ width: "100%", padding: "12px 14px", background: "var(--bg-input)", border: "1px solid var(--border-default)", borderRadius: 10, color: "var(--text-primary)" }}
                        placeholder="Name, profession, education…"
                    />
                </div>

                <div style={{ flex: "1 1 170px" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "var(--text-muted)", marginBottom: 6 }}>Gender</label>
                    <select
                        value={filters.gender ?? ""}
                        onChange={(e) => set("gender", e.target.value || undefined)}
                        style={{ width: "100%", padding: "12px 14px", background: "var(--bg-input)", border: "1px solid var(--border-default)", borderRadius: 10, color: "var(--text-primary)" }}
                    >
                        <option value="">Any</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                </div>

                <div style={{ flex: "1 1 180px" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "var(--text-muted)", marginBottom: 6 }}>Min age</label>
                    <input
                        type="number"
                        min={18}
                        value={filters.ageMin ?? ""}
                        onChange={(e) => set("ageMin", e.target.value ? Number(e.target.value) : undefined)}
                        style={{ width: "100%", padding: "12px 14px", background: "var(--bg-input)", border: "1px solid var(--border-default)", borderRadius: 10, color: "var(--text-primary)" }}
                        placeholder="18"
                    />
                </div>

                <div style={{ flex: "1 1 180px" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "var(--text-muted)", marginBottom: 6 }}>Max age</label>
                    <input
                        type="number"
                        min={18}
                        value={filters.ageMax ?? ""}
                        onChange={(e) => set("ageMax", e.target.value ? Number(e.target.value) : undefined)}
                        style={{ width: "100%", padding: "12px 14px", background: "var(--bg-input)", border: "1px solid var(--border-default)", borderRadius: 10, color: "var(--text-primary)" }}
                        placeholder="35"
                    />
                </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
                <div style={{ flex: "1 1 220px" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "var(--text-muted)", marginBottom: 6 }}>Location</label>
                    <input
                        value={filters.location ?? ""}
                        onChange={(e) => set("location", e.target.value || undefined)}
                        style={{ width: "100%", padding: "12px 14px", background: "var(--bg-input)", border: "1px solid var(--border-default)", borderRadius: 10, color: "var(--text-primary)" }}
                        placeholder="City / area"
                    />
                </div>

                <div style={{ flex: "1 1 220px" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "var(--text-muted)", marginBottom: 6 }}>Profession</label>
                    <input
                        value={filters.profession ?? ""}
                        onChange={(e) => set("profession", e.target.value || undefined)}
                        style={{ width: "100%", padding: "12px 14px", background: "var(--bg-input)", border: "1px solid var(--border-default)", borderRadius: 10, color: "var(--text-primary)" }}
                        placeholder="Doctor, Engineer…"
                    />
                </div>

                <div style={{ flex: "1 1 220px" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "var(--text-muted)", marginBottom: 6 }}>Education</label>
                    <input
                        value={filters.education ?? ""}
                        onChange={(e) => set("education", e.target.value || undefined)}
                        style={{ width: "100%", padding: "12px 14px", background: "var(--bg-input)", border: "1px solid var(--border-default)", borderRadius: 10, color: "var(--text-primary)" }}
                        placeholder="HSC, Bachelor…"
                    />
                </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
                <div style={{ flex: "1 1 220px" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "var(--text-muted)", marginBottom: 6 }}>Relationship goal</label>
                    <input
                        value={filters.relationship_goal ?? ""}
                        onChange={(e) => set("relationship_goal", e.target.value || undefined)}
                        style={{ width: "100%", padding: "12px 14px", background: "var(--bg-input)", border: "1px solid var(--border-default)", borderRadius: 10, color: "var(--text-primary)" }}
                        placeholder="Marriage, Friendship…"
                    />
                </div>

                <div style={{ flex: "1 1 220px" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "var(--text-muted)", marginBottom: 6 }}>Marital status</label>
                    <input
                        value={filters.marital_status ?? ""}
                        onChange={(e) => set("marital_status", e.target.value || undefined)}
                        style={{ width: "100%", padding: "12px 14px", background: "var(--bg-input)", border: "1px solid var(--border-default)", borderRadius: 10, color: "var(--text-primary)" }}
                        placeholder="Single, Divorced…"
                    />
                </div>
            </div>

            <div style={{ marginTop: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "var(--text-muted)", marginBottom: 8 }}>Interests (optional)</label>
                <select
                    multiple
                    value={filters.interests ?? []}
                    onChange={(e) => {
                        const next = Array.from(e.target.selectedOptions).map((o) => o.value);
                        onChange({
                            ...filters,
                            interests: next.length ? next : undefined,
                        });
                    }}
                    style={{ width: "100%", minHeight: 110, padding: "12px 14px", background: "var(--bg-input)", border: "1px solid var(--border-default)", borderRadius: 10, color: "var(--text-primary)" }}
                >
                    {interestsOptions.map((i) => (
                        <option key={i} value={i}>
                            {i}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginTop: 12, color: "var(--text-muted)", fontWeight: 700, fontSize: 12 }}>
                {ageToLabel(filters.ageMin ?? null, filters.ageMax ?? null)} · Filters update live.
            </div>
        </motion.div>
    );
}

function DetailsModal({
    open,
    profile,
    onClose,
}: {
    open: boolean;
    profile: PartnerSearchResponse["results"][number] | null;
    onClose: () => void;
}) {
    if (!open || !profile) return null;

    const interests = profile.interests ? toInterestsArray(profile.interests) : [];

    return (
        <div
            role="dialog"
            aria-modal="true"
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                zIndex: 1000,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: 16,
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "100%",
                    maxWidth: 520,
                    background: "var(--bg-main)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 16,
                    padding: 14,
                    boxShadow: "var(--shadow-lg)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontWeight: 950, color: "var(--text-primary)" }}>{profile.name}</div>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: "8px 10px",
                            background: "transparent",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: 10,
                            color: "var(--text-primary)",
                            fontWeight: 900,
                            cursor: "pointer",
                        }}
                    >
                        Close
                    </button>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Avatar profile={{ name: profile.name, avatar_url: profile.avatar_url }} />
                    <div>
                        <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Profile details</div>
                        <div style={{ color: "var(--blue-vivid)", fontWeight: 900 }}>{profile.profession || "—"}</div>
                        <div style={{ color: "var(--text-secondary)", fontWeight: 700, marginTop: 4 }}>{profile.location || "—"}</div>
                    </div>
                </div>

                <div style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { label: "Gender", value: profile.gender ?? "Not set" },
                            { label: "Education", value: profile.education ?? "Not set" },
                            { label: "Relationship goal", value: profile.relationship_goal ?? "Not set" },
                            { label: "Marital status", value: profile.marital_status ?? "Not set" },
                            { label: "DOB", value: profile.date_of_birth ?? "Not set" },
                        ].map((row) => (
                            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 12px", borderRadius: 12, border: "1px solid var(--border-subtle)", background: "rgba(59,130,246,0.04)" }}>
                                <span style={{ color: "var(--text-muted)", fontWeight: 900 }}>{row.label}</span>
                                <span style={{ color: "var(--text-primary)", fontWeight: 800, wordBreak: "break-word", textAlign: "right" }}>{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 14 }}>
                    <div style={{ color: "var(--text-muted)", fontWeight: 900, marginBottom: 8 }}>Interests</div>
                    {interests.length ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {interests.map((i) => (
                                <span
                                    key={i}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: 999,
                                        border: "1px solid var(--border-subtle)",
                                        background: "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(59,130,246,0.04))",
                                        color: "var(--text-primary)",
                                        fontWeight: 900,
                                        fontSize: 12,
                                    }}
                                >
                                    {i}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div style={{ color: "var(--text-secondary)", fontWeight: 800 }}>Not set</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function PartnerSearchPage() {
    // Local list of interest options; also allows user to filter by common interests
    const interestsOptions = useMemo(() => {
        return [
            "Traveling",
            "Music",
            "Movies",
            "Reading",
            "Gaming",
            "Photography",
            "Cooking",
            "Fitness",
            "Gym",
            "Football",
            "Cricket",
            "Badminton",
            "Swimming",
            "Hiking",
            "Cycling",
            "Dancing",
            "Singing",
            "Art",
            "Fashion",
            "Technology",
            "Programming",
            "Business",
            "Entrepreneurship",
            "Pets",
            "Food",
            "Coffee",
            "Nature",
            "Volunteering",
            "Writing",
        ];
    }, []);

    const [filters, setFilters] = useState<PartnerSearchFilters>({
        keyword: "",
        gender: undefined,
        ageMin: undefined,
        ageMax: undefined,
        profession: undefined,
        education: undefined,
        location: undefined,
        relationship_goal: undefined,
        marital_status: undefined,
        interests: undefined,
    });

    const [page, setPage] = useState(1);
    const pageSize = 12;

    const [data, setData] = useState<PartnerSearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [matchRequests, setMatchRequests] = useState<MatchRequestListResponse | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsProfile, setDetailsProfile] = useState<PartnerSearchResponse["results"][number] | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);

            const searchRes = await userApi.searchPartners({
                ...filters,
                page,
                pageSize,
            });

            if (cancelled) return;

            if (searchRes.error) {
                setError(searchRes.error);
                setData(null);
                setLoading(false);
                return;
            }

            setData(searchRes.data ?? null);
            setLoading(false);
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [filters, page]);

    useEffect(() => {
        let cancelled = false;
        const loadRequests = async () => {
            const res = await userApi.getMatchRequests();
            if (cancelled) return;
            if (!res.error) setMatchRequests(res.data ?? null);
        };
        loadRequests();
        return () => {
            cancelled = true;
        };
    }, []);

    const requestedIds = useMemo(() => {
        const ids = new Set<number>();
        if (!matchRequests) return ids;

        for (const inc of matchRequests.incoming) ids.add(inc.sender_id);
        for (const out of matchRequests.outgoing) ids.add(out.receiver_id);
        return ids;
    }, [matchRequests]);

    const onRequest = async (receiverId: number) => {
        const res = await userApi.sendMatchRequest(receiverId);
        if (res.error) {
            setError(res.error);
            return;
        }

        // Refresh local requests snapshot
        const reqs = await userApi.getMatchRequests();
        if (!reqs.error) setMatchRequests(reqs.data ?? null);
    };

    const openDetails = (p: PartnerSearchResponse["results"][number]) => {
        setDetailsProfile(p);
        setDetailsOpen(true);
    };

    const results = data?.results ?? [];

    return (
        <motion.div initial="hidden" animate="visible" variants={container} style={{ minHeight: "100svh", background: "var(--bg-main)", width: "100%" }}>
            <TopNav />

            <div style={{ padding: "96px 16px 90px" }}>
                <motion.div variants={fadeUp} style={{ marginBottom: 14 }}>
                    <h1 style={{ color: "var(--text-primary)", marginBottom: 6, fontWeight: 950, fontSize: "1.2rem" }}>Partner Search</h1>
                    <div style={{ color: "var(--text-muted)", fontWeight: 700, fontSize: 13 }}>Find people by profile details and send a match request.</div>
                </motion.div>

                <SearchFilters
                    filters={filters}
                    onChange={(next) => {
                        setPage(1);
                        setFilters(next);
                    }}
                    interestsOptions={interestsOptions}
                />

                <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: 13 }}>
                        {loading ? "Searching…" : `${data?.total ?? 0} results`}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1 || loading}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 10,
                                border: "1px solid var(--border-subtle)",
                                background: "transparent",
                                color: "var(--text-primary)",
                                fontWeight: 900,
                                cursor: page <= 1 || loading ? "not-allowed" : "pointer",
                            }}
                        >
                            Prev
                        </button>
                        <button
                            type="button"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={loading || !data || results.length < pageSize}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 10,
                                border: "none",
                                background: "linear-gradient(135deg, var(--blue-neon), var(--blue-vivid))",
                                color: "#fff",
                                fontWeight: 900,
                                cursor: loading ? "not-allowed" : "pointer",
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {error && (
                    <motion.div variants={fadeUp} style={{ marginTop: 14, padding: 12, borderRadius: 12, border: "1px solid rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.08)", color: "var(--red-status)", fontWeight: 900 }}>
                        {error}
                    </motion.div>
                )}

                {loading ? (
                    <motion.div variants={fadeUp} style={{ marginTop: 14, color: "var(--text-muted)", fontWeight: 800 }}>
                        Loading results…
                    </motion.div>
                ) : results.length === 0 ? (
                    <motion.div variants={fadeUp} style={{ marginTop: 14, color: "var(--text-secondary)", fontWeight: 800 }}>
                        No profiles match your filters.
                    </motion.div>
                ) : (
                    <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                        {results.map((p) => (
                            <ProfileCard
                                key={p.id}
                                profile={p}
                                requestedIds={requestedIds}
                                onRequest={(id) => onRequest(id)}
                                onOpenDetails={(pp) => openDetails(pp)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <DetailsModal open={detailsOpen} profile={detailsProfile} onClose={() => setDetailsOpen(false)} />
        </motion.div>
    );
}

