import { TopNav } from './TopNav';

const PROFILES = [
    { name: 'Sabia', id: '#550369', img: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=300&q=80', demo: true },
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
    const user = localStorage.getItem('bluedise_user') || 'member';

    return (
        <div style={{ padding: '0 0 16px', background: '#030509', minHeight: '100vh' }}>
            <TopNav />

            {/* Standardized 64px Top Padding to sit perfectly below TopNav */}
            <div style={{ padding: '100px 16px 16px', maxWidth: '1200px', margin: '0 auto' }}>

                {/* Welcome card with blue glow */}
                <div style={{
                    background: 'linear-gradient(135deg, #0d1e3d 0%, #081220 100%)',
                    border: '1px solid rgba(59,130,246,0.5)',
                    borderRadius: '14px',
                    padding: '20px',
                    marginBottom: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' // ADDED: Blue glow
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)', // INCREASED: Opacity for glow
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div>
                            {/* Larger, high-visibility welcome header */}
                            <p style={{
                                fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc',
                                fontFamily: "'Inter', sans-serif", marginBottom: '4px',
                            }}>
                                Welcome, {user}
                            </p>
                            <p style={{
                                fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                                color: '#a0aec0', fontFamily: "'Inter', sans-serif", fontWeight: 600, // LIGHTENED: For visibility
                            }}>
                                YOUR ACCESS PORTAL
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(96, 165, 250, 0.7))' }}> {/* ADDED: Svg glow */}
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                            <span style={{
                                display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em',
                                textTransform: 'uppercase', color: '#60a5fa', fontWeight: 700, // LIGHTENED: For glow-like visibility
                                fontFamily: "'Inter', sans-serif", marginTop: '4px',
                            }}>
                                FREE
                            </span>
                        </div>
                    </div>

                    {/* Upgrade bar */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        background: 'rgba(59,130,246,0.12)', // INCREASED: Background opacity
                        border: '1px solid rgba(59,130,246,0.4)', // INCREASED: Border opacity
                        borderRadius: '8px', padding: '12px 14px',
                        marginBottom: '16px',
                        boxShadow: 'inset 0 0 10px rgba(59, 130, 246, 0.2)' // ADDED: Inset glow
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px rgba(96, 165, 250, 0.6))' }}> {/* ADDED: Svg glow */}
                            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}> {/* LIGHTENED: For clarity */}
                            Upgrade to unlock benefits
                        </span>
                    </div>

                    {/* See Plans Link (Changed from <Link> to safe <a> tag) */}
                    <a href="/dashboard/membership" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: '#e8a020',
                        color: '#000', padding: '11px 22px',
                        fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                        fontWeight: 800, textDecoration: 'none',
                        fontFamily: "'Inter', sans-serif", borderRadius: '6px',
                        boxShadow: '0 0 10px rgba(232, 160, 32, 0.5)' // ADDED: Gold glow on button
                    }}>
                        → SEE PLANS
                    </a>
                </div>

                {/* Stats row with blue glow on section */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px', marginBottom: '16px',
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)', // ADDED: Blue glow to row
                    borderRadius: '12px'
                }}>
                    {[
                        { label: 'LEVEL', value: 'Free', highlight: false },
                        { label: 'BOOKINGS', value: '0', highlight: false },
                        { label: 'ONLINE', value: '253', highlight: true },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: 'linear-gradient(135deg, #0d1e3d 0%, #081220 100%)',
                            border: '1px solid rgba(59,130,246,0.3)', // INCREASED: Border opacity
                            borderRadius: '12px', padding: '16px 10px', textAlign: 'center',
                        }}>
                            <p style={{
                                fontSize: '1.35rem', fontWeight: 800,
                                color: s.highlight ? '#22c55e' : '#f8fafc',
                                fontFamily: "'Inter', sans-serif",
                                marginBottom: '4px',
                                textShadow: s.highlight ? '0 0 10px rgba(34, 197, 94, 0.7)' : '0 0 5px rgba(248, 250, 252, 0.3)' // ADDED: Text glow
                            }}>
                                {s.highlight && <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginRight: 6, boxShadow: '0 0 8px #22c55e' }} />} {/* ADDED: Inner glow */}
                                {s.value}
                            </p>
                            <p style={{
                                fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                                color: '#a0aec0', fontFamily: "'Inter', sans-serif", fontWeight: 600, // LIGHTENED: For readability
                            }}>
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick links buttons with section border glow */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px', marginBottom: '24px',
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)', // ADDED: Blue glow to row
                    borderRadius: '14px'
                }}>
                    {[
                        {
                            to: '/dashboard/models', label: 'MODELS',
                            icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(203, 213, 225, 0.6))' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, // ADDED: Icon glow
                        },
                        {
                            to: '/dashboard/assets', label: 'PLACES',
                            icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(203, 213, 225, 0.6))' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>, // ADDED: Icon glow
                        },
                        {
                            to: '/dashboard/membership', label: 'MEMBERSHIP',
                            icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(203, 213, 225, 0.6))' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" /></svg>, // ADDED: Icon glow
                        },
                    ].map(q => (
                        <a key={q.to} href={q.to} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            gap: '10px', background: 'linear-gradient(135deg, #0d1e3d, #081220)',
                            border: '1px solid rgba(59,130,246,0.35)', // INCREASED: Border opacity
                            borderRadius: '14px',
                            padding: '22px 10px', textDecoration: 'none',
                            color: '#cbd5e1', fontSize: '0.65rem', letterSpacing: '0.12em',
                            textTransform: 'uppercase', fontWeight: 700,
                            fontFamily: "'Inter', sans-serif",
                            boxShadow: 'inset 0 0 10px rgba(59, 130, 246, 0.15)' // ADDED: Subtle inset glow
                        }}>
                            {q.icon}
                            {q.label}
                        </a>
                    ))}
                </div>

                {/* Recent Activity with blue glow */}
                <div style={{
                    background: 'linear-gradient(135deg, #0d1e3d, #081220)',
                    border: '1px solid rgba(59,130,246,0.4)', // INCREASED: Border opacity
                    borderRadius: '14px', padding: '18px', marginBottom: '24px',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.35)' // ADDED: Blue glow
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(96, 165, 250, 0.6))' }}> {/* ADDED: Svg glow */}
                            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
                            Recent Activity
                        </span>
                    </div>
                    <div style={{ textAlign: 'center', padding: '30px 0' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#101e30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}> {/* DARKENED: To make glow stand out more */}
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p style={{ color: '#718096', fontSize: '0.88rem', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}> {/* LIGHTENED: For readability */}
                            No recent activity found.
                        </p>
                    </div>
                </div>

                {/* Featured Profiles Section with glow */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ color: '#e8a020', fontSize: '18px', textShadow: '0 0 10px rgba(232, 160, 32, 0.7)' }}>★</span> {/* ADDED: Star glow */}
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
                            Featured Profiles
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {PROFILES.map(p => (
                            <div key={p.id} style={{
                                flex: '0 0 150px',
                                borderRadius: '12px', overflow: 'hidden',
                                border: '2px solid rgba(59,130,246,0.6)', // INCREASED: Border opacity for glow effect
                                position: 'relative',
                                cursor: 'pointer',
                                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' // ADDED: Profile card glow
                            }}>
                                <img src={p.img} alt={p.name} style={{
                                    width: '100%', height: '190px', objectFit: 'cover', display: 'block',
                                }} />
                                {p.demo && (
                                    <span style={{
                                        position: 'absolute', top: '8px', right: '8px',
                                        background: 'rgba(0,0,0,0.85)', color: '#f8fafc',
                                        fontSize: '0.55rem', letterSpacing: '0.15em',
                                        textTransform: 'uppercase', padding: '4px 8px',
                                        borderRadius: '4px', fontFamily: "'Inter', sans-serif", fontWeight: 800,
                                        boxShadow: '0 0 5px rgba(248, 250, 252, 0.4)' // ADDED: Label glow
                                    }}>
                                        DEMO
                                    </span>
                                )}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    background: 'linear-gradient(transparent, rgba(6,13,26,0.98))',
                                    padding: '30px 12px 12px',
                                }}>
                                    <p style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: '3px' }}>{p.name}</p>
                                    <p style={{ color: '#60a5fa', fontSize: '0.7rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", textShadow: '0 0 5px rgba(96, 165, 250, 0.5)' }}>{p.id}</p> {/* ADDED: Text glow */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Featured Locations Section with glow */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(96, 165, 250, 0.6))' }}> {/* ADDED: Svg glow */}
                            <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
                        </svg>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
                            Featured Locations
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {LOCATIONS.map(loc => (
                            <div key={loc.name} style={{
                                flex: '0 0 220px',
                                borderRadius: '12px', overflow: 'hidden',
                                border: '1px solid rgba(59,130,246,0.5)', // INCREASED: Border opacity for glow
                                position: 'relative', cursor: 'pointer',
                                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' // ADDED: Location card glow
                            }}>
                                <img src={loc.img} alt={loc.name} style={{
                                    width: '100%', height: '160px', objectFit: 'cover', display: 'block',
                                }} />
                                <span style={{
                                    position: 'absolute', top: '8px', right: '8px',
                                    background: 'rgba(6,13,26,0.9)', color: '#22c55e',
                                    fontSize: '0.55rem', letterSpacing: '0.15em',
                                    textTransform: 'uppercase', padding: '4px 10px',
                                    borderRadius: '4px', fontFamily: "'Inter', sans-serif", fontWeight: 800,
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)' // ADDED: Label glow
                                }}>
                                    ● SAFEHOUSE
                                </span>
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    background: 'linear-gradient(transparent, rgba(6,13,26,0.98))',
                                    padding: '32px 14px 14px',
                                }}>
                                    <p style={{ color: '#f8fafc', fontSize: '0.95rem', fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: '5px' }}>{loc.name}</p>
                                    <p style={{ color: '#60a5fa', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", fontWeight: 700, marginBottom: '6px', textShadow: '0 0 5px rgba(96, 165, 250, 0.5)' }}>{loc.tier}</p> {/* ADDED: Text glow */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px rgba(148, 163, 184, 0.5))' }}> {/* ADDED: Svg glow */}
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{loc.city}</span>
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