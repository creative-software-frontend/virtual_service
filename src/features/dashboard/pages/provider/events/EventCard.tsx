import { formatEventDate, getStatusLabel, getStatusStyle, getCapacityText, isEventFull } from './utils/eventHelpers';
import type { Event } from './types/event';

interface EventCardProps {
    event: Event;
    role: string;
    currentUserId: number;
    actionLoading: number | null;
    onJoin: (id: number) => void;
    onLeave: (id: number) => void;
    onEdit: (event: Event) => void;
    onDelete: (id: number) => void;
    onViewDetails: (event: Event) => void;
}

export function EventCard({
    event,
    role,
    currentUserId,
    actionLoading,
    onJoin,
    onLeave,
    onEdit,
    onDelete,
    onViewDetails
}: EventCardProps) {
    const isCreator = event.creator_id === currentUserId;
    const hasJoined = event.joined === 1;
    const isFull = isEventFull(event.participant_count, event.capacity);
    const isLoading = actionLoading === event.id;

    const statusStyle = getStatusStyle(event.status);

    return (
        <div style={{
            background: 'linear-gradient(135deg,rgba(30,41,59,0.9),rgba(15,23,42,0.9))',
            border: '1px solid rgba(99,102,241,0.18)',
            borderRadius: 14,
            padding: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            transition: 'transform 0.2s, border-color 0.2s',
            cursor: 'pointer'
        }}
        onClick={() => onViewDetails(event)}
        onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
            e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.18)';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                    fontSize: '0.58rem',
                    letterSpacing: '0.08em',
                    background: statusStyle.background,
                    border: statusStyle.border,
                    color: statusStyle.color,
                    padding: '2px 8px',
                    borderRadius: 20,
                    fontWeight: 700,
                    textTransform: 'uppercase'
                }}>
                    {getStatusLabel(event.status)}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {getCapacityText(event.participant_count, event.capacity)}
                </span>
            </div>

            <div>
                <h3 style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.98rem',
                    fontWeight: 800,
                    margin: '0 0 4px 0',
                    fontFamily: "'Inter', sans-serif"
                }}>
                    {event.title}
                </h3>
                {event.description && (
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.82rem',
                        lineHeight: 1.4,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {event.description}
                    </p>
                )}
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                padding: '8px 10px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 8,
                fontSize: '0.76rem',
                color: 'var(--text-secondary)'
            }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span>📅</span>
                    <span>{formatEventDate(event.date_time)}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span>📍</span>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {event.location}
                    </span>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 8,
                    marginTop: 4,
                    flexWrap: 'wrap'
                }}
                onClick={e => e.stopPropagation()} // prevent triggering modal open
            >
                {role === 'provider' && isCreator ? (
                    <>
                        <button
                            onClick={() => onEdit(event)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8,
                                color: 'var(--text-primary)',
                                padding: '6px 12px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(event.id)}
                            disabled={isLoading}
                            style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: 8,
                                color: '#f87171',
                                padding: '6px 12px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                cursor: isLoading ? 'wait' : 'pointer'
                            }}
                        >
                            Delete
                        </button>
                    </>
                ) : role === 'user' ? (
                    event.status === 'active' && (
                        hasJoined ? (
                            <button
                                onClick={() => onLeave(event.id)}
                                disabled={isLoading}
                                style={{
                                    background: 'rgba(239,68,68,0.1)',
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    borderRadius: 8,
                                    color: '#f87171',
                                    padding: '6px 14px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: isLoading ? 'wait' : 'pointer'
                                }}
                            >
                                {isLoading ? 'Leaving...' : 'Leave Event'}
                            </button>
                        ) : (
                            <button
                                onClick={() => onJoin(event.id)}
                                disabled={isLoading || isFull}
                                style={{
                                    background: isFull ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#6366f1,#818cf8)',
                                    border: 'none',
                                    borderRadius: 8,
                                    color: isFull ? 'var(--text-muted)' : '#fff',
                                    padding: '7px 14px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: isLoading || isFull ? 'not-allowed' : 'pointer',
                                    boxShadow: isFull ? 'none' : '0 0 10px rgba(99,102,241,0.3)'
                                }}
                            >
                                {isLoading ? 'Joining...' : isFull ? 'Event Full' : 'Join Event'}
                            </button>
                        )
                    )
                ) : null}

                <button
                    onClick={() => onViewDetails(event)}
                    style={{
                        background: 'rgba(99,102,241,0.1)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        borderRadius: 8,
                        color: '#818cf8',
                        padding: '6px 12px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Details
                </button>
            </div>
        </div>
    );
}
export default EventCard;
