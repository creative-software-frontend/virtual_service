

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { providerApi } from '../../../../../utils/api';

interface ActivityItem {
    type: 'partner_request' | 'event_join' | 'message';
    id: number;
    status: string;
    created_at: string;
    counterpart_name: string;
    counterpart_avatar: string | null;
    detail: string | null;
}

interface UserActivityItem {
    type: 'event_join' | 'friend_added';
    id: number;
    status: string;
    created_at: string;
    detail: string | null;
    extra: string | null;
    counterpart_name: string;
    counterpart_avatar: string | null;
}

interface RecentEvent {
    id: number;
    title: string;
    description: string | null;
    date_time: string;
    location: string;
    capacity: number;
    status: string;
    created_at: string;
    host_name: string | null;
    entry_fee: number;
}

export function RecentActivityCard({
    role,
    recentEvents = [],
    userActivity = [],
    userActivityLoading = false,
}: {
    role: string | undefined;
    recentEvents?: RecentEvent[];
    userActivity?: UserActivityItem[];
    userActivityLoading?: boolean;
}) {
    const { role: paramRole } = useParams<{ role: string }>();
    const activeRole = role || paramRole;
    const isProvider = activeRole === 'provider';
    const isUser = activeRole === 'user';

    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isProvider) return;

        const load = async () => {
            try {
                setLoading(true);
                const res = await providerApi.getRecentActivity();
                if (!res.error) {
                    // Providers: exclude chat messages from recent activity
                    const filtered = (res.data || []).filter(a => a.type !== 'message');
                    setActivities(filtered);
                }
            } catch {
                // keep empty
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [isProvider]);

    const getActivityText = (a: ActivityItem) => {
        switch (a.type) {
            case 'partner_request':
                return `New partner request from ${a.counterpart_name}`;
            case 'event_join':
                return `${a.counterpart_name} joined "${a.detail || 'your event'}"`;
            case 'message':
                return `Message from ${a.counterpart_name}: ${a.detail ? `"${a.detail.slice(0, 40)}${a.detail.length > 40 ? '...' : ''}"` : ''}`;
            default:
                return '';
        }
    };

    const getUserActivityText = (a: UserActivityItem) => {
        switch (a.type) {
            case 'event_join':
                return `You joined "${a.detail || 'an event'}"`;
            case 'friend_added':
                return `Friend added: ${a.counterpart_name}`;
            default:
                return '';
        }
    };

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

            {loading && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '28px 0', fontSize: '0.85rem' }}>
                    Loading activity...
                </p>
            )}

            {userActivityLoading && isUser && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '28px 0', fontSize: '0.85rem' }}>
                    Loading activity...
                </p>
            )}

            {!loading && !userActivityLoading && activities.length === 0 && recentEvents.length === 0 && userActivity.length === 0 && (
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
            )}

            {!loading && (activities.length > 0 || recentEvents.length > 0 || userActivity.length > 0) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Recent events (provider only) */}
                    {recentEvents.map(ev => (
                        <div
                            key={`event-${ev.id}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                background: 'var(--bg-input)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '10px',
                            }}
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--gold-deep), var(--blue-neon))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                flexShrink: 0,
                            }}>
                                📅
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    fontFamily: "'Inter', sans-serif",
                                    marginBottom: '2px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {ev.title}
                                </p>
                                <p style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.7rem',
                                    fontFamily: "'Inter', sans-serif",
                                }}>
                                    {ev.location} • {new Date(ev.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* User activity (joined events, friends added) */}
                    {userActivity.map(a => (
                        <div
                            key={`user-${a.type}-${a.id}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                background: 'var(--bg-input)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '10px',
                            }}
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: a.type === 'friend_added'
                                    ? 'linear-gradient(135deg, var(--gold-deep), var(--blue-neon))'
                                    : 'linear-gradient(135deg, var(--blue-neon), var(--gold-deep))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                flexShrink: 0,
                            }}>
                                {a.type === 'friend_added' ? '👤' : '📅'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    fontFamily: "'Inter', sans-serif",
                                    marginBottom: '2px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {getUserActivityText(a)}
                                </p>
                                <p style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.7rem',
                                    fontFamily: "'Inter', sans-serif",
                                }}>
                                    {new Date(a.created_at).toLocaleDateString()} {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Activity items (partner requests, event joins, messages) */}
                    {activities.map(a => (
                        <div
                            key={`${a.type}-${a.id}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                background: 'var(--bg-input)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '10px',
                            }}
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--blue-neon), var(--gold-deep))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                flexShrink: 0,
                            }}>
                                {a.counterpart_name ? a.counterpart_name.substring(0, 2).toUpperCase() : '?'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    fontFamily: "'Inter', sans-serif",
                                    marginBottom: '2px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {getActivityText(a)}
                                </p>
                                <p style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.7rem',
                                    fontFamily: "'Inter', sans-serif",
                                }}>
                                    {new Date(a.created_at).toLocaleDateString()} {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

