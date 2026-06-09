import { TopNav } from "./TopNav";

export function AssetsPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#060d1a', width: '100%', color: '#f1f5f9' }}>
            {/* Top Navigation Bar */}
            <TopNav />

            {/* Main Content Layout Container */}
            <div style={{
                maxWidth: '2400px',
                margin: '0 auto',
                width: '100%',
                padding: '120px 24px 48px 24px',
                boxSizing: 'border-box'
            }}>

                {/* Structural Wrapper Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '24px'
                }}>

                    {/* Upper Row: Clean 2-Column Grid System */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                        gap: '24px',
                        width: '100%',
                        alignItems: 'stretch'
                    }}>

                        {/* Column 1: Total Liquid Assets Component Module */}
                        <div style={{
                            background: '#0a122c',
                            border: '1px solid #132247',
                            borderRadius: '16px',
                            padding: '48px 24px',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                        }}>
                            <p style={{
                                fontSize: '0.65rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: '#94a3b8',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                marginBottom: '16px',
                            }}>
                                TOTAL LIQUID ASSETS
                            </p>
                            <p style={{
                                fontSize: '3.5rem',
                                fontWeight: 700,
                                color: '#ffffff',
                                fontFamily: "'Inter', sans-serif",
                                letterSpacing: '-0.02em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                textShadow: '0 0 30px rgba(255, 255, 255, 0.15)'
                            }}>
                                <span style={{ fontWeight: 400, color: '#ffffff' }}>৳</span> 0.00
                            </p>
                        </div>

                        {/* Column 2: Action Buttons Layout Framework */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '24px',
                            width: '100%'
                        }}>
                            {[
                                {
                                    label: 'ALLOCATE',
                                    sub: 'Deposit funds to wallet',
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'LIQUIDATE',
                                    sub: 'Withdraw your earnings',
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                                        </svg>
                                    ),
                                },
                            ].map(btn => (
                                <button key={btn.label} style={{
                                    background: '#0a122c',
                                    border: '1px solid #132247',
                                    borderRadius: '16px',
                                    padding: '32px 24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease-in-out',
                                    boxSizing: 'border-box',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#2563eb';
                                        e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.15)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = '#132247';
                                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                                        e.currentTarget.style.transform = 'translateY(0px)';
                                    }}
                                >
                                    <div style={{ marginBottom: '4px' }}>
                                        {btn.icon}
                                    </div>
                                    <span style={{
                                        fontSize: '0.85rem',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                        color: '#ffffff',
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 700,
                                    }}>{btn.label}</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: '#64748b',
                                        fontFamily: "'Inter', sans-serif",
                                        textAlign: 'center',
                                        fontWeight: 400
                                    }}>{btn.sub}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lower Area: Full-width ledger history module */}
                    <div style={{
                        background: '#0a122c',
                        border: '1px solid #132247',
                        borderRadius: '16px',
                        padding: '32px 24px',
                        width: '100%',
                        boxSizing: 'border-box',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                                <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
                                <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                            </svg>
                            <span style={{
                                fontSize: '1.1rem',
                                fontWeight: 500,
                                color: '#a2b4d0',
                                fontFamily: "'Inter', sans-serif"
                            }}>
                                Ledger History
                            </span>
                        </div>

                        <div style={{
                            textAlign: 'center',
                            padding: '40px 0 24px 0',
                        }}>
                            <p style={{
                                color: '#ffffff',
                                fontSize: '0.9rem',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                letterSpacing: '0.01em'
                            }}>
                                No ledger records found.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}