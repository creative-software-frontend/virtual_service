import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TopNav } from './TopNav';
import { adminApi, userApi } from '../../../utils/api';
import type { Package } from '../../../utils/api';

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

// ── Small helpers ─────────────────────────────────────────────────────────────

const CheckIcon = ({ color }: { color: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

type TierKey = 'starter' | 'premium' | 'elite';

const TIER_CONFIG: Record<TierKey, {
    badge: string;
    label: string;
    tagline: string;
    icon: string;
    btnLabel: string;
    accentColor: string;
    cardBg: string;
    cardBorder: string;
    headerColor: string;
    priceBg: string;
    priceBorder: string;
    topLine: string;
    checkColor: string;
    btnStyle: React.CSSProperties;
    shadow: string;
}> = {
    starter: {
        badge: 'STARTER',
        label: 'Regular',
        tagline: 'ALWAYS FREE',
        icon: '★',
        btnLabel: '★ GET BASIC',
        accentColor: '#3b82f6',
        cardBg: 'var(--bg-card)',
        cardBorder: '1px solid var(--border-subtle)',
        headerColor: 'var(--text-primary)',
        priceBg: 'rgba(59,130,246,0.08)',
        priceBorder: '1px solid rgba(59,130,246,0.2)',
        topLine: '',
        checkColor: 'var(--text-muted)',
        btnStyle: {
            background: 'var(--blue-glow)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--blue-vivid)',
        },
        shadow: '0 0 30px rgba(59,130,246,0.08)',
    },
    premium: {
        badge: 'POPULAR',
        label: 'Premium',
        tagline: 'MOST CHOSEN',
        icon: '♛',
        btnLabel: '♛ GET PREMIUM',
        accentColor: '#c5a880',
        cardBg: 'var(--bg-card-hover)',
        cardBorder: '1px solid var(--gold-border)',
        headerColor: 'var(--gold-light)',
        priceBg: 'rgba(232,160,32,0.1)',
        priceBorder: '1px solid rgba(232,160,32,0.2)',
        topLine: 'linear-gradient(90deg, transparent, var(--gold-mid), transparent)',
        checkColor: 'var(--gold-mid)',
        btnStyle: {
            background: 'var(--gold-mid)',
            border: 'none',
            color: '#030712',
        },
        shadow: 'var(--shadow-gold)',
    },
    elite: {
        badge: 'EXCLUSIVE',
        label: 'Elite',
        tagline: 'ULTIMATE TIER',
        icon: '♦',
        btnLabel: '♦ GET ELITE',
        accentColor: '#8b5cf6',
        cardBg: 'var(--bg-card)',
        cardBorder: '1px solid rgba(139,92,246,0.35)',
        headerColor: '#a78bfa',
        priceBg: 'rgba(139,92,246,0.1)',
        priceBorder: '1px solid rgba(139,92,246,0.25)',
        topLine: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
        checkColor: '#a78bfa',
        btnStyle: {
            background: 'linear-gradient(135deg, #5b21b6, #8b5cf6)',
            border: 'none',
            color: '#fff',
        },
        shadow: '0 0 30px rgba(139,92,246,0.18)',
    },
};

// ── Duration selector ─────────────────────────────────────────────────────────

function DurationSelector({
    options,
    selected,
    onChange,
    config,
}: {
    options: Package[];
    selected: Package | null;
    onChange: (p: Package) => void;
    config: typeof TIER_CONFIG[TierKey];
}) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginTop: '12px',
            marginBottom: '16px',
        }}>
            {options.map(p => {
                const isActive = selected?.id === p.id;
                return (
                    <button
                        key={p.id}
                        onClick={() => onChange(p)}
                        style={{
                            background: isActive ? config.priceBg : 'transparent',
                            border: isActive ? config.priceBorder : '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '10px 8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'center',
                            outline: 'none',
                            boxShadow: isActive ? `0 0 10px ${config.accentColor}30` : 'none',
                            transform: isActive ? 'scale(1.02)' : 'scale(1)',
                        }}
                    >
                        <div style={{
                            fontSize: '0.58rem',
                            color: isActive ? config.accentColor : 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            fontWeight: 700,
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: '3px',
                        }}>
                            {p.duration_months} Month{p.duration_months > 1 ? 's' : ''}
                        </div>
                        <div style={{
                            fontSize: '1.05rem',
                            fontWeight: 800,
                            color: isActive ? config.accentColor : 'var(--text-primary)',
                            fontFamily: "'Inter', sans-serif",
                            textShadow: isActive ? `0 0 12px ${config.accentColor}60` : 'none',
                        }}>
                            {p.price === 0 ? 'Free' : `৳${Number(p.price).toLocaleString()}`}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

// ── Tier Card ─────────────────────────────────────────────────────────────────

function TierCard({ tier, packages }: { tier: TierKey; packages: Package[] }) {
    const cfg = TIER_CONFIG[tier];
    const isStarter = tier === 'starter';
    const [showModal, setShowModal] = useState(false);

    // starter shows no duration selector — just static "Free" display
    const [selected, setSelected] = useState<Package | null>(
        packages.length > 0 ? packages[0] : null
    );

    // keep selected synced if packages load after mount
    useEffect(() => {
        if (packages.length > 0 && !selected) setSelected(packages[0]);
    }, [packages]);

    // features come from the selected package (or first package for starter)
    const featSource = selected ?? packages[0] ?? null;
    const featureList = featSource?.features
        ? featSource.features.split(',').map(f => f.trim()).filter(Boolean)
        : [];

    const handleCTA = () => {
        if (isStarter) {
            alert("Proceeding with Free Starter plan registration...");
        } else {
            setShowModal(true);
        }
    };

    const handleProceed = async () => {
        if (!selected) return;

        // Existing architecture: charge the selected plan price to the user's wallet
        // using the already-implemented wallet deposit endpoint.
        const res = await userApi.deposit(Number(selected.price));
        if (res.error) {
            alert(res.error);
            return;
        }

        alert(`Added ৳${Number(selected.price).toLocaleString()} to your wallet for the ${cfg.label} plan.`);
        setShowModal(false);
    };

    return (
        <>
            <motion.div
                variants={fadeUp}
                style={{
                    background: cfg.cardBg,
                    border: cfg.cardBorder,
                    borderRadius: '16px',
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    height: '100%',
                    boxShadow: cfg.shadow,
                }}
            >
                {/* Top accent line */}
                {cfg.topLine && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
                        background: cfg.topLine,
                    }} />
                )}

                <div>
                    {/* Badge + name */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <span style={{
                            display: 'inline-block',
                            fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                            color: cfg.accentColor,
                            border: `1px solid ${cfg.accentColor}40`,
                            padding: '4px 12px', borderRadius: '4px',
                            background: `${cfg.accentColor}12`,
                            fontFamily: "'Inter', sans-serif", fontWeight: 700,
                            marginBottom: '12px',
                        }}>
                            {cfg.badge}
                        </span>

                        <h3 style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '1.4rem', fontWeight: 700,
                            color: cfg.headerColor,
                            marginBottom: '4px',
                        }}>
                            {cfg.label}
                        </h3>

                        {/* Starter: static "Free · ALWAYS" */}
                        {isStarter ? (
                            <>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '2rem', fontWeight: 800,
                                    color: 'var(--text-primary)', marginBottom: '4px',
                                }}>
                                    Free
                                </p>
                                <span style={{
                                    fontSize: '0.6rem', letterSpacing: '0.1em',
                                    textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700,
                                }}>
                                    ALWAYS
                                </span>
                            </>
                        ) : (
                            /* Premium / Elite: duration picker inline like old version */
                            <DurationSelector
                                options={packages}
                                selected={selected}
                                onChange={setSelected}
                                config={cfg}
                            />
                        )}
                    </div>

                    {/* Feature list */}
                    {featureList.length > 0 && (
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                            {featureList.map(feat => (
                                <li key={feat} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    marginBottom: '12px', fontSize: '0.85rem',
                                    color: 'var(--text-primary)',
                                    fontFamily: "'Inter', sans-serif",
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                        <CheckIcon color={cfg.checkColor} />
                                    </span>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* CTA button */}
                <button
                    onClick={handleCTA}
                    style={{
                        ...cfg.btnStyle,
                        padding: '14px',
                        borderRadius: '8px',
                        fontSize: '0.7rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 800,
                        fontFamily: "'Inter', sans-serif",
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'all 0.2s',
                        boxShadow: isStarter ? 'none' : `0 4px 20px ${cfg.accentColor}40`,
                    }}
                >
                    {cfg.btnLabel}
                </button>
            </motion.div>

            {/* Confirm Plan Modal - shows monthly breakdown and proceeds */}
            {showModal && !isStarter && selected && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'var(--bg-overlay)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                    padding: '20px',
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--bg-card-hover) 0%, var(--bg-card) 100%)',
                        border: `1px solid ${cfg.accentColor}40`,
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '440px',
                        padding: '24px',
                        boxShadow: cfg.shadow,
                        position: 'relative',
                    }}>
                        {/* Top accent line */}
                        {cfg.topLine && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: '2.5px',
                                background: cfg.topLine,
                            }} />
                        )}

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '1.5rem',
                                    color: cfg.headerColor,
                                    marginBottom: '4px',
                                }}>
                                    Confirm Plan
                                </h3>
                                <p style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-secondary)',
                                }}>
                                    Review pricing breakdown for your selection
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    background: 'var(--blue-dim)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Plan Summary Card */}
                        <div style={{
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            padding: '18px',
                            marginBottom: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Plan Tier</span>
                                <span style={{ fontSize: '0.85rem', color: cfg.headerColor, fontWeight: 700 }}>{cfg.label}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Duration</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700 }}>{selected.duration_months} Month{selected.duration_months > 1 ? 's' : ''}</span>
                            </div>
                            
                            <hr style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Monthly Cost</span>
                                <span style={{ fontSize: '1.1rem', color: 'var(--green-status)', fontWeight: 800 }}>
                                    ৳{Math.round(Number(selected.price) / selected.duration_months).toLocaleString()} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/ month</span>
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Price</span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700 }}>৳{Number(selected.price).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Footer / CTA Actions */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: '8px',
                                    padding: '10px 18px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProceed}
                                style={{
                                    ...cfg.btnStyle,
                                    borderRadius: '8px',
                                    padding: '10px 22px',
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    boxShadow: `0 0 10px ${cfg.accentColor}50`,
                                }}
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ── MembershipPage ────────────────────────────────────────────────────────────

const TIER_ORDER: TierKey[] = ['starter', 'premium', 'elite'];

// Fallback static data shown while loading or if backend is offline
const STATIC_PACKAGES: Package[] = [
    // starter
    {
        id: -1, name: 'Regular', description: '', price: 0,
        duration_days: 0, duration_months: 1, tier_type: 'starter',
        features: 'limited everything,limited chat,limited search',
        is_active: 1, created_at: '',
    },
    // premium
    { id: -2, name: 'Premium', description: '', price: 499,  duration_days: 30,  duration_months: 1,  tier_type: 'premium', features: 'Unlimited Profile Browsing,Direct Chat Access,Priority Matching,Verified User Badge,Basic Support', is_active: 1, created_at: '' },
    { id: -3, name: 'Premium', description: '', price: 999,  duration_days: 90,  duration_months: 3,  tier_type: 'premium', features: 'Unlimited Profile Browsing,Direct Chat Access,Priority Matching,Verified User Badge,Basic Support', is_active: 1, created_at: '' },
    { id: -4, name: 'Premium', description: '', price: 1499, duration_days: 180, duration_months: 6,  tier_type: 'premium', features: 'Unlimited Profile Browsing,Direct Chat Access,Priority Matching,Verified User Badge,Basic Support', is_active: 1, created_at: '' },
    { id: -5, name: 'Premium', description: '', price: 2499, duration_days: 365, duration_months: 12, tier_type: 'premium', features: 'Unlimited Profile Browsing,Direct Chat Access,Priority Matching,Verified User Badge,Basic Support', is_active: 1, created_at: '' },
    // elite
    { id: -6,  name: 'Elite', description: '', price: 2499,  duration_days: 30,  duration_months: 1,  tier_type: 'elite', features: 'Everything in Premium,VIP Profile Visibility,Unlimited Voice & Video Calls,Priority Placement in Search,Exclusive Elite Badge,Dedicated Support,Advanced Match Recommendations', is_active: 1, created_at: '' },
    { id: -7,  name: 'Elite', description: '', price: 4999,  duration_days: 90,  duration_months: 3,  tier_type: 'elite', features: 'Everything in Premium,VIP Profile Visibility,Unlimited Voice & Video Calls,Priority Placement in Search,Exclusive Elite Badge,Dedicated Support,Advanced Match Recommendations', is_active: 1, created_at: '' },
    { id: -8,  name: 'Elite', description: '', price: 7999,  duration_days: 180, duration_months: 6,  tier_type: 'elite', features: 'Everything in Premium,VIP Profile Visibility,Unlimited Voice & Video Calls,Priority Placement in Search,Exclusive Elite Badge,Dedicated Support,Advanced Match Recommendations', is_active: 1, created_at: '' },
    { id: -9,  name: 'Elite', description: '', price: 14999, duration_days: 365, duration_months: 12, tier_type: 'elite', features: 'Everything in Premium,VIP Profile Visibility,Unlimited Voice & Video Calls,Priority Placement in Search,Exclusive Elite Badge,Dedicated Support,Advanced Match Recommendations', is_active: 1, created_at: '' },
];

export function MembershipPage() {
    const [packages, setPackages] = useState<Package[]>(STATIC_PACKAGES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.getPublicPackages().then(res => {
            if (res.data && res.data.length > 0) {
                setPackages(res.data);
            }
            // If backend fails or returns empty, we keep the static fallback
            setLoading(false);
        });
    }, []);

    // Group packages by tier
    const byTier = packages.reduce<Record<TierKey, Package[]>>(
        (acc, pkg) => {
            const t = pkg.tier_type as TierKey;
            if (!acc[t]) acc[t] = [];
            acc[t].push(pkg);
            return acc;
        },
        { starter: [], premium: [], elite: [] }
    );

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            style={{ minHeight: '100%', background: 'var(--bg-main)', paddingBottom: '32px' }}
        >
            <TopNav />
            <div style={{ padding: '100px 16px 16px', maxWidth: '2400px', margin: '0 auto' }}>

                {/* Header */}
                <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{
                        fontFamily: "'Inter', sans-serif", fontWeight: 700,
                        fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '6px',
                    }}>
                        Membership
                    </h2>
                    <p style={{
                        fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", fontWeight: 700,
                    }}>
                        CHOOSE A PLAN THAT FITS YOU
                    </p>
                </motion.div>

                {/* Bangla Notice */}
                <motion.div
                    variants={fadeUp}
                    style={{
                        background: 'var(--blue-glow)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '24px',
                        position: 'relative',
                    }}
                >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="var(--blue-vivid)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <p style={{
                            color: 'var(--text-secondary)', fontSize: '0.85rem',
                            lineHeight: '1.6', fontFamily: "'Inter', sans-serif", fontWeight: 500,
                        }}>
                            মেম্বারশিপের কোনো অতিরিক্ত ফি নেই। মেম্বারশিপের পেমেন্টকৃত সম্পূর্ণ টাকা আপনার ওয়ালেটে জমা হবে যা দিয়ে আপনি পরবর্তীতে যেকোনো সার্ভিস বুক করতে পারবেন।
                        </p>
                    </div>
                </motion.div>

                {/* Loading shimmer */}
                {loading && (
                    <motion.div variants={fadeUp} style={{ textAlign: 'center', padding: '20px 0', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: 'var(--blue-vivid)',
                                    animation: `pulse ${0.8 + i * 0.2}s ease-in-out infinite alternate`,
                                    opacity: 0.6,
                                }} />
                            ))}
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif", marginTop: '8px' }}>
                            Loading latest plans…
                        </p>
                    </motion.div>
                )}

                {/* Tier cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] max-w-8xl mx-auto w-full px-4">
                    {TIER_ORDER.map(tier => (
                        byTier[tier].length > 0 ? (
                            <TierCard key={tier} tier={tier} packages={byTier[tier]} />
                        ) : null
                    ))}
                </div>

            </div>
        </motion.div>
    );
}