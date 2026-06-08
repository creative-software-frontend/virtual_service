import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

export function Hero() {
    return (
        <section style={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '80px 32px',
            textAlign: 'center',
        }}>
            {/* Atmospheric glows */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '900px', height: '500px',
                    borderRadius: '50%', background: 'rgba(29, 78, 216, 0.08)', filter: 'blur(120px)',
                }} />
                <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '600px', height: '400px',
                    borderRadius: '50%', background: 'rgba(120, 80, 20, 0.06)', filter: 'blur(140px)',
                }} />
                {/* Dot grid */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.15,
                    backgroundImage: 'radial-gradient(circle, rgba(197,168,128,0.15) 1px, transparent 1px)',
                    backgroundSize: '44px 44px',
                }} />
            </div>

            {/* Floating particles */}
            {[
                { size: 3, top: '18%', left: '12%', delay: 0, dur: 5 },
                { size: 2, top: '35%', left: '88%', delay: 1.2, dur: 4 },
                { size: 4, top: '70%', left: '7%', delay: 0.6, dur: 6 },
                { size: 2, top: '80%', left: '78%', delay: 2, dur: 5 },
                { size: 3, top: '55%', left: '93%', delay: 0.3, dur: 4.5 },
                { size: 2, top: '25%', left: '55%', delay: 1.8, dur: 5.5 },
            ].map((p, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: p.size, height: p.size,
                        borderRadius: '50%',
                        background: 'rgba(197, 168, 128, 0.5)',
                        top: p.top, left: p.left,
                        pointerEvents: 'none',
                    }}
                    animate={{ y: [0, -14, 0], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}

            {/* Content */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                style={{ position: 'relative', zIndex: 10, maxWidth: '760px', width: '100%' }}
            >
                {/* Eyebrow */}
                <motion.div variants={fadeUp} style={{ marginBottom: '28px' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '12px',
                        border: '1px solid rgba(197, 168, 128, 0.3)',
                        padding: '6px 18px',
                        borderRadius: '9999px',
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: '#C5A880',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                    }}>
                        By Invitation &amp; Application
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1 variants={fadeUp} style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 300,
                    fontSize: 'clamp(2.8rem, 7vw, 5rem)',
                    lineHeight: 1.1,
                    color: '#f1f5f9',
                    marginBottom: '24px',
                    letterSpacing: '-0.02em',
                }}>
                    Discover the Pinnacle of{' '}
                    <span style={{
                        background: 'linear-gradient(90deg, #A87C3A 0%, #E8D5A3 40%, #C5A880 60%, #A87C3A 100%)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontStyle: 'italic',
                        animation: 'shimmer 4s linear infinite',
                    }}>
                        Elite Indulgence
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p variants={fadeUp} style={{
                    color: '#64748b',
                    fontSize: '0.95rem',
                    lineHeight: 1.75,
                    maxWidth: '560px',
                    margin: '0 auto 40px',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    An exclusive, hyper-curated network offering verified VIP companionship,
                    luxurious 5-star accommodations, and strictly confidential high-society gatherings.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div variants={fadeUp} style={{
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px',
                }}>
                    <a href="#tiers" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'linear-gradient(135deg, #A87C3A, #C5A880, #E8D5A3)',
                        color: '#000',
                        padding: '14px 32px',
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontFamily: "'Inter', sans-serif",
                        borderRadius: '2px',
                        boxShadow: '0 4px 20px rgba(197, 168, 128, 0.25)',
                        transition: 'filter 0.2s, transform 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        Submit Application
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </a>
                    <a href="/login" style={{
                        display: 'inline-flex', alignItems: 'center',
                        border: '1px solid #C5A880',
                        color: '#C5A880',
                        padding: '14px 32px',
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontFamily: "'Inter', sans-serif",
                        borderRadius: '2px',
                        transition: 'background 0.2s, color 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#C5A880'; e.currentTarget.style.color = '#000'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C5A880'; }}
                    >
                        Member Sign In
                    </a>
                </motion.div>

                {/* Stats */}
                <motion.div variants={fadeUp} style={{
                    marginTop: '64px',
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '48px',
                }}>
                    {[
                        { value: '500+', label: 'Elite Members' },
                        { value: '100%', label: 'Verified Profiles' },
                        { value: '5★', label: 'Hotel Partners' },
                    ].map(stat => (
                        <div key={stat.label} style={{ textAlign: 'center' }}>
                            <p style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '1.6rem', fontWeight: 300,
                                background: 'linear-gradient(90deg, #A87C3A, #E8D5A3, #C5A880)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>
                                {stat.value}
                            </p>
                            <p style={{
                                fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                                color: '#475569', fontFamily: "'Inter', sans-serif", fontWeight: 600, marginTop: '4px',
                            }}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
                style={{
                    position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.8 }}
            >
                <span style={{ fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                    Scroll
                </span>
                <motion.div
                    style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(197,168,128,0.5), transparent)' }}
                    animate={{ scaleY: [1, 0.4, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.div>
        </section>
    );
}
