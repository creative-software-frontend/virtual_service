import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BADGE_COLORS = {
    admin: { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', text: '#c084fc', dot: '#a855f7' },
    user: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', text: '#60a5fa', dot: '#3b82f6' },
    provider: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#34d399', dot: '#10b981' },
};

const ROLE_META = {
    admin: {
        label: 'Administrator',
        icon: '🛡️',
        description: 'You have full system access and management privileges.',
        accentColor: '#a855f7',
        gradientFrom: 'rgba(168,85,247,0.15)',
        gradientTo: 'transparent',
    },
    user: {
        label: 'Member',
        icon: '👤',
        description: 'Welcome to your personal dashboard. Manage your account and services here.',
        accentColor: '#3b82f6',
        gradientFrom: 'rgba(59,130,246,0.15)',
        gradientTo: 'transparent',
    },
    provider: {
        label: 'Service Provider',
        icon: '🔧',
        description: 'Manage your services and client interactions from this panel.',
        accentColor: '#10b981',
        gradientFrom: 'rgba(16,185,129,0.15)',
        gradientTo: 'transparent',
    },
};

export function RoleDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const meta = ROLE_META[user.role];
    const badge = BADGE_COLORS[user.role];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Background gradient glow */}
            <div style={{
                position: 'absolute', top: '30%', left: '50%',
                transform: 'translateX(-50%)',
                width: '600px', height: '400px', borderRadius: '50%',
                background: `radial-gradient(ellipse, ${meta.gradientFrom} 0%, ${meta.gradientTo} 70%)`,
                pointerEvents: 'none',
            }} />
            {/* Dot grid */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none',
                backgroundImage: `radial-gradient(circle, ${meta.accentColor} 1px, transparent 1px)`,
                backgroundSize: '36px 36px',
            }} />

            {/* Card */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                background: 'var(--bg-card)',
                border: `1px solid ${badge.border}`,
                borderRadius: '20px',
                padding: '48px 40px',
                boxShadow: `0 0 40px rgba(0,0,0,0.4), 0 0 0 1px ${badge.border}`,
                textAlign: 'center',
            }}>
                {/* Top accent line */}
                <div style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px',
                    background: `linear-gradient(90deg, transparent, ${meta.accentColor}, transparent)`,
                    borderRadius: '0 0 2px 2px',
                }} />

                {/* Icon */}
                <div style={{
                    fontSize: '3.5rem',
                    marginBottom: '20px',
                    lineHeight: 1,
                }}>{meta.icon}</div>

                {/* Role badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '6px 16px',
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    borderRadius: '100px',
                    marginBottom: '28px',
                }}>
                    <span style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: badge.dot,
                        boxShadow: `0 0 6px ${badge.dot}`,
                        flexShrink: 0,
                    }} />
                    <span style={{
                        fontSize: '0.65rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase', fontWeight: 700,
                        color: badge.text,
                    }}>{meta.label}</span>
                </div>

                {/* Greeting */}
                <h2 style={{
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: '0 0 8px',
                    letterSpacing: '-0.02em',
                }}>
                    Welcome back, {user.username}
                </h2>

                <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    margin: '0 0 36px',
                    lineHeight: 1.6,
                }}>{meta.description}</p>

                {/* Info cards */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '36px',
                    textAlign: 'left',
                }}>
                    <InfoRow label="Role" value={meta.label} accent={badge.text} />
                    <InfoRow label="Email" value={user.email} accent={badge.text} />
                    <InfoRow label="Username" value={user.username} accent={badge.text} />
                    <InfoRow label="Session" value="Active" accent="#34d399" />
                </div>

                {/* Logout button */}
                <button
                    id="logout-btn"
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.35)',
                        borderRadius: '10px',
                        color: '#fca5a5',
                        fontSize: '0.7rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)';
                        e.currentTarget.style.color = '#f87171';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)';
                        e.currentTarget.style.color = '#fca5a5';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    🚪 Sign Out
                </button>

                {/* Footer */}
                <p style={{
                    marginTop: '24px',
                    fontSize: '0.55rem', letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                }}>© 2026 BLUEDISE — SECURED PORTAL</p>
            </div>
        </div>
    );
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent: string }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
        }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                {label}
            </span>
            <span style={{ fontSize: '0.85rem', color: accent, fontWeight: 600 }}>
                {value}
            </span>
        </div>
    );
}
