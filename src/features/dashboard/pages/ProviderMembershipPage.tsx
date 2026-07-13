import { motion } from 'framer-motion';
import { TopNav } from './TopNav';

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="var(--gold-mid)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const CrownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="var(--gold-mid)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
    </svg>
);

interface Plan {
    name: string;
    price: number;
    duration: string;
    gradient: string;
    borderColor: string;
    badge?: string;
    benefits: string[];
    comingSoon?: string[];
    isPopular?: boolean;
}

const plans: Plan[] = [
 
    {
        name: 'Elite',
        price: 2500,
        duration: '3 Months',
        gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.1) 100%)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        badge: 'Best Value',
        benefits: [
            'Everything in Professional',
            'Verified Provider Badge',
            'Advanced Analytics Dashboard',
            'Priority Customer Support',
            'Event Access',
        ],
        comingSoon: [
            'Analytics Dashboard',
            'Priority Customer Support',
            'Event Access',
        ],
    },
    {
        name: 'Platinum VIP',
        price: 5000,
        duration: '12 Months',
        gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.1) 100%)',
        borderColor: 'rgba(236, 72, 153, 0.3)',
        badge: 'Premium',
        isPopular: true,
        benefits: [
            'Everything in Elite',
            'Priority Matching',
            'Verified Platinum Badge',
            'Tour/Event Access',
            'VIP Support',
            'Homepage Promotion',
            'Early Access Features',
        ],
        comingSoon: [
            'Priority Matching',
            'Homepage Promotion',
            'Early Access Features',
            'VIP Support',
        ],
    },
];

