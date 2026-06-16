import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

export function Hero() {
    return (
        <section className="hero-section">
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
                    backgroundImage: 'radial-gradient(circle, var(--gold-glow) 1px, transparent 1px)',
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
                className="hero-content"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                {/* Eyebrow */}
                <motion.div variants={fadeUp} style={{ marginBottom: '28px' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '12px',
                        border: '1px solid var(--gold-border)',
                        padding: '6px 18px',
                        borderRadius: '9999px',
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--gold-mid)',
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                    }}>
                        By Invitation &amp; Application
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1 variants={fadeUp} style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 300,
                    fontSize: 'clamp(2.4rem, 7vw, 5rem)',
                    lineHeight: 1.1,
                    color: 'var(--text-primary)',
                    marginBottom: '24px',
                    letterSpacing: '-0.02em',
                }}>
                    Discover the Pinnacle of{' '}
                    <span style={{
                        background: 'linear-gradient(90deg, var(--gold-deep) 0%, var(--gold-light) 40%, var(--gold-mid) 60%, var(--gold-deep) 100%)',
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
                    color: 'var(--text-muted)',
                    fontSize: 'clamp(0.82rem, 2vw, 0.95rem)',
                    lineHeight: 1.75,
                    maxWidth: '560px',
                    margin: '0 auto 40px',
                    fontFamily: "var(--font-sans)",
                }}>
                    An exclusive, hyper-curated network offering verified VIP companionship,
                    luxurious 5-star accommodations, and strictly confidential high-society gatherings.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div variants={fadeUp} className="hero-cta-group">
                    <a href="#tiers" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'linear-gradient(135deg, var(--gold-deep), var(--gold-mid), var(--gold-light))',
                        color: '#000',
                        padding: '14px 32px',
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontFamily: "var(--font-sans)",
                        borderRadius: '2px',
                        boxShadow: 'var(--shadow-gold)',
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
                        border: '1px solid var(--gold-mid)',
                        color: 'var(--gold-mid)',
                        padding: '14px 32px',
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontFamily: "var(--font-sans)",
                        borderRadius: '2px',
                        transition: 'background 0.2s, color 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-mid)'; e.currentTarget.style.color = '#000'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gold-mid)'; }}
                    >
                        Member Sign In
                    </a>
                </motion.div>

                {/* Stats */}
                <motion.div variants={fadeUp} className="hero-stats">
                    {[
                        { value: '500+', label: 'Elite Members' },
                        { value: '100%', label: 'Verified Profiles' },
                        { value: '5★', label: 'Hotel Partners' },
                    ].map(stat => (
                        <div key={stat.label} style={{ textAlign: 'center' }}>
                            <p style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', fontWeight: 300,
                                background: 'linear-gradient(90deg, var(--gold-deep), var(--gold-light), var(--gold-mid))',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>
                                {stat.value}
                            </p>
                            <p style={{
                                fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                                color: 'var(--text-muted)', fontFamily: "var(--font-sans)", fontWeight: 600, marginTop: '4px',
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
                <span style={{ fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: "var(--font-sans)" }}>
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
