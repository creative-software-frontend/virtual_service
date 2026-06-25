

export function RecentActivityCard() {
    return (
        <div
            style={{
                background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: 'clamp(14px, 4vw, 18px)',
                marginBottom: '20px',
                boxShadow: '0 0 20px rgba(59,130,246,0.35)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--blue-vivid)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, filter: 'drop-shadow(0 0 5px rgba(96,165,250,0.6))' }}
                >
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                <span
                    style={{
                        fontSize: 'clamp(0.85rem, 4vw, 0.95rem)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    Recent Activity
                </span>
            </div>
            <div style={{ textAlign: 'center', padding: '28px 0' }}>
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--bg-input)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginBottom: '12px' }}
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p
                    style={{
                        color: 'var(--text-muted)',
                        fontSize: 'clamp(0.8rem, 3.5vw, 0.88rem)',
                        fontWeight: 500,
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    No recent activity found.
                </p>
            </div>
        </div>
    );
}

