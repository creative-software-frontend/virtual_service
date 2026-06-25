export function FeaturedProfiles({ PROFILES }: { PROFILES: Array<any> }) {

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
                {PROFILES.map(p => (
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
                        <img src={p.img} alt={p.name} style={{ width: '100%', height: 'clamp(150px, 48vw, 190px)', objectFit: 'cover', display: 'block' }} />
                        {p.demo && (
                            <span style={{
                                position: 'absolute', top: '8px', right: '8px',
                                background: 'var(--bg-overlay)', color: 'var(--text-primary)',
                                fontSize: '0.55rem', letterSpacing: '0.15em',
                                textTransform: 'uppercase', padding: '4px 8px',
                                borderRadius: '4px', fontFamily: "'Inter', sans-serif", fontWeight: 800,
                                boxShadow: '0 0 5px rgba(248,250,252,0.4)',
                            }}>
                                DEMO
                            </span>
                        )}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'linear-gradient(transparent, var(--bg-nav))',
                            padding: '28px 10px 10px',
                        }}>
                            <p style={{ color: 'var(--text-primary)', fontSize: 'clamp(0.85rem, 4vw, 1rem)', fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: '3px' }}>{p.name}</p>
                            <p style={{ color: 'var(--blue-vivid)', fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)', fontWeight: 600, fontFamily: "'Inter', sans-serif", textShadow: '0 0 5px rgba(96,165,250,0.5)' }}>{p.id}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

