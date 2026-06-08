import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const tiers = [
    {
        id: 'demo',
        tag: 'Demo Access',
        name: 'Free',
        features: [
            { label: 'Basic Platform Access', included: true },
            { label: 'View Demo Profiles', included: true },
            { label: 'Hotel Access', included: false },
            { label: 'Party Schedules', included: false },
        ],
        cta: 'Register Free',
        featured: false,
    },
    {
        id: 'premium',
        tag: 'Premium Elite',
        name: '৳22,000',
        features: [
            { label: 'Lifetime VIP Status', included: true },
            { label: 'Full Elite Profile Access', included: true },
            { label: '5-Star Hotel Clearance', included: true },
            { label: 'Underground Party Registration', included: true },
            { label: '30% Booking Offset', included: true },
        ],
        cta: 'Acquire Premium',
        featured: true,
    },
    {
        id: 'regular',
        tag: 'Regular Standard',
        name: '৳12,000',
        features: [
            { label: 'Lifetime Access', included: true },
            { label: 'Regular Profile Access', included: true },
            { label: 'Standard Hotel Clearance', included: true },
            { label: '10% Booking Offset', included: true },
        ],
        cta: 'Acquire Regular',
        featured: false,
    },
];

export function MembershipTiers() {
    return (
        <section id="tiers" style={{
            padding: '96px 32px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* bg glows */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '900px', height: '400px', borderRadius: '50%',
                    background: 'rgba(120, 80, 20, 0.06)', filter: 'blur(140px)',
                }} />
                <div style={{
                    position: 'absolute', top: 0, left: '20%',
                    width: '500px', height: '300px', borderRadius: '50%',
                    background: 'rgba(29, 78, 216, 0.05)', filter: 'blur(100px)',
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto' }}>

                {/* Divider ornament */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    marginBottom: '64px', textAlign: 'center',
                    color: '#475569', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif", fontWeight: 600,
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(197,168,128,0.25), transparent)' }} />
                    Unlock Unrestricted Reality
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(197,168,128,0.25), transparent)' }} />
                </div>

                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7 }}
                    style={{ textAlign: 'center', marginBottom: '56px' }}
                >
                    <h2 style={{
                        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                        fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#f1f5f9', marginBottom: '12px',
                        letterSpacing: '-0.01em',
                    }}>
                        Membership Tiers
                    </h2>
                    <span style={{
                        display: 'block',
                        fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                        color: '#C5A880', fontFamily: "'Inter', sans-serif", fontWeight: 600,
                    }}>
                        Unlock Unrestricted Reality
                    </span>
                    <div style={{
                        width: '48px', height: '1px', margin: '20px auto 0',
                        background: 'linear-gradient(90deg, transparent, #C5A880, transparent)',
                    }} />
                </motion.div>

                {/* Cards */}
                <motion.div
                    variants={container} initial="hidden" whileInView="visible"
                    viewport={{ once: true }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px',
                        alignItems: 'center',
                    }}
                >
                    {tiers.map(tier => (
                        <motion.div
                            key={tier.id}
                            variants={fadeUp}
                            style={{
                                background: tier.featured ? '#07111f' : '#06101c',
                                border: `1px solid ${tier.featured ? 'rgba(197, 168, 128, 0.4)' : 'rgba(30, 58, 100, 0.6)'}`,
                                borderRadius: '16px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                transform: tier.featured ? 'scale(1.03)' : 'scale(1)',
                                boxShadow: tier.featured ? '0 0 60px rgba(197, 168, 128, 0.08)' : 'none',
                                zIndex: tier.featured ? 10 : 1,
                            }}
                        >
                            {/* Gold top line for featured */}
                            {tier.featured && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                                    background: 'linear-gradient(90deg, transparent, #C5A880, transparent)',
                                }} />
                            )}

                            {/* Header */}
                            <div style={{
                                padding: '32px 32px 24px',
                                borderBottom: `1px solid ${tier.featured ? 'rgba(197,168,128,0.15)' : 'rgba(30,58,100,0.5)'}`,
                                textAlign: 'center',
                            }}>
                                <span style={{
                                    display: 'block',
                                    fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                                    color: '#475569', fontFamily: "'Inter', sans-serif", fontWeight: 700,
                                    marginBottom: '12px',
                                }}>
                                    {tier.tag}
                                </span>
                                <p style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '2.8rem', fontWeight: 300, lineHeight: 1,
                                    color: tier.featured ? '#E8D5A3' : '#f1f5f9',
                                }}>
                                    {tier.name}
                                </p>
                                {tier.featured && (
                                    <span style={{
                                        display: 'inline-block', marginTop: '12px',
                                        fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                                        color: '#C5A880', border: '1px solid rgba(197, 168, 128, 0.3)',
                                        padding: '3px 9px', borderRadius: '9999px',
                                        background: 'rgba(197, 168, 128, 0.1)',
                                        fontFamily: "'Inter', sans-serif", fontWeight: 700,
                                    }}>
                                        Most Popular
                                    </span>
                                )}
                            </div>

                            {/* Features */}
                            <ul style={{ padding: '24px 32px', flex: 1, listStyle: 'none', margin: 0 }}>
                                {tier.features.map(f => (
                                    <li key={f.label} style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '12px', fontSize: '0.82rem',
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        <span style={{
                                            flexShrink: 0,
                                            color: f.included
                                                ? (tier.featured ? '#C5A880' : '#10b981')
                                                : '#334155',
                                        }}>
                                            {f.included ? <CheckIcon /> : <XIcon />}
                                        </span>
                                        <span style={{
                                            color: f.included ? '#cbd5e1' : '#334155',
                                            textDecoration: f.included ? 'none' : 'line-through',
                                        }}>
                                            {f.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <div style={{ padding: '0 32px 32px' }}>
                                <a href="/signup" style={{
                                    display: 'block', width: '100%', textAlign: 'center',
                                    padding: '13px',
                                    fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                                    fontWeight: 700, fontFamily: "'Inter', sans-serif",
                                    textDecoration: 'none',
                                    borderRadius: '2px',
                                    transition: 'all 0.2s',
                                    ...(tier.featured ? {
                                        background: 'linear-gradient(135deg, #A87C3A, #C5A880, #E8D5A3)',
                                        color: '#000',
                                        border: '1px solid transparent',
                                        boxShadow: '0 4px 20px rgba(197, 168, 128, 0.2)',
                                    } : {
                                        background: 'transparent',
                                        color: '#C5A880',
                                        border: '1px solid rgba(197, 168, 128, 0.5)',
                                    }),
                                }}
                                    onMouseEnter={e => {
                                        if (!tier.featured) {
                                            e.currentTarget.style.background = 'rgba(197,168,128,0.1)';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!tier.featured) {
                                            e.currentTarget.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    {tier.cta}
                                </a>
                            </div>

                            {/* Bottom glow for featured */}
                            {tier.featured && (
                                <div style={{
                                    position: 'absolute', bottom: 0, left: '25%', right: '25%', height: '1px',
                                    background: 'linear-gradient(90deg, transparent, rgba(197, 168, 128, 0.4), transparent)',
                                    filter: 'blur(2px)',
                                }} />
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footnote */}
                <motion.p
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
                    style={{
                        textAlign: 'center', marginTop: '40px',
                        color: '#334155', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    All memberships are lifetime access · No recurring charges
                </motion.p>
            </div>
        </section>
    );
}
