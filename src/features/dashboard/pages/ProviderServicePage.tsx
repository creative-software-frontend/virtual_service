import { EventPage } from './provider/events/EventPage';

export function ProviderServicePage() {
    return (
        <div style={{ background: 'var(--bg-root)', minHeight: '100svh' }}>
            {/* ── Top bar ── */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'linear-gradient(180deg,rgba(10,14,26,0.98) 0%,rgba(10,14,26,0.9) 100%)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(99,102,241,0.2)',
                padding: '14px 16px 14px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 14px rgba(99,102,241,0.5)',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </div>
                    <div>
                        <h1 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 800, fontFamily: "'Inter', sans-serif", margin: 0 }}>
                            Events & Experiences
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                            Exclusive gatherings & bookings
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Page content ── */}
            <div style={{ padding: '16px 14px 100px' }}>
                <EventPage />
            </div>
        </div>
    );
}

export default ProviderServicePage;
