export function FeaturedLocations({
    locations,
    loading,
}: {
    locations: Array<{
        location: string;
        event_count: number;
        next_event: string | null;
    }>;
    loading?: boolean;
}) {
    return (
        <div style={{ paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 5px rgba(96,165,250,0.6))' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                </svg>
                <span style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
                    Featured Locations
                </span>
            </div>
            <div style={{ display: 'flex', gap: 'clamp(10px, 3vw, 14px)', overflowX: 'auto', paddingBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                {loading && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0' }}>
                        Loading locations...
                    </p>
                )}

                {!loading && locations.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0' }}>
                        No event locations available yet.
                    </p>
                )}

                {!loading && locations.map(loc => (
                    <div
                        key={loc.location}
                        style={{
                            flex: '0 0 clamp(180px, 55vw, 220px)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid var(--border-default)',
                            position: 'relative',
                            cursor: 'pointer',
                            boxShadow: '0 0 15px rgba(59,130,246,0.3)',
                        }}
                    >
                        <div style={{
                            width: '100%',
                            height: 'clamp(130px, 40vw, 160px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                            color: 'var(--text-secondary)',
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(96,165,250,0.6))' }}>
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <span style={{
                            position: 'absolute', top: '8px', right: '8px',
                            background: 'var(--bg-overlay)', color: 'var(--green-status)',
                            fontSize: '0.55rem', letterSpacing: '0.15em',
                            textTransform: 'uppercase', padding: '4px 10px',
                            borderRadius: '4px', fontFamily: "'Inter', sans-serif", fontWeight: 800,
                            display: 'flex', alignItems: 'center', gap: '4px',
                            boxShadow: '0 0 8px rgba(34,197,94,0.6)',
                        }}>
                            ● {loc.event_count} EVENT{loc.event_count === 1 ? '' : 'S'}
                        </span>
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'linear-gradient(transparent, var(--bg-nav))',
                            padding: '28px 12px 12px',
                        }}>
                            <p style={{ color: 'var(--text-primary)', fontSize: 'clamp(0.82rem, 3.5vw, 0.95rem)', fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: '4px' }}>{loc.location}</p>
                            <p style={{ color: 'var(--blue-vivid)', fontSize: 'clamp(0.58rem, 2vw, 0.65rem)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", fontWeight: 700, marginBottom: '5px', textShadow: '0 0 5px rgba(96,165,250,0.5)' }}>
                                {loc.next_event ? `NEXT: ${new Date(loc.next_event).toLocaleDateString()}` : 'NO UPCOMING'}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>Event venue</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

