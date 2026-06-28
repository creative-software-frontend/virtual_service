import type { Dispatch, SetStateAction } from 'react';

interface EventFiltersProps {
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    statusFilter: string;
    setStatusFilter: Dispatch<SetStateAction<string>>;
    showCreateButton: boolean;
    onCreateClick: () => void;
}

export function EventFilters({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    showCreateButton,
    onCreateClick
}: EventFiltersProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginBottom: 20
        }}>
            <div style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center'
            }}>
                <div style={{
                    position: 'relative',
                    flex: 1
                }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search events by title or location..."
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(99,102,241,0.2)',
                            borderRadius: 10,
                            color: 'var(--text-primary)',
                            padding: '10px 12px 10px 36px',
                            fontSize: '0.88rem',
                            fontFamily: "'Inter', sans-serif",
                            outline: 'none',
                            transition: 'all 0.2s',
                            boxSizing: 'border-box'
                        }}
                    />
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(99,102,241,0.5)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            position: 'absolute',
                            left: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none'
                        }}
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>

                {showCreateButton && (
                    <button
                        onClick={onCreateClick}
                        style={{
                            background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                            border: 'none',
                            borderRadius: 10,
                            color: '#fff',
                            padding: '10px 16px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            boxShadow: '0 0 14px rgba(99,102,241,0.4)',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Event
                    </button>
                )}
            </div>

            <div style={{
                display: 'flex',
                gap: 6,
                overflowX: 'auto',
                paddingBottom: 4
            }}>
                {['all', 'active', 'completed', 'cancelled'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        style={{
                            background: statusFilter === status ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
                            border: statusFilter === status ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.05)',
                            borderRadius: 20,
                            color: statusFilter === status ? '#818cf8' : 'var(--text-secondary)',
                            padding: '6px 14px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>
    );
}
export default EventFilters;
