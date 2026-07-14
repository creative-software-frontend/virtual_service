import React from 'react';
import type { ReactNode } from 'react';
import { useMembership } from '../context/MembershipContext';
import { useAuth } from '../context/AuthContext';
import { MembershipUpgradeButton } from './MembershipUpgradeButton';


interface FeatureGateProps {
    feature: string;
    children: ReactNode;
    fallback?: ReactNode;
    fullPage?: boolean;
    requiredTier?: string;
}

/**
 * FeatureGate - blocks access to a feature based on DB-driven membership.
 *
 * fullPage=true  → replaces entire content with a prominent lock screen (Chat, Partner Search, Events)
 * fullPage=false → shows a compact inline lock inside a section (Advanced Filters, Badges, etc.)
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
    feature,
    children,
    fallback,
    fullPage = false,
    requiredTier = 'Membership',
}) => {
    const { hasFeature, loading } = useMembership();
    const { user } = useAuth();

    // Admins bypass all membership checks and keep full access.
    const isExempt = user?.role === 'admin';
    if (isExempt) {
        return <>{children}</>;
    }

    // For providers, the membership tier label is "Provider" (not Silver/Gold/Platinum).
    const tierLabel = user?.role === 'provider' ? 'Provider' : requiredTier;

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '40px', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem',
            }}>
                Checking access…
            </div>
        );
    }

    if (hasFeature(feature)) {
        return <>{children}</>;
    }

    // Custom fallback takes priority
    if (fallback) return <>{fallback}</>;

    // ── Full-page lock ────────────────────────────────────────────────────────
    if (fullPage) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                padding: '48px 24px',
                textAlign: 'center',
                background: 'rgba(10,15,30,0.95)',
                borderRadius: 20,
                border: '1px solid rgba(99,102,241,0.15)',
                margin: '16px',
                gap: 16,
            }}>
                {/* Lock icon */}
                <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
                    border: '1px solid rgba(99,102,241,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, marginBottom: 8,
                }}>
                    🔒
                </div>

                <h2 style={{
                    fontSize: '1.35rem', fontWeight: 800, color: '#fff',
                    margin: 0, fontFamily: "'Inter', sans-serif",
                }}>
                    {feature.replace(/_/g, ' ')} requires {tierLabel} membership
                </h2>

                <p style={{
                    fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)',
                    margin: 0, maxWidth: 360, lineHeight: 1.6,
                }}>
                    Upgrade your membership to unlock this feature and access premium provider benefits.
                </p>

                <MembershipUpgradeButton>View Membership Plans</MembershipUpgradeButton>

            </div>
        );
    }

    // ── Partial / inline lock ─────────────────────────────────────────────────
    return (
        <div style={{
            padding: '20px 16px',
            borderRadius: 12,
            border: '1px dashed rgba(99,102,241,0.3)',
            background: 'rgba(99,102,241,0.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 8,
        }}>
            <span style={{ fontSize: 20 }}>🔒</span>
            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif" }}>
                Advanced filters require higher membership
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                Upgrade to {requiredTier} to unlock
            </p>
            <MembershipUpgradeButton variant="secondary">Upgrade</MembershipUpgradeButton>
        </div>
    );
};
