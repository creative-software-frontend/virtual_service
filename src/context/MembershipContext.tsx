import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { userApi } from '../utils/api';
import { useAuth } from './AuthContext';

// ── Types ────────────────────────────────────────────────────────────────────

export interface CurrentMembershipState {
    package: string;
    expires_at: string | null;
    features: string[];
}

const FREE_STATE: CurrentMembershipState = {
    package: 'Free',
    expires_at: null,
    features: [],
};

// ── Context ──────────────────────────────────────────────────────────────────

interface MembershipContextProps {
    membership: CurrentMembershipState;
    loading: boolean;
    error: string | null;
    hasFeature: (featureKey: string) => boolean;
    refreshMembership: () => Promise<void>;
}

export const MembershipContext = createContext<MembershipContextProps | undefined>(undefined);

// Map UI/middleware feature aliases to the canonical feature_key values stored
// in the `features` table. The DB uses lowercase, scoped keys
// (e.g. "basic_chat", "partner_search") while some call sites pass the legacy
// uppercase names (e.g. "CHAT", "PARTNER_SEARCH"). This must mirror the alias
// map in backend/src/middleware/membershipMiddleware.js.
const FEATURE_ALIASES: Record<string, string> = {
    CHAT: 'basic_chat',
    PARTNER_SEARCH: 'partner_search',
    ADVANCED_SEARCH: 'advanced_search_filter',
    EVENT_ACCESS: 'tour_access',
    TOUR_ACCESS: 'tour_access',
};

// ── Provider ─────────────────────────────────────────────────────────────────

export const MembershipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [membership, setMembership] = useState<CurrentMembershipState>(FREE_STATE);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMembership = async () => {
        if (!isAuthenticated) {
            // Not logged in — reset to free state, no request needed
            setMembership(FREE_STATE);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // request<T> returns ApiResponse<T> = { data?, error?, status }
            const res = await userApi.getCurrentMembership();

            if (res.error || !res.data) {
                // API error or empty body — safe fallback, do NOT crash
                console.warn('[MembershipContext] /current returned error:', res.error);
                setMembership(FREE_STATE);
                setError(res.error ?? 'Unknown error');
                return;
            }

            const { data } = res;

            // Defensive normalisation — ensure features is always an array
            setMembership({
                package: data.package ?? 'Free',
                expires_at: data.expires_at ?? null,
                features: Array.isArray(data.features) ? data.features : [],
            });
        } catch (err: unknown) {
            // Network failure — do NOT crash the app
            const msg = err instanceof Error ? err.message : 'Network error';
            console.error('[MembershipContext] fetch failed:', msg);
            setMembership(FREE_STATE);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when auth state changes (login / logout / user switch)
    useEffect(() => {
        fetchMembership();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user?.id]);

    /**
     * Returns true only if the user's current membership includes the given
     * feature key exactly as stored in `package_features.feature_key`.
     * Always safe to call — membership.features is guaranteed to be an array.
     */
    const hasFeature = (featureKey: string): boolean => {
        const key = FEATURE_ALIASES[featureKey] ?? featureKey;
        return membership.features.includes(key);
    };

    return (
        <MembershipContext.Provider
            value={{ membership, loading, error, hasFeature, refreshMembership: fetchMembership }}
        >
            {children}
        </MembershipContext.Provider>
    );
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useMembership = (): MembershipContextProps => {
    const context = useContext(MembershipContext);
    if (context === undefined) {
        throw new Error('useMembership must be used within a <MembershipProvider>');
    }
    return context;
};
