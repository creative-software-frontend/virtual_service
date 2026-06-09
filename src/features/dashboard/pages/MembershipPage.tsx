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
            style={{ minHeight: '100%', background: '#060d1a', paddingBottom: '32px' }}
        >
            {/* Top bar */}
            <TopNav />
            <div style={{ padding: '100px 16px 16px', maxWidth: '2400px', margin: '0 auto' }}>
                {/* Header */}
                <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{
                        fontFamily: "'Inter', sans-serif", fontWeight: 700,
                        fontSize: '1.75rem', color: '#ffffff', marginBottom: '6px',
                    }}>
                        Membership
                    </h2>
                    <p style={{
                        fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: '#94a3b8', fontFamily: "'Inter', sans-serif", fontWeight: 700,
                    }}>
                        ONE-TIME PAYMENT. LIFETIME ACCESS.
                    </p>
                </motion.div>

                {/* Bangla Notice Box */}
                <motion.div
                    variants={fadeUp}
                    style={{
                        background: 'rgba(59, 130, 246, 0.08)',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '24px',
                        position: 'relative',
                    }}
                >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <p style={{
                            color: '#cbd5e1',
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
                            background: '#07111f',
                            border: '1px solid rgba(30, 58, 100, 0.6)',
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
                                    color: '#f1f5f9', border: '1px solid rgba(148, 163, 184, 0.3)',
                                    padding: '4px 10px', borderRadius: '4px',
                                    background: 'rgba(148, 163, 184, 0.1)',
                                    fontFamily: "'Inter', sans-serif", fontWeight: 700,
                                    marginBottom: '12px',
                                }}>
                                    STARTER
                                </span>
                                <h3 style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc',
                                    marginBottom: '4px',
                                }}>
                                    Regular
                                </h3>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '2rem', fontWeight: 800, color: '#ffffff',
                                    marginBottom: '4px',
                                }}>
                                    ৳10,000
                                </p>
                                <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                                    LIFETIME ACCESS
                                </span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                                {[
                                    'Access to 500+ Verified Profiles',
                                    '10% Service Discount',
                                    'Priority Concierge Support',
                                    'Member-only Listings',
                                    'Weekly Roster Updates',
                                ].map(feat => (
                                    <li key={feat} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        marginBottom: '12px', fontSize: '0.85rem', color: '#f1f5f9',
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}>
                                            <CheckIcon />
                                        </span>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            border: '1px solid rgba(59, 130, 246, 0.4)',
                            color: '#60a5fa',
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
                            background: '#0a1628',
                            border: '1px solid rgba(197, 168, 128, 0.4)',
                            borderRadius: '16px',
                            padding: '28px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            height: '100%',
                            boxShadow: '0 0 30px rgba(197, 168, 128, 0.05)',
                        }}
                    >
                        {/* Visual premium top border line accent */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
                            background: 'linear-gradient(90deg, transparent, #C5A880, transparent)',
                        }} />

                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                                    color: '#fdba74', border: '1px solid rgba(249, 115, 22, 0.4)',
                                    padding: '4px 10px', borderRadius: '4px',
                                    background: 'rgba(232, 160, 32, 0.15)',
                                    fontFamily: "'Inter', sans-serif", fontWeight: 700,
                                    marginBottom: '12px',
                                }}>
                                    POPULAR
                                </span>
                                <h3 style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '1.4rem', fontWeight: 700, color: '#fb923c',
                                    marginBottom: '4px',
                                }}>
                                    Premium
                                </h3>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '2rem', fontWeight: 800, color: '#ffffff',
                                    marginBottom: '4px',
                                }}>
                                    ৳22,000
                                </p>
                                <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                                    LIFETIME MEMBERSHIP
                                </span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                                {[
                                    'All Regular Benefits',
                                    'Exclusive Premium Portfolios',
                                    '30% Service Discount',
                                    'Dedicated Account Manager',
                                    'Early Access to New Profiles',
                                ].map(feat => (
                                    <li key={feat} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        marginBottom: '12px', fontSize: '0.85rem', color: '#f1f5f9',
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        <span style={{ color: '#fb923c', display: 'flex', alignItems: 'center' }}>
                                            <CheckIcon />
                                        </span>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button style={{
                            background: '#e8a020',
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
                            background: '#0b192e',
                            border: '1px solid rgba(0, 210, 255, 0.4)',
                            borderRadius: '16px',
                            padding: '28px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            height: '100%',
                            boxShadow: '0 0 30px rgba(0, 210, 255, 0.08)',
                        }}
                    >
                        {/* Visual premium top border line accent for Elite Cyan */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
                            background: 'linear-gradient(90deg, transparent, #00d2ff, transparent)',
                        }} />

                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                                    color: '#a5f3fc', border: '1px solid rgba(6, 182, 212, 0.4)',
                                    padding: '4px 10px', borderRadius: '4px',
                                    background: 'rgba(6, 182, 212, 0.15)',
                                    fontFamily: "'Inter', sans-serif", fontWeight: 700,
                                    marginBottom: '12px',
                                }}>
                                    EXCLUSIVE
                                </span>
                                <h3 style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '1.4rem', fontWeight: 700, color: '#00d2ff',
                                    marginBottom: '4px',
                                }}>
                                    Elite
                                </h3>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '2rem', fontWeight: 800, color: '#ffffff',
                                    marginBottom: '4px',
                                    textShadow: '0 0 10px rgba(0, 210, 255, 0.2)',
                                }}>
                                    ৳50,000
                                </p>
                                <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                                    LIFETIME PRESTIGE
                                </span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                                {[
                                    'All Premium Benefits',
                                    'Unrestricted Platinum Access',
                                    '50% Service Discount',
                                    'Personal Concierge 24/7',
                                    'Private Events & Exclusives',
                                    'Priority Booking Guarantee',
                                ].map(feat => (
                                    <li key={feat} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        marginBottom: '12px', fontSize: '0.85rem', color: '#f1f5f9',
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        <span style={{ color: '#00d2ff', display: 'flex', alignItems: 'center' }}>
                                            <CheckIcon />
                                        </span>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button style={{
                            background: 'linear-gradient(135deg, #00d2ff 0%, #0084ff 100%)',
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