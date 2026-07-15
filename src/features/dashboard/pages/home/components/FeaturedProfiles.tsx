export function FeaturedProfiles({
    profiles,
    loading,
}: {
    profiles: Array<{
        id: number;
        name: string;
        avatar_url: string | null;
        profession: string | null;
        location: string | null;
        interests: string | null;
    }>;
    loading?: boolean;
}) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: 'var(--gold-mid)', fontSize: '18px', textShadow: '0 0 10px rgba(232,160,32,0.7)', flexShrink: 0 }}>★</span>
                <span style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
                    Featured Profiles
                </span>
            </div>
            {/* Horizontal scroll — cards sized relative to viewport */}
            <div style={{ display: 'flex', gap: 'clamp(10px, 3vw, 14px)', overflowX: 'auto', paddingBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                {loading && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0' }}>
                        Loading profiles...
                    </p>
                )}

                {!loading && profiles.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0' }}>
                        No member profiles available yet.
                    </p>
                )}

                {!loading && profiles.map(p => (
                    <div
                        key={p.id}
                        style={{
                            flex: '0 0 clamp(120px, 38vw, 150px)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '2px solid var(--blue-vivid)',
                            position: 'relative',
                            cursor: 'pointer',
                            boxShadow: '0 0 15px rgba(59,130,246,0.3)',
                        }}
                    >
                        {p.avatar_url ? (
                            <img src={p.avatar_url} alt={p.name} style={{ width: '100%', height: 'clamp(150px, 48vw, 190px)', objectFit: 'cover', display: 'block' }} />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: 'clamp(150px, 48vw, 190px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                                color: 'var(--text-secondary)',
                                fontSize: '2rem',
                                fontWeight: 700,
                            }}>
                                {p.name ? p.name.substring(0, 2).toUpperCase() : '?'}
                            </div>
                        )}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'linear-gradient(transparent, var(--bg-nav))',
                            padding: '28px 10px 10px',
                        }}>
                            <p style={{ color: 'var(--text-primary)', fontSize: 'clamp(0.85rem, 4vw, 1rem)', fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: '3px' }}>{p.name}</p>
                            <p style={{ color: 'var(--blue-vivid)', fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)', fontWeight: 600, fontFamily: "'Inter', sans-serif", textShadow: '0 0 5px rgba(96,165,250,0.5)' }}>
                                {p.profession || p.location || `#${p.id}`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

