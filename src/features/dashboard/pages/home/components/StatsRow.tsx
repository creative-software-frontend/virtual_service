import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';


export function StatsRow({
    showOnlineCard,
    onlineCount,
    setOnlineOpen,
    membershipPackage,
    role,
}: {
    showOnlineCard: boolean;
    onlineCount: number;
    setOnlineOpen: (open: boolean) => void;
    membershipPackage?: string;
    role?: string;
}) {
    const navigate = useNavigate();
    const isProvider = role === 'provider';
    const isUser = role === 'user';

    const stats = useMemo(
        () => [
            { label: 'LEVEL', value: membershipPackage || 'Free', highlight: false },
            { label: 'BOOKINGS', value: '0', highlight: false },
            {
                label: 'ONLINE',
                value: showOnlineCard ? String(onlineCount) : '—',
                highlight: true,
            },
        ],
        [showOnlineCard, onlineCount, membershipPackage]
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
                const isBookingsCard = s.label === 'BOOKINGS';
                const clickable = (showOnlineCard && isOnlineCard) || ((isProvider || isUser) && isBookingsCard);
                const bookingsTarget = isProvider ? 'services' : 'bookings';

                return (
                    <div
                        key={s.label}
                        onClick={() => {
                            if (clickable && isOnlineCard) setOnlineOpen(true);
                            else if (clickable && isBookingsCard) navigate(`/${role}/dashboard/${bookingsTarget}`);
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

