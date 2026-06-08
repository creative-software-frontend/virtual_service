import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            width: '100%',
            backgroundColor: 'rgba(2, 6, 18, 0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(30, 58, 100, 0.4)',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 32px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Brand */}
                <span style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '1.1rem',
                    letterSpacing: '0.25em',
                    color: '#C5A880',
                    fontWeight: 500,
                    userSelect: 'none',
                }}>
                    BLUEDISE
                </span>

                {/* Nav Links + CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <a href="#experiences" style={{
                        color: '#94a3b8',
                        fontSize: '0.65rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        fontFamily: "'Inter', sans-serif",
                    }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#E8D5A3')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                    >
                        Experiences
                    </a>
                    <a href="#tiers" style={{
                        color: '#94a3b8',
                        fontSize: '0.65rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        fontFamily: "'Inter', sans-serif",
                    }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#E8D5A3')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                    >
                        Tiers
                    </a>
                    <Link to="/login" style={{
                        color: '#94a3b8',
                        fontSize: '0.65rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        fontFamily: "'Inter', sans-serif",
                    }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#E8D5A3')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                    >
                        Sign In
                    </Link>
                    <a href="#tiers" style={{
                        backgroundColor: '#C5A880',
                        color: '#000',
                        padding: '10px 22px',
                        fontSize: '0.6rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontFamily: "'Inter', sans-serif",
                        borderRadius: '2px',
                        transition: 'filter 0.2s',
                        whiteSpace: 'nowrap',
                    }}
                        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.12)')}
                        onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    >
                        Apply Now
                    </a>
                </div>
            </div>
        </nav>
    );
}