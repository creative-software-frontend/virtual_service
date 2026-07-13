import React from 'react';
import type { ReactNode } from 'react';
import { useMembership } from '../context/MembershipContext';
import { MembershipUpgradeButton } from './MembershipUpgradeButton';


interface ComingSoonGateProps {
    /** The feature key (e.g. "AUDIO_CALL"). Used to check if the user's tier includes it. */
    feature: string;
    /** Human-readable label shown in the UI */
    label?: string;
    /** Which tier grants this feature (for users who do NOT have it) */
    requiredTier?: string;
    children?: ReactNode;
}

/**
 * ComingSoonGate - for features that are mapped in the DB but not yet built in the app.
 *
 * - User does NOT have the feature → "locked" state (upgrade to unlock, also coming soon)
 * - User HAS the feature via their tier  → "coming soon" state (included in plan, just not ready)
 */
export const ComingSoonGate: React.FC<ComingSoonGateProps> = ({
    feature,
    label,
    requiredTier = 'Gold',
}) => {
    const { hasFeature, loading } = useMembership();


    const displayLabel = label || feature.replace(/_/g, ' ');

    if (loading) {
        return (
            <div style={{
                padding: '20px', textAlign: 'center',
                color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem',
            }}>
                Loading…
            </div>
        );
    }

    if (!hasFeature(feature)) {
        // User's tier doesn't include this feature at all
        return (
            <div style={{
                padding: '20px 16px', borderRadius: 12,
                border: '1px dashed rgba(99,102,241,0.25)',
                background: 'rgba(10,15,30,0.6)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', textAlign: 'center', gap: 8,
            }}>
                <span style={{ fontSize: 22, opacity: 0.6 }}>🔒</span>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
                    {displayLabel}
                </p>
                <span style={{
                    display: 'inline-block',
                    padding: '3px 10px', borderRadius: 999,
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    fontSize: '0.65rem', fontWeight: 800,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(129,140,248,0.7)',
                }}>
                    Coming Soon
                </span>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                    Available with {requiredTier} membership
                </p>
                <MembershipUpgradeButton variant="secondary">View Plans</MembershipUpgradeButton>
            </div>
        );
    }

    // User's tier INCLUDES the feature — just not implemented in the app yet
    return (
        <div style={{
            padding: '20px 16px', borderRadius: 12,
            border: '1px solid rgba(99,102,241,0.2)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center', gap: 8,
        }}>
            <span style={{ fontSize: 22 }}>⏳</span>
            <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                {displayLabel}
            </p>
            <span style={{
                display: 'inline-block',
                padding: '3px 12px', borderRadius: 999,
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                fontSize: '0.65rem', fontWeight: 800,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#818cf8',
            }}>
                Coming Soon
            </span>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                Included with your current membership ✓
            </p>
        </div>
    );
};
