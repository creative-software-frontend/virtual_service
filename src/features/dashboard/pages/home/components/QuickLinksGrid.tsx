export function QuickLinksGrid({ role }: { role: string | undefined }) {
    const isProvider = role === 'provider';

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'clamp(6px, 2vw, 10px)',
                marginBottom: '20px',
                boxShadow: '0 0 15px rgba(59,130,246,0.3)',
                borderRadius: '14px',
            }}
        >
            {[
                {
                    to: isProvider ? `/${role}/dashboard/providers` : `/${role}/dashboard/models`,
                    label: 'MODELS',
                    icon: (
                        <svg
                            width="clamp(22px,6vw,28px)"
                            height="clamp(22px,6vw,28px)"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ filter: 'drop-shadow(0 0 5px rgba(203,213,225,0.6))' }}
                        >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    ),
                },
                {
                    to: isProvider ? `/${role}/dashboard/places` : `/${role}/dashboard/assets`,
                    label: 'PLACES',
                    icon: (
                        <svg
                            width="clamp(22px,6vw,28px)"
                            height="clamp(22px,6vw,28px)"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ filter: 'drop-shadow(0 0 5px rgba(203,213,225,0.6))' }}
                        >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    ),
                },
                {
                    to: `/${role}/dashboard/membership`,
                    label: 'MEMBERSHIP',
                    icon: (
                        <svg
                            width="clamp(22px,6vw,28px)"
                            height="clamp(22px,6vw,28px)"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ filter: 'drop-shadow(0 0 5px rgba(203,213,225,0.6))' }}
                        >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
                        </svg>
                    ),
                },
            ].map((q) => (
                <a
                    key={q.to}
                    href={q.to}
                    style={{
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
                    }}
                >
                    {q.icon}
                    {q.label}
                </a>
            ))}
        </div>
    );
}

