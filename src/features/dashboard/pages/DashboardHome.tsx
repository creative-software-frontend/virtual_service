import { useParams } from 'react-router-dom';
import { TopNav } from './TopNav';

const PROFILES = [
    { name: 'Sabia',  id: '#550369', img: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=300&q=80', demo: true },
    { name: 'Fatiha', id: '#550983', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80', demo: true },
    { name: 'Samina', id: '#550120', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80', demo: false },
];

const LOCATIONS = [
    {
        name: 'Safehouse (Zindabazar Zone)',
        tier: 'PREMIUM',
        city: 'Sylhet',
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
    },
    {
        name: 'Safehouse (Dhanmondi Zone)',
        tier: 'PREMIUM',
        city: 'Dhaka',
        img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80',
    },
];

export function DashboardHome() {
    const { role } = useParams<{ role: string }>();
    const user = localStorage.getItem('bluedise_user') || 'member';

    return (
        <div style={{ background: 'var(--bg-root)', minHeight: '100svh', overflowX: 'hidden' }}>
            <TopNav />

            {/* Content sits below fixed TopNav — clamp keeps padding fluid */}
            <div style={{
                padding: 'clamp(80px, 22vw, 100px) clamp(12px, 4vw, 16px) 16px',
                width: '100%',
                boxSizing: 'border-box',
            }}>

                {/* ── Welcome card ── */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--bg-card-hover) 0%, var(--bg-card) 100%)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '14px',
                    padding: 'clamp(14px, 4vw, 20px)',
                    marginBottom: '14px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-blue)',
                }}>
                    {/* Top accent line */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                        background: 'linear-gradient(90deg, transparent, var(--blue-vivid), transparent)',
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div>
                            <p style={{
                                fontSize: 'clamp(1.1rem, 5vw, 1.35rem)',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                fontFamily: "'Inter', sans-serif",
                                marginBottom: '4px',
                            }}>
                                Welcome, {user}
                            </p>
                            <p style={{
                                fontSize: 'clamp(0.6rem, 2vw, 0.7rem)',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: 'var(--text-secondary)',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                            }}>
                                YOUR ACCESS PORTAL
                            </p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(96,165,250,0.7))' }}>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                            <span style={{
                                display: 'block',
                                fontSize: 'clamp(0.55rem, 1.8vw, 0.65rem)',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: 'var(--blue-vivid)',
                                fontWeight: 700,
                                fontFamily: "'Inter', sans-serif",
                                marginTop: '4px',
                            }}>
                                FREE
                            </span>
                        </div>
                    </div>

                    {/* Upgrade bar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'var(--blue-glow)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: 'clamp(10px, 3vw, 12px) clamp(10px, 3.5vw, 14px)',
                        marginBottom: '14px',
                        boxShadow: 'inset 0 0 10px rgba(59,130,246,0.2)',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 3px rgba(96,165,250,0.6))' }}>
                            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span style={{
                            fontSize: 'clamp(0.78rem, 3.5vw, 0.85rem)',
                            color: 'var(--text-primary)',
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                        }}>
                            Upgrade to unlock benefits
                        </span>
                    </div>

                    {/* CTA button */}
                    <a href={`/${role}/dashboard/membership`} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--gold-mid)',
                        color: '#000',
                        padding: 'clamp(9px, 2.5vw, 11px) clamp(16px, 5vw, 22px)',
                        fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: 800,
                        textDecoration: 'none',
                        fontFamily: "'Inter', sans-serif",
                        borderRadius: '6px',
                        boxShadow: '0 0 10px rgba(232,160,32,0.5)',
                    }}>
                        → SEE PLANS
                    </a>
                </div>

                {/* ── Stats row ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 'clamp(6px, 2vw, 10px)',
                    marginBottom: '14px',
                    boxShadow: '0 0 15px rgba(59,130,246,0.3)',
                    borderRadius: '12px',
                }}>
                    {[
                        { label: 'LEVEL',    value: 'Free', highlight: false },
                        { label: 'BOOKINGS', value: '0',    highlight: false },
                        { label: 'ONLINE',   value: '253',  highlight: true  },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: 'linear-gradient(135deg, var(--bg-card-hover) 0%, var(--bg-card) 100%)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            padding: 'clamp(12px, 3.5vw, 16px) clamp(6px, 2vw, 10px)',
                            textAlign: 'center',
                        }}>
                            <p style={{
                                fontSize: 'clamp(1rem, 5vw, 1.35rem)',
                                fontWeight: 800,
                                color: s.highlight ? 'var(--green-status)' : 'var(--text-primary)',
                                fontFamily: "'Inter', sans-serif",
                                marginBottom: '4px',
                                textShadow: s.highlight ? '0 0 10px rgba(34,197,94,0.7)' : '0 0 5px rgba(248,250,252,0.3)',
                            }}>
                                {s.highlight && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--green-status)', marginRight: 5, boxShadow: '0 0 8px var(--green-status)' }} />}
                                {s.value}
                            </p>
                            <p style={{
                                fontSize: 'clamp(0.5rem, 1.8vw, 0.6rem)',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: 'var(--text-secondary)',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                            }}>
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── Quick links ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 'clamp(6px, 2vw, 10px)',
                    marginBottom: '20px',
                    boxShadow: '0 0 15px rgba(59,130,246,0.3)',
                    borderRadius: '14px',
                }}>
                    {[
                        {
                            to: `/${role}/dashboard/models`, label: 'MODELS',
                            icon: <svg width="clamp(22px,6vw,28px)" height="clamp(22px,6vw,28px)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(203,213,225,0.6))' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
                        },
                        {
                            to: `/${role}/dashboard/assets`, label: 'PLACES',
                            icon: <svg width="clamp(22px,6vw,28px)" height="clamp(22px,6vw,28px)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(203,213,225,0.6))' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
                        },
                        {
                            to: `/${role}/dashboard/membership`, label: 'MEMBERSHIP',
                            icon: <svg width="clamp(22px,6vw,28px)" height="clamp(22px,6vw,28px)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(203,213,225,0.6))' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" /></svg>,
                        },
                    ].map(q => (
                        <a key={q.to} href={q.to} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'clamp(6px, 2vw, 10px)',
                            background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '14px',
                            padding: 'clamp(16px, 5vw, 22px) clamp(6px, 2vw, 10px)',
                            textDecoration: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: 'clamp(0.55rem, 2vw, 0.65rem)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            fontFamily: "'Inter', sans-serif",
                            boxShadow: 'inset 0 0 10px rgba(59,130,246,0.15)',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            textAlign: 'center',
                        }}>
                            {q.icon}
                            {q.label}
                        </a>
                    ))}
                </div>

                {/* ── Recent Activity ── */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: 'clamp(14px, 4vw, 18px)',
                    marginBottom: '20px',
                    boxShadow: '0 0 20px rgba(59,130,246,0.35)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 5px rgba(96,165,250,0.6))' }}>
                            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        <span style={{ fontSize: 'clamp(0.85rem, 4vw, 0.95rem)', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
                            Recent Activity
                        </span>
                    </div>
                    <div style={{ textAlign: 'center', padding: '28px 0' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--bg-input)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}>
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.8rem, 3.5vw, 0.88rem)', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                            No recent activity found.
                        </p>
                    </div>
                </div>

                {/* ── Featured Profiles ── */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ color: 'var(--gold-mid)', fontSize: '18px', textShadow: '0 0 10px rgba(232,160,32,0.7)', flexShrink: 0 }}>★</span>
                        <span style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
                            Featured Profiles
                        </span>
                    </div>
                    {/* Horizontal scroll — cards sized relative to viewport */}
                    <div style={{ display: 'flex', gap: 'clamp(10px, 3vw, 14px)', overflowX: 'auto', paddingBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                        {PROFILES.map(p => (
                            <div key={p.id} style={{
                                flex: '0 0 clamp(120px, 38vw, 150px)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '2px solid var(--blue-vivid)',
                                position: 'relative',
                                cursor: 'pointer',
                                boxShadow: '0 0 15px rgba(59,130,246,0.3)',
                            }}>
                                <img src={p.img} alt={p.name} style={{ width: '100%', height: 'clamp(150px, 48vw, 190px)', objectFit: 'cover', display: 'block' }} />
                                {p.demo && (
                                    <span style={{
                                        position: 'absolute', top: '8px', right: '8px',
                                        background: 'var(--bg-overlay)', color: 'var(--text-primary)',
                                        fontSize: '0.55rem', letterSpacing: '0.15em',
                                        textTransform: 'uppercase', padding: '4px 8px',
                                        borderRadius: '4px', fontFamily: "'Inter', sans-serif", fontWeight: 800,
                                        boxShadow: '0 0 5px rgba(248,250,252,0.4)',
                                    }}>
                                        DEMO
                                    </span>
                                )}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    background: 'linear-gradient(transparent, var(--bg-nav))',
                                    padding: '28px 10px 10px',
                                }}>
                                    <p style={{ color: 'var(--text-primary)', fontSize: 'clamp(0.85rem, 4vw, 1rem)', fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: '3px' }}>{p.name}</p>
                                    <p style={{ color: 'var(--blue-vivid)', fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)', fontWeight: 600, fontFamily: "'Inter', sans-serif", textShadow: '0 0 5px rgba(96,165,250,0.5)' }}>{p.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Featured Locations ── */}
                <div style={{ paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 5px rgba(96,165,250,0.6))' }}>
                            <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
                        </svg>
                        <span style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
                            Featured Locations
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 'clamp(10px, 3vw, 14px)', overflowX: 'auto', paddingBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                        {LOCATIONS.map(loc => (
                            <div key={loc.name} style={{
                                flex: '0 0 clamp(180px, 55vw, 220px)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid var(--border-default)',
                                position: 'relative',
                                cursor: 'pointer',
                                boxShadow: '0 0 15px rgba(59,130,246,0.3)',
                            }}>
                                <img src={loc.img} alt={loc.name} style={{ width: '100%', height: 'clamp(130px, 40vw, 160px)', objectFit: 'cover', display: 'block' }} />
                                <span style={{
                                    position: 'absolute', top: '8px', right: '8px',
                                    background: 'var(--bg-overlay)', color: 'var(--green-status)',
                                    fontSize: '0.55rem', letterSpacing: '0.15em',
                                    textTransform: 'uppercase', padding: '4px 10px',
                                    borderRadius: '4px', fontFamily: "'Inter', sans-serif", fontWeight: 800,
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    boxShadow: '0 0 8px rgba(34,197,94,0.6)',
                                }}>
                                    ● SAFEHOUSE
                                </span>
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    background: 'linear-gradient(transparent, var(--bg-nav))',
                                    padding: '28px 12px 12px',
                                }}>
                                    <p style={{ color: 'var(--text-primary)', fontSize: 'clamp(0.82rem, 3.5vw, 0.95rem)', fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: '4px' }}>{loc.name}</p>
                                    <p style={{ color: 'var(--blue-vivid)', fontSize: 'clamp(0.58rem, 2vw, 0.65rem)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", fontWeight: 700, marginBottom: '5px', textShadow: '0 0 5px rgba(96,165,250,0.5)' }}>{loc.tier}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{loc.city}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}