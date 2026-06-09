import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

const experiences = [
    {
        id: 'profiles',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        label: 'Verified Profiles',
        sublabel: 'Verified Profiles',
        title: 'Verified Profiles',
        description: 'Browse our highly vetted, discreet network of elite companions. From casual dates to full live-in experiences, tailored to your exact desires.',
        cta: 'Explore Directory',
        featured: false,
    },
    {
        id: 'sanctuaries',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
        label: '5-Star Access',
        sublabel: '5-Star Access',
        title: 'Luxury Sanctuaries',
        description: 'Gain unrestricted access to the finest 5-star accommodations across the country with pre-cleared, completely discreet check-in protocols.',
        cta: 'View Sanctuaries',
        featured: true,
    },
    {
        id: 'gatherings',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        label: 'Private Events',
        sublabel: 'Private Events',
        title: 'Confidential Gatherings',
        description: 'Secure your spot at high-society masquerades, exclusive yacht afterparties, and strictly confidential, closed-door VIP events.',
        cta: 'View Schedules',
        featured: false,
    },
];

export function Experiences() {
    return (
        <section id="experiences" style={{
            padding: 'clamp(56px, 8vw, 96px) clamp(16px, 4vw, 32px)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* bg glow */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '800px', height: '400px',
                    borderRadius: '50%',
                    background: 'rgba(29, 78, 216, 0.05)',
                    filter: 'blur(120px)',
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto' }}>

                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7 }}
                    style={{ textAlign: 'center', marginBottom: '64px' }}
                >
                    <span style={{
                        display: 'block',
                        fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                        color: '#C5A880', fontFamily: "'Inter', sans-serif", fontWeight: 600,
                        marginBottom: '16px',
                    }}>
                        What We Offer
                    </span>
                    <h2 style={{
                        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                        fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', color: '#f1f5f9', marginBottom: '16px',
                        letterSpacing: '-0.01em',
                    }}>
                        Curated Experiences
                    </h2>
                    <p style={{
                        color: '#64748b', fontSize: '0.9rem',
                        fontFamily: "'Inter', sans-serif", maxWidth: '440px', margin: '0 auto',
                    }}>
                        Designed for the unapologetic elite.
                    </p>
                    <div style={{
                        width: '48px', height: '1px', margin: '24px auto 0',
                        background: 'linear-gradient(90deg, transparent, #C5A880, transparent)',
                    }} />
                </motion.div>

                {/* Cards */}
                <motion.div
                    className="experiences-grid"
                    variants={container} initial="hidden" whileInView="visible"
                    viewport={{ once: true }}
                >
                    {experiences.map(exp => (
                        <motion.div
                            key={exp.id}
                            variants={fadeUp}
                            style={{
                                background: '#071020',
                                border: `1px solid ${exp.featured ? 'rgba(197, 168, 128, 0.3)' : 'rgba(30, 58, 100, 0.5)'}`,
                                borderRadius: '16px',
                                padding: '36px 28px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
                            }}
                            whileHover={{ y: -4, boxShadow: '0 8px 40px rgba(197, 168, 128, 0.12)' }}
                        >
                            {/* Gold top edge */}
                            <div style={{
                                position: 'absolute', top: 0, left: '30%', right: '30%', height: '1px',
                                background: 'linear-gradient(90deg, transparent, #C5A880, transparent)',
                            }} />

                            {/* Featured badge */}
                            {exp.featured && (
                                <span style={{
                                    position: 'absolute', top: '16px', right: '16px',
                                    fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                                    color: '#C5A880', border: '1px solid rgba(197, 168, 128, 0.3)',
                                    padding: '3px 9px', borderRadius: '9999px',
                                    background: 'rgba(197, 168, 128, 0.1)',
                                    fontFamily: "'Inter', sans-serif", fontWeight: 700,
                                }}>
                                    Featured
                                </span>
                            )}

                            {/* Icon box */}
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '12px',
                                background: exp.featured ? 'rgba(197, 168, 128, 0.12)' : 'rgba(30, 58, 100, 0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: exp.featured ? '#C5A880' : '#64748b',
                                marginBottom: '20px',
                            }}>
                                {exp.icon}
                            </div>

                            {/* Label */}
                            <span style={{
                                fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                                color: '#475569', fontFamily: "'Inter', sans-serif", fontWeight: 700,
                                marginBottom: '8px', display: 'block',
                            }}>
                                {exp.sublabel}
                            </span>

                            {/* Title */}
                            <h3 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '1.5rem', fontWeight: 400,
                                color: exp.featured ? '#E8D5A3' : '#f1f5f9',
                                marginBottom: '14px', lineHeight: 1.3,
                            }}>
                                {exp.title}
                            </h3>

                            {/* Description */}
                            <p style={{
                                color: '#475569', fontSize: '0.82rem', lineHeight: 1.7,
                                fontFamily: "'Inter', sans-serif", flex: 1, marginBottom: '24px',
                            }}>
                                {exp.description}
                            </p>

                            {/* CTA */}
                            <a href="#" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                                fontWeight: 700, fontFamily: "'Inter', sans-serif",
                                color: exp.featured ? '#C5A880' : '#475569',
                                textDecoration: 'none',
                                transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#C5A880')}
                                onMouseLeave={e => (e.currentTarget.style.color = exp.featured ? '#C5A880' : '#475569')}
                            >
                                {exp.cta}
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </a>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