function TierCard({ plan }: { plan: Plan }) {
    return (
        <motion.div
            variants={fadeUp}
            className="card gold-top-edge"
            style={{
                position: 'relative',
                padding: '32px clamp(20px, 5vw, 48px)',
                gap: 0,
                background: plan.gradient,
                border: `1px solid ${plan.borderColor}`,
                borderRadius: '16px',
                overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = plan.borderColor;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${plan.borderColor.replace('0.3', '0.2')}`;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = plan.borderColor;
                (e.currentTarget as HTMLElement).style.boxShadow = '';
                (e.currentTarget as HTMLElement).style.transform = '';
            }}
        >
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '20px',
                marginBottom: '20px',
            }}>
                <div>
                    {plan.badge && (
                        <span className="badge badge-gold" style={{
                            marginBottom: '8px',
                            fontSize: '0.65rem',
                            padding: '4px 10px',
                            background: plan.gradient,
                            borderColor: plan.borderColor,
                        }}>
                            {plan.badge}
                        </span>
                    )}
                    <h3 style={{
                        fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: '0 0 6px 0',
                        lineHeight: 1.2,
                    }}>
                        {plan.name}
                        {(plan.name === 'Elite' || plan.name === 'Platinum VIP') && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '8px' }}>
                                <CrownIcon />
                            </span>
                        )}
                    </h3>
                    {plan.name === 'Starter' && (
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            margin: '6px 0 0 0',
                            lineHeight: 1.5,
                        }}>
                            Start your provider journey for free
                        </p>
                    )}
                    {plan.name === 'Professional' && (
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            margin: '6px 0 0 0',
                            lineHeight: 1.5,
                        }}>
                            Perfect for growing providers
                        </p>
                    )}
                    {plan.name === 'Elite' && (
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            margin: '6px 0 0 0',
                            lineHeight: 1.5,
                        }}>
                            For established providers scaling up
                        </p>
                    )}
                    {plan.name === 'Platinum VIP' && (
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            margin: '6px 0 0 0',
                            lineHeight: 1.5,
                        }}>
                            Ultimate provider experience
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{
                        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                        fontWeight: 800,
                        color: 'var(--gold-mid)',
                        fontFamily: 'var(--font-sans)',
                        lineHeight: 1,
                    }}>
                        {plan.price === 0 ? 'Free' : `৳${plan.price.toLocaleString()}`}
                    </span>
                    <span className="badge badge-gold" style={{
                        background: plan.gradient,
                        borderColor: plan.borderColor,
                    }}>
                        {plan.duration}
                    </span>
                </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <p style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '14px',
                    fontFamily: 'var(--font-display)',
                }}>
                    Included Benefits
                </p>
                <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px',
                }}>
                    {plan.benefits.map((benefit) => {
                        const isComingSoon = plan.comingSoon?.includes(benefit);
                        return (
                            <li
                                key={benefit}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '0.875rem',
                                    color: isComingSoon ? 'var(--text-muted)' : 'var(--text-secondary)',
                                    fontFamily: 'var(--font-sans)',
                                    opacity: isComingSoon ? 0.5 : 1,
                                }}
                            >
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isComingSoon ? 'var(--bg-input)' : 'var(--gold-glow)',
                                    border: isComingSoon ? '1px solid var(--border-subtle)' : '1px solid var(--border-gold)',
                                    borderRadius: '50%',
                                    width: '22px',
                                    height: '22px',
                                    flexShrink: 0,
                                    opacity: isComingSoon ? 0.5 : 1,
                                }}>
                                    {isComingSoon ? <LockIcon /> : <CheckIcon />}
                                </span>
                                {benefit}
                                {isComingSoon && (
                                    <span className="badge badge-gold" style={{
                                        marginLeft: 'auto',
                                        fontSize: '0.55rem',
                                        padding: '2px 8px',
                                        background: 'rgba(245, 158, 11, 0.15)',
                                        borderColor: 'rgba(245, 158, 11, 0.3)',
                                        color: 'var(--gold-mid)',
                                    }}>
                                        Coming Soon
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <button
                className="btn btn-primary"
                style={{
                    width: '100%',
                    padding: '14px 24px',
                    opacity: 0.6,
                    cursor: 'not-allowed',
                }}
                disabled
            >
                {plan.price === 0 ? 'Get Started' : 'Coming Soon'}
            </button>
        </motion.div>
    );
}

function ComingSoonSection() {
    const comingSoonFeatures = [
        { label: 'Analytics Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
        { label: 'Priority Matching', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
        { label: 'Homepage Promotion', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
        { label: 'Early Access Features', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/></svg> },
        { label: 'VIP Support', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    ];

    return (
        <motion.div
            variants={fadeUp}
            style={{
                marginTop: '32px',
                padding: '24px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
            }}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
            }}>
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'var(--gold-glow)',
                    border: '1px solid var(--border-gold)',
                }}>
                    <LockIcon />
                </span>
                <div>
                    <h4 style={{
                        margin: '0 0 4px 0',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                    }}>
                        Coming Soon Features
                    </h4>
                    <p style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                    }}>
                        These premium features are in development
                    </p>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
            }}>
                {comingSoonFeatures.map((feature) => (
                    <div
                        key={feature.label}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 14px',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '10px',
                            opacity: 0.6,
                        }}
                    >
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'var(--bg-main)',
                            color: 'var(--text-muted)',
                        }}>
                            {feature.icon}
                        </span>
                        <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            color: 'var(--text-secondary)',
                            fontFamily: 'var(--font-sans)',
                        }}>
                            {feature.label}
                        </span>
                        <span className="badge badge-gold" style={{
                            marginLeft: 'auto',
                            fontSize: '0.55rem',
                            padding: '2px 8px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            borderColor: 'rgba(245, 158, 11, 0.3)',
                            color: 'var(--gold-mid)',
                        }}>
                            Soon
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export function ProviderMembershipPage() {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            style={{ minHeight: '100%', background: 'var(--bg-main)', paddingBottom: '32px' }}
        >
            <TopNav />
            <div style={{ padding: '100px 16px 16px', maxWidth: '900px', margin: '0 auto' }}>
                <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                        color: 'var(--text-primary)',
                        marginBottom: '6px',
                        lineHeight: 1.1,
                    }}>
                        Provider Membership Plans
                    </h2>
                    <p style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary)',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                    }}>
                        Grow your business and unlock premium provider tools.
                    </p>
                </motion.div>

                <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                    {plans.map((plan) => (
                        <TierCard key={plan.name} plan={plan} />
                    ))}
                </motion.div>

                <ComingSoonSection />

                <motion.div
                    variants={fadeUp}
                    style={{
                        marginTop: '32px',
                        padding: '20px',
                        background: 'var(--blue-glow)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        position: 'relative',
                    }}
                >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="var(--blue-vivid)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            lineHeight: '1.6',
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                            margin: 0,
                        }}>
                            Membership purchasing for providers is not available yet.
                            These plans are preview only and will be activated in a future update.
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}