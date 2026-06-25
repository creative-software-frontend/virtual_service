import { useMemo } from 'react';


export function StatsRow({
    showOnlineCard,
    onlineCount,
    setOnlineOpen,
}: {
    showOnlineCard: boolean;
    onlineCount: number;
    setOnlineOpen: (open: boolean) => void;
}) {
    const stats = useMemo(
        () => [
            { label: 'LEVEL', value: 'Free', highlight: false },
            { label: 'BOOKINGS', value: '0', highlight: false },
            {
                label: 'ONLINE',
                value: showOnlineCard ? String(onlineCount) : '—',
                highlight: true,
            },
        ],
        [showOnlineCard, onlineCount]
    );

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'clamp(6px, 2vw, 10px)',
                marginBottom: '14px',
                boxShadow: '0 0 15px rgba(59,130,246,0.3)',
                borderRadius: '12px',
            }}
        >
            {stats.map((s) => {
                const isOnlineCard = s.label === 'ONLINE';
                const clickable = showOnlineCard && isOnlineCard;

                return (
                    <div
                        key={s.label}
                        onClick={() => {
                            if (clickable) setOnlineOpen(true);
                        }}
                        style={{
                            background: 'linear-gradient(135deg, var(--bg-card-hover) 0%, var(--bg-card) 100%)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            padding: 'clamp(12px, 3.5vw, 16px) clamp(6px, 2vw, 10px)',
                            textAlign: 'center',
                            cursor: clickable ? 'pointer' : 'default',
                        }}
                    >
                        <p
                            style={{
                                fontSize: 'clamp(1rem, 5vw, 1.35rem)',
                                fontWeight: 800,
                                color: s.highlight ? 'var(--green-status)' : 'var(--text-primary)',
                                fontFamily: "'Inter', sans-serif",
                                marginBottom: '4px',
                                textShadow: s.highlight
                                    ? '0 0 10px rgba(34,197,94,0.7)'
                                    : '0 0 5px rgba(248,250,252,0.3)',
                                userSelect: 'none',
                            }}
                        >
                            {s.highlight && (
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: 7,
                                        height: 7,
                                        borderRadius: '50%',
                                        background: 'var(--green-status)',
                                        marginRight: 5,
                                        boxShadow: '0 0 8px var(--green-status)',
                                    }}
                                />
                            )}
                            {s.value}
                        </p>
                        <p
                            style={{
                                fontSize: 'clamp(0.5rem, 1.8vw, 0.6rem)',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: 'var(--text-secondary)',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                                userSelect: 'none',
                            }}
                        >
                            {s.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

