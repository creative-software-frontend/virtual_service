import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TopNav } from './TopNav';
import { membershipApi } from '../../../utils/api';
import type { Package } from '../../../utils/api';




// ── Animation variants ─────────────────────────────────────────────────────────

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

// ── Coming Soon feature keys ───────────────────────────────────────────────────

const COMING_SOON_KEYS = new Set([
    'analytics_dashboard',
    'priority_matching',
    'homepage_promotion',
    'vip_support',
    'early_access_features',
]);

// ── Icons ──────────────────────────────────────────────────────────────────────

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="var(--gold-mid)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ color: 'var(--text-muted)' }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const CrownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="var(--gold-mid)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
    </svg>
);

// ── Tier gradient map ──────────────────────────────────────────────────────────

function getTierStyle(index: number, tier: string): { gradient: string; borderColor: string; badge?: string } {
    const styles = [

        {
            gradient: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
            borderColor: 'rgba(99,102,241,0.25)',
        },
        {
            gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(251,191,36,0.1) 100%)',
            borderColor: 'rgba(245,158,11,0.3)',
            badge: 'Best Value',
        },
        {
            gradient: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(244,114,182,0.1) 100%)',
            borderColor: 'rgba(236,72,153,0.3)',
            badge: 'Premium',
        },
        {
            gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(52,211,153,0.08) 100%)',
            borderColor: 'rgba(16,185,129,0.25)',
        },
    ];

    // Override for known tier names
    const tl = tier?.toLowerCase();
    if (tl?.includes('platinum') || tl?.includes('vip')) return styles[2];
    if (tl?.includes('elite') || tl?.includes('professional')) return styles[1];
    if (tl?.includes('starter')) return styles[0];

    return styles[index % styles.length];
}

// ── Loading Skeleton ───────────────────────────────────────────────────────────

function LoadingSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[0, 1, 2].map(i => (
                <div key={i} style={{
                    borderRadius: '16px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    padding: '32px',
                    animation: `pulse ${1 + i * 0.15}s ease-in-out infinite alternate`,
                    opacity: 0.7,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                            <div style={{ width: '60px', height: '12px', background: 'var(--bg-input)', borderRadius: '4px', marginBottom: '10px' }} />
                            <div style={{ width: '140px', height: '22px', background: 'var(--bg-input)', borderRadius: '6px' }} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ width: '80px', height: '28px', background: 'var(--bg-input)', borderRadius: '6px', marginBottom: '8px' }} />
                            <div style={{ width: '60px', height: '18px', background: 'var(--bg-input)', borderRadius: '999px' }} />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                        {[0, 1, 2, 3].map(j => (
                            <div key={j} style={{ height: '28px', background: 'var(--bg-input)', borderRadius: '6px' }} />
                        ))}
                    </div>
                    <div style={{ height: '46px', background: 'var(--bg-input)', borderRadius: '10px' }} />
                </div>
            ))}
        </div>
    );
}

// ── Tier Card ──────────────────────────────────────────────────────────────────

