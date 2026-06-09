import { useState } from "react";
import { Link } from "react-router-dom";

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 200,
            width: '100%',
            backgroundColor: 'rgba(2, 6, 18, 0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(30, 58, 100, 0.4)',
        }}>
            <div className="navbar-inner">
                {/* Brand */}
                <span className="navbar-brand">BLUEDISE</span>

                {/* Desktop Nav Links */}
                <div className="navbar-links">
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

                {/* Hamburger button (mobile/tablet) */}
                <button
                    className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
                    aria-label="Toggle navigation"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(prev => !prev)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                {/* Mobile dropdown menu */}
                <div className={`navbar-mobile-menu${menuOpen ? ' open' : ''}`}>
                    <a href="#experiences" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
                        Experiences
                    </a>
                    <a href="#tiers" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
                        Tiers
                    </a>
                    <Link to="/login" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
                        Sign In
                    </Link>
                    <a href="#tiers" className="navbar-mobile-cta" onClick={() => setMenuOpen(false)}>
                        Apply Now
                    </a>
                </div>
            </div>
        </nav>
    );
}