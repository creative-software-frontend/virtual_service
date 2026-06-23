import { useAuth } from "../../../context/AuthContext";
import { TopNav } from "./TopNav";

export function AssetsPage() {
    const { user } = useAuth();
    const role = user?.role;

    const depositLabel = role === 'user' ? 'DEPOSIT' : 'ALLOCATE';
    const depositSub = role === 'user' ? 'Deposit funds to wallet' : 'Deposit funds to wallet';
    const withdrawLabel = role === 'user' ? 'WITHDRAW' : 'LIQUIDATE';
    const withdrawSub = role === 'user' ? 'Withdraw your earnings' : 'Withdraw your earnings';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', width: '100%', color: 'var(--text-primary)' }}>
            {/* Top Navigation Bar */}
            <TopNav />

            {/* Main Content Layout Container */}
            <div style={{
                maxWidth: '2400px',
                margin: '0 auto',
                width: '100%',
                padding: '120px 16px 48px 16px',
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
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                        gap: '24px',
                        width: '100%',
                        alignItems: 'stretch'
                    }}>

                        {/* Column 1: Total Liquid Assets Component Module */}
                        <div style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '16px',
                            padding: '48px 24px',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <p style={{
                                fontSize: '0.65rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: 'var(--text-secondary)',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                marginBottom: '16px',
                            }}>
                                TOTAL LIQUID ASSETS
                            </p>
                            <p style={{
                                fontSize: '3.5rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                fontFamily: "'Inter', sans-serif",
                                letterSpacing: '-0.02em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                textShadow: '0 0 30px rgba(255, 255, 255, 0.15)'
                            }}>
                                <span style={{ fontWeight: 400, color: 'var(--text-primary)' }}>৳</span> 0.00
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
                                    label: depositLabel,
                                    sub: depositSub,
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                                        </svg>
                                    ),
                                },
                                {
                                    label: withdrawLabel,
                                    sub: withdrawSub,
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                                        </svg>
                                    ),
                                },
                            ].map(btn => (
                                <button key={btn.label} style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-subtle)',
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
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'var(--blue-neon)';
                                        e.currentTarget.style.boxShadow = '0 0 20px var(--blue-glow)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
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
                                        color: 'var(--text-primary)',
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 700,
                                    }}>{btn.label}</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)',
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
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '16px',
                        padding: '32px 24px',
                        width: '100%',
                        boxSizing: 'border-box',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                                <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
                                <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                            </svg>
                            <span style={{
                                fontSize: '1.1rem',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
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
                                color: 'var(--text-primary)',
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