function TierCard({ pkg, index }: { pkg: Package; index: number }) {

    const style = getTierStyle(index, pkg.tier_type || pkg.name);
    const hasFeatures = pkg.features && pkg.features.length > 0;

    return (
        <motion.div
            variants={fadeUp}
            style={{
                position: 'relative',
                padding: '28px clamp(18px, 5vw, 36px)',
                background: style.gradient,
                border: `1px solid ${style.borderColor}`,
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${style.borderColor.replace(/[\d.]+\)$/, '0.25)')}`;
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
            }}
        >
            {/* Gold top edge */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: `linear-gradient(90deg, transparent, ${style.borderColor.replace(/[\d.]+\)$/, '0.8)')}, transparent)`,
            }} />

            {/* Header */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
                alignItems: 'flex-start', gap: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '20px', marginBottom: '20px',
            }}>
                <div>
                    {style.badge && (
                        <span style={{
                            display: 'inline-block', marginBottom: '8px',
                            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
                            padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase',
                            background: style.gradient,
                            border: `1px solid ${style.borderColor}`,
                            color: 'var(--gold-mid)',
                        }}>
                            {style.badge}
                        </span>
                    )}
                    <h3 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 1.55rem)',
                        fontWeight: 700, color: 'var(--text-primary)',
                        margin: '0 0 6px 0', lineHeight: 1.2,
                        display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                        {pkg.name}
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <CrownIcon />
                        </span>
                    </h3>
                    {pkg.description && (
                        <p style={{
                            fontSize: '0.85rem', color: 'var(--text-muted)',
                            margin: 0, lineHeight: 1.5,
                        }}>
                            {pkg.description}
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{
                        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800,
                        color: 'var(--gold-mid)', lineHeight: 1,
                    }}>
                        {pkg.price === 0 ? 'Free' : `৳${pkg.price.toLocaleString()}`}
                    </span>
                    <span style={{
                        fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
                        padding: '4px 12px', borderRadius: '999px',
                        background: style.gradient,
                        border: `1px solid ${style.borderColor}`,
                        color: 'var(--text-secondary)',
                    }}>
                        {pkg.duration_months} Month{pkg.duration_months > 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* Feature list */}
            <div style={{ marginBottom: '24px' }}>
                <p style={{
                    fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.25em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                    marginBottom: '14px', fontFamily: 'var(--font-display)',
                }}>
                    Included Benefits
                </p>
                {hasFeatures ? (
                    <ul style={{
                        listStyle: 'none', padding: 0, margin: 0,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
                        gap: '10px',
                    }}>
                        {((Array.isArray(pkg.features) ? pkg.features : []) as Array<{ key: string; display_name: string }>).map((feat) => {
                            const isCS = COMING_SOON_KEYS.has(feat.key);

                            return (
                                <li
                                    key={feat.key}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        fontSize: '0.875rem',
                                        color: isCS ? 'var(--text-muted)' : 'var(--text-secondary)',
                                        opacity: isCS ? 0.55 : 1,
                                        fontFamily: 'var(--font-sans)',
                                    }}
                                >
                                    <span style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isCS ? 'var(--bg-input)' : 'var(--gold-glow)',
                                        border: `1px solid ${isCS ? 'var(--border-subtle)' : 'var(--border-gold)'}`,
                                        borderRadius: '50%', width: '22px', height: '22px', flexShrink: 0,
                                    }}>
                                        {isCS ? <LockIcon /> : <CheckIcon />}
                                    </span>

                                    <span style={{ flex: 1 }}>{feat.display_name}</span>

                                    {isCS && (
                                        <span style={{
                                            fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.06em',
                                            padding: '2px 8px', borderRadius: '999px', flexShrink: 0,
                                            background: 'rgba(245,158,11,0.12)',
                                            border: '1px solid rgba(245,158,11,0.3)',
                                            color: 'var(--gold-mid)',
                                        }}>
                                            Coming Soon
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                        Standard plan benefits apply.
                    </p>
                )}
            </div>

            {/* Purchase button — disabled (preview only) */}
            <button
                disabled
                style={{
                    width: '100%', padding: '14px 24px',
                    background: 'var(--bg-input)',
                    border: `1px solid ${style.borderColor}`,
                    borderRadius: '10px',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
                    cursor: 'not-allowed', opacity: 0.7,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
            >
                <LockIcon />
                Coming Soon
            </button>
        </motion.div>
    );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState() {
    return (
        <motion.div
            variants={fadeUp}
            style={{
                textAlign: 'center', padding: '64px 24px',
                background: 'var(--bg-card)', border: '1px dashed var(--border-subtle)',
                borderRadius: '16px',
            }}
        >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👑</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                No provider packages available
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto' }}>
                Please check again later.
            </p>
        </motion.div>
    );
}


// ── ProviderMembershipPage ─────────────────────────────────────────────────────

export function ProviderMembershipPage() {
    const [packages, setPackages] = useState<Package[]>([]);



    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const res = await membershipApi.getProviderPackages();

                if (cancelled) return;

                // Trace runtime payload and ensure provider endpoint drives this page
                console.log('[ProviderMembershipPage api raw]', res);

                if (res && typeof res === 'object' && 'error' in res && (res as { error?: string }).error) {
                    setPackages([]);
                    return;
                }

                const providerPackages = (res as { data?: Package[] }).data ?? [];
                console.log('[ProviderMembershipPage packages]', providerPackages);
                setPackages(providerPackages);
            } catch (e: unknown) {
                const err = e instanceof Error ? e : new Error('Provider packages fetch failed');
                if (cancelled) return;
                setError(err.message || 'Provider packages fetch failed');
                setPackages([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, []);


    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            style={{ minHeight: '100%', background: 'var(--bg-main)', paddingBottom: '32px' }}
        >
            <TopNav />
            <div style={{ padding: '100px 16px 16px', maxWidth: '860px', margin: '0 auto' }}>

                {/* Header */}
                <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.1))',
                        border: '1px solid rgba(245,158,11,0.3)',
                        marginBottom: '16px',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold-mid)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
                        </svg>
                    </div>
                    <h2 style={{
                        fontFamily: "'Inter', sans-serif", fontWeight: 800,
                        fontSize: 'clamp(1.6rem, 4vw, 2.1rem)',
                        color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.1,
                    }}>
                        Provider Membership Plans
                    </h2>
                    <p style={{
                        fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", fontWeight: 700,
                    }}>
                        Grow your business · Unlock premium provider tools
                    </p>
                </motion.div>

                {/* Info notice */}
                <motion.div
                    variants={fadeUp}
                    style={{
                        background: 'var(--blue-glow)', border: '1px solid var(--border-subtle)',
                        borderRadius: '12px', padding: '16px', marginBottom: '28px',
                    }}
                >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="var(--blue-vivid)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <p style={{
                            color: 'var(--text-secondary)', fontSize: '0.85rem',
                            lineHeight: '1.6', fontFamily: "'Inter', sans-serif", fontWeight: 500, margin: 0,
                        }}>
                            Provider membership purchasing is not yet available. These plans are a preview of upcoming subscription options.
                            Features marked <strong style={{ color: 'var(--gold-mid)' }}>Coming Soon</strong> are actively being developed.
                        </p>
                    </div>
                </motion.div>

                {/* Error state */}
                {error && (
                    <motion.div variants={fadeUp} style={{
                        padding: '16px', borderRadius: '12px', marginBottom: '24px',
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                        color: '#fca5a5', fontSize: '0.85rem',
                    }}>
                        ⚠ {error}
                    </motion.div>
                )}

                {/* Package cards */}
                {loading ? (
                    <LoadingSkeleton />
                ) : packages.length === 0 ? (
                    <EmptyState />
                ) : (
                    <motion.div
                        variants={container}
                        style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}
                    >
                        {packages.map((pkg, i) => (
                            <TierCard key={pkg.id} pkg={pkg} index={i} />
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}