interface EmptyStateProps {
    message?: string;
}

export function EmptyState({ message = 'No events found.' }: EmptyStateProps) {
    return (
        <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-muted)',
            background: 'linear-gradient(135deg, rgba(11,21,45,0.5), rgba(7,16,32,0.5))',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed var(--gold-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16
        }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold-mid)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p style={{ fontSize: '0.95rem', fontFamily: "'Inter', sans-serif" }}>
                {message}
            </p>
        </div>
    );
}
export default EmptyState;
