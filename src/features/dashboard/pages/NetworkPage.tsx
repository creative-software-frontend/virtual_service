import { useState } from "react";
import { motion } from "framer-motion";
import { TopNav } from "./TopNav"; // Assuming TopNav exists in your paths

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

export function NetworkPage() {
    const [referralUrl] = useState("https://service.bluedise.com/login.php?ref=BD2UEFC0ZJ");
    const [copied, setCopied] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(referralUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link: ", err);
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            style={{ minHeight: '100vh', background: '#060d1a', width: '100%' }}
        >
            {/* Global Context Desktop Top Navigation Header */}
            <TopNav />

            {/* Content Container Frame matching Bluedise Core Grid Layout */}
            <div style={{
                width: '100%',
                maxWidth: '2400px',
                margin: '0 auto',
                padding: '108px 40px 48px 40px',
                boxSizing: 'border-box'
            }}>

                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* MODIFIED SECTION 1: Standardized 3-Column Dashboard Matrix */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px',
                        marginBottom: '32px'
                    }}>
                        {[
                            {
                                title: "EARNINGS",
                                value: "৳ 0",
                                icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="5" width="20" height="14" rx="2" />
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                    </svg>
                                )
                            },
                            {
                                title: "REFERRALS",
                                value: "0",
                                icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    </svg>
                                )
                            },
                            {
                                title: "CONVERSIONS",
                                value: "0",
                                icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                )
                            },
                            {
                                title: "COMMISSION",
                                value: "0%",
                                icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
                                    </svg>
                                )
                            }
                        ].map((stat, idx) => (
                            <motion.div key={idx} variants={fadeUp} style={{
                                background: 'linear-gradient(135deg, #09132e 0%, #060d20 100%)',
                                border: '1px solid #132a5e',
                                borderRadius: '14px',
                                padding: '24px 20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                                textAlign: 'center'
                            }}>
                                <div style={{ opacity: 0.85 }}>{stat.icon}</div>
                                <span style={{
                                    fontSize: '0.65rem',
                                    letterSpacing: '0.15em',
                                    fontWeight: 700,
                                    color: '#64748b',
                                    textTransform: 'uppercase'
                                }}>
                                    {stat.title}
                                </span>
                                <span style={{
                                    fontSize: '1.45rem',
                                    fontWeight: 700,
                                    color: '#00e5ff',
                                    fontFamily: "'Inter', sans-serif",
                                    textShadow: '0 0 16px rgba(0, 229, 255, 0.25)'
                                }}>
                                    {stat.value}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* SECTION 2: Master Referral Engine Panel Card */}
                    <motion.div variants={fadeUp} style={{
                        background: 'linear-gradient(180deg, #09132e 0%, #060d20 100%)',
                        border: '1px solid #132a5e',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: '0 12px 36px rgba(0,0,0,0.4)'
                    }}>

                        {/* Box Header Label */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 500, color: '#4a9eff', fontFamily: "'Inter', sans-serif", letterSpacing: '0.02em' }}>
                                Your Referral Network Link
                            </h3>
                        </div>
                        {/* Interactive Link Input String & Action Row */}
                        <div style={{
                            display: 'flex',
                            background: '#02050d', // Deepened back to absolute dark to make text pop
                            border: '1px solid #1e293b', // Sharper slate border for crisp contrast
                            borderRadius: '10px',
                            padding: '8px 8px 8px 18px', // Balanced spacing
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '16px',
                            marginBottom: '32px',
                            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)'
                        }}>
                            <span style={{
                                color: '#f8fafc', // Swapped to ultra-bright slate/white for maximum legibility
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                fontFamily: "system-ui, -apple-system, sans-serif", // Clean sans-serif over monospace for superior readability
                                letterSpacing: '0.02em',
                                textShadow: '0 1px 2px rgba(0,0,0,0.5)', // Protects readability over background variations
                                overflowX: 'auto',
                                whiteSpace: 'nowrap',
                                width: '100%',
                                scrollbarWidth: 'none', // Hides scrollbar on Firefox
                                msOverflowStyle: 'none' // Hides scrollbar on IE/Edge
                            }}>
                                {referralUrl}
                            </span>
                            <button
                                onClick={handleCopyLink}
                                style={{
                                    background: copied ? '#10b981' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                    padding: '12px 24px',
                                    fontSize: '0.75rem',
                                    fontWeight: 800, // Slightly heavier weight for clear button readability
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                    boxShadow: copied ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(59, 130, 246, 0.3)'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.filter = 'brightness(1.1)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0px)';
                                    e.currentTarget.style.filter = 'none';
                                }}
                            >
                                {copied ? "COPIED!" : "COPY LINK"}
                            </button>
                        </div>

                        {/* Divider Line */}
                        <div style={{ height: '1px', background: '#132a5e', width: '100%', marginBottom: '24px' }} />

                        {/* SECTION 3: Reward Structure Metric List Layout */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                    <path d="M20 12V8H4v4M2 4h20v4H2zM4 12h16v8H4zM12 12v8" />
                                </svg>
                                <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                                    REWARD STRUCTURE
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { level: "1 Referral Purchase:", text: "Regular Tier + ৳1,000 Bonus", color: '#10b981', symbol: "★" },
                                    { level: "2 Referral Purchases:", text: "Premium Tier + Extra ৳1,000 Bonus", color: '#f59e0b', symbol: "👑" },
                                    { level: "5 Referral Purchases:", text: "Elite Tier + ৳5,000 Bonus", color: '#06b6d4', symbol: "💎" },
                                    { level: "Lifetime Benefits:", text: "Unlocked networks are permanent.", color: '#3b82f6', symbol: "∞" }
                                ].map((reward, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.85rem' }}>
                                        <span style={{ color: reward.color, fontSize: '1rem', width: '20px', textAlign: 'center' }}>
                                            {reward.symbol}
                                        </span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{reward.level}</span>
                                            <span style={{ color: '#94a3b8' }}>{reward.text}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                </div>

            </div>
        </motion.div>
    );
}