

export function WelcomeCard({
    role,
    user,
}: {
    role: string | undefined;
    user: string;
}) {
    return (
        <div
            style={{
                background: 'linear-gradient(135deg, var(--bg-card-hover) 0%, var(--bg-card) 100%)',
                border: '1px solid var(--border-default)',
                borderRadius: '14px',
                padding: 'clamp(14px, 4vw, 20px)',
                marginBottom: '14px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-blue)',
            }}
        >
            {/* Top accent line */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, var(--blue-vivid), transparent)',
                }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                    <p
                        style={{
                            fontSize: 'clamp(1.1rem, 5vw, 1.35rem)',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: '4px',
                        }}
                    >
                        Welcome, {user}
                    </p>
                    <p
                        style={{
                            fontSize: 'clamp(0.6rem, 2vw, 0.7rem)',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'var(--text-secondary)',
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                        }}
                    >
                        YOUR ACCESS PORTAL
                    </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--blue-vivid)"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0 0 5px rgba(96,165,250,0.7))' }}
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span
                        style={{
                            display: 'block',
                            fontSize: 'clamp(0.55rem, 1.8vw, 0.65rem)',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--blue-vivid)',
                            fontWeight: 700,
                            fontFamily: "'Inter', sans-serif",
                            marginTop: '4px',
                        }}
                    >
                        FREE
                    </span>
                </div>
            </div>

            {/* Upgrade bar */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'var(--blue-glow)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: 'clamp(10px, 3vw, 12px) clamp(10px, 3.5vw, 14px)',
                    marginBottom: '14px',
                    boxShadow: 'inset 0 0 10px rgba(59,130,246,0.2)',
                }}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--blue-vivid)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, filter: 'drop-shadow(0 0 3px rgba(96,165,250,0.6))' }}
                >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span
                    style={{
                        fontSize: 'clamp(0.78rem, 3.5vw, 0.85rem)',
                        color: 'var(--text-primary)',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                    }}
                >
                    Upgrade to unlock benefits
                </span>
            </div>

            {/* CTA button */}
            <a
                href={`/${role}/dashboard/membership`}
                style={{
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
                }}
            >
                → SEE PLANS
            </a>
        </div>
    );
}

