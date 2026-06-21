import { motion } from "framer-motion";
import { TopNav } from "./TopNav";

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export function MembershipPage() {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            style={{ minHeight: '100%', background: 'var(--bg-main)', paddingBottom: '32px' }}
        >
            {/* Top bar */}
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

                {/* Bangla Notice Box */}
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
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            lineHeight: '1.6',
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                        }}>
                            মেম্বারশিপের কোনো অতিরিক্ত ফি নেই। মেম্বারশিপের পেমেন্টকৃত সম্পূর্ণ টাকা আপনার ওয়ালেটে জমা হবে যা দিয়ে আপনি পরবর্তীতে যেকোনো সার্ভিস বুক করতে পারবেন।
                        </p>
                    </div>
                </motion.div>

                {/* Tiers List Container */}
                {/* Tiers List Grid Wrapper (Updated to support 3 columns on desktops) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] max-w-8xl mx-auto w-full px-4">

                    {/* Regular / Starter Tier */}
                    <motion.div
                        variants={fadeUp}
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '16px',
                            padding: '28px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            height: '100%',
                        }}
                    >
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                                    color: 'var(--text-primary)', border: '1px solid var(--border-subtle)',
                                    padding: '4px 10px', borderRadius: '4px',
                                    background: 'var(--blue-glow)',
                                    fontFamily: "'Inter', sans-serif", fontWeight: 700,
                                    marginBottom: '12px',
                                }}>
                                    STARTER
                                </span>
                                <h3 style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)',
                                    marginBottom: '4px',
                                }}>
                                    Regular
                                </h3>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)',
                                    marginBottom: '4px',
                                }}>
                                    Free
                                </p>
                                <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                                    ALWAYS
                                </span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                                {[
                                    'limited everything',
                                    'limited chat',
                                    'limited search',
                                ].map(feat => (
                                    <li key={feat} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-primary)',
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                            <CheckIcon />
                                        </span>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button style={{
                            background: 'var(--blue-glow)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--blue-vivid)',
                            padding: '14px',
                            borderRadius: '8px',
                            fontSize: '0.7rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            fontFamily: "'Inter', sans-serif",
                            cursor: 'pointer',
                            width: '100%',
                        }}>
                            ★ GET BASIC
                        </button>
                    </motion.div>

                    {/* Premium / Popular Tier */}
                    <motion.div
                        variants={fadeUp}
                        style={{
                            background: 'var(--bg-card-hover)',
                            border: '1px solid var(--gold-border)',
                            borderRadius: '16px',
                            padding: '28px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            height: '100%',
                            boxShadow: 'var(--shadow-gold)',
                        }}
                    >
                        {/* Visual premium top border line accent */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
                            background: 'linear-gradient(90deg, transparent, var(--gold-mid), transparent)',
                        }} />

                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                                    color: 'var(--gold-light)', border: '1px solid var(--gold-border)',
                                    padding: '4px 10px', borderRadius: '4px',
                                    background: 'var(--gold-glow)',
                                    fontFamily: "'Inter', sans-serif", fontWeight: 700,
                                    marginBottom: '12px',
                                }}>
                                    POPULAR
                                </span>
                                <h3 style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold-light)',
                                    marginBottom: '4px',
                                }}>
                                    Premium
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px', marginBottom: '16px' }}>
                                    {[
                                        { dur: '1 Month', price: '499' },
                                        { dur: '3 Month', price: '999' },
                                        { dur: '6 Month', price: '1499' },
                                        { dur: '12 Month', price: '2499' },
                                    ].map(p => (
                                        <div key={p.dur} style={{ background: 'rgba(232, 160, 32, 0.1)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(232, 160, 32, 0.2)' }}>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{p.dur}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>৳{p.price}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                                {[
                                    'Unlimited Profile Browsing',
                                    'Direct Chat Access',
                                    'Priority Matching',
                                    'Verified User Badge',
                                    'Basic Support',
                                ].map(feat => (
                                    <li key={feat} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-primary)',
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        <span style={{ color: 'var(--gold-mid)', display: 'flex', alignItems: 'center' }}>
                                            <CheckIcon />
                                        </span>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button style={{
                            background: 'var(--gold-mid)',
                            border: 'none',
                            color: '#030712',
                            padding: '14px',
                            borderRadius: '8px',
                            fontSize: '0.7rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            fontFamily: "'Inter', sans-serif",
                            cursor: 'pointer',
                            width: '100%',
                        }}>
                            ♛ GET PREMIUM
                        </button>
                    </motion.div>

                    {/* Elite / Exclusive Tier */}
                    <motion.div
                        variants={fadeUp}
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-default)',
                            borderRadius: '16px',
                            padding: '28px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            height: '100%',
                            boxShadow: 'var(--shadow-blue)',
                        }}
                    >
                        {/* Visual premium top border line accent for Elite Cyan */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
                            background: 'linear-gradient(90deg, transparent, var(--blue-vivid), transparent)',
                        }} />

                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                                    color: 'var(--text-primary)', border: '1px solid var(--border-subtle)',
                                    padding: '4px 10px', borderRadius: '4px',
                                    background: 'var(--blue-glow)',
                                    fontFamily: "'Inter', sans-serif", fontWeight: 700,
                                    marginBottom: '12px',
                                }}>
                                    EXCLUSIVE
                                </span>
                                <h3 style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '1.4rem', fontWeight: 700, color: 'var(--blue-vivid)',
                                    marginBottom: '4px',
                                }}>
                                    Elite
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px', marginBottom: '16px' }}>
                                    {[
                                        { dur: '1 Month', price: '2499' },
                                        { dur: '3 Month', price: '4999' },
                                        { dur: '6 Month', price: '7999' },
                                        { dur: '12 Month', price: '14999' },
                                    ].map(p => (
                                        <div key={p.dur} style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--blue-vivid)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{p.dur}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', textShadow: '0 0 10px rgba(0, 210, 255, 0.2)' }}>৳{p.price}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                                {[
                                    'Everything in Premium',
                                    'VIP Profile Visibility',
                                    'Unlimited Voice & Video Calls',
                                    'Priority Placement in Search',
                                    'Exclusive Elite Badge',
                                    'Dedicated Support',
                                    'Advanced Match Recommendations',
                                ].map(feat => (
                                    <li key={feat} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-primary)',
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        <span style={{ color: 'var(--blue-vivid)', display: 'flex', alignItems: 'center' }}>
                                            <CheckIcon />
                                        </span>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button style={{
                            background: 'linear-gradient(135deg, var(--blue-neon) 0%, var(--blue-vivid) 100%)',
                            border: 'none',
                            color: '#030712',
                            padding: '14px',
                            borderRadius: '8px',
                            fontSize: '0.7rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            fontFamily: "'Inter', sans-serif",
                            cursor: 'pointer',
                            width: '100%',
                        }}>
                            ♦ GET ELITE
                        </button>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    );
}