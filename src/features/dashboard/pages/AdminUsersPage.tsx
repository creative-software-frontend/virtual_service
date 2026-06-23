import { useEffect, useState } from 'react';
import { TopNav } from './TopNav';
import { adminApi } from '../../../utils/api';

interface UserInfo {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    is_active: number;
    created_at: string;
}

interface Summary {
    totalUsers: number;
    totalProviders: number;
    users: UserInfo[];
    providers: UserInfo[];
}

export function AdminUsersPage() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'users' | 'providers'>('users');

    const fetchSummary = async () => {
        setLoading(true);
        const res = await adminApi.getUsersSummary();
        if (res.error) {
            setError(res.error);
        } else {
            setSummary(res.data || null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    const handleToggleActive = async (id: number, currentStatus: number) => {
        const action = currentStatus === 1 ? 'block' : 'unblock';
        if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;

        try {
            const res = await adminApi.toggleUserActive(id);
            if (res.error) {
                alert(res.error);
            } else {
                // Refresh summary from the server to get precise updated counts and state
                await fetchSummary();
            }
        } catch (err: any) {
            alert(err.message || 'Failed to update account status');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-main)',
            width: '100%',
            color: 'var(--text-primary)'
        }}>
            <TopNav />

            <div style={{
                padding: 'clamp(90px, 22vw, 108px) clamp(12px, 4vw, 16px) clamp(32px, 8vw, 80px)',
                width: '100%',
                boxSizing: 'border-box',
            }}>

                {/* ── Page Title ── */}
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 'clamp(1.1rem, 5vw, 1.4rem)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '4px'
                    }}>
                        User Management
                    </h2>
                    <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        Overview of all registered users and providers
                    </p>
                </div>

                {/* ── Loading ── */}
                {loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 0',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        Loading...
                    </div>
                )}

                {/* ── Error ── */}
                {error && (
                    <div style={{
                        padding: '12px 16px',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        color: '#fca5a5',
                        fontSize: '0.85rem',
                        marginBottom: '20px'
                    }}>
                        {error}
                    </div>
                )}

                {summary && (
                    <>
                        {/* ── Stats Cards ── */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 'clamp(10px, 3vw, 16px)',
                            marginBottom: '24px'
                        }}>
                            {/* Total Users Card */}
                            <div style={{
                                background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '14px',
                                padding: 'clamp(16px, 4vw, 24px)',
                                textAlign: 'center',
                                boxShadow: 'var(--shadow-blue)'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '6px' }}>👤</div>
                                <p style={{
                                    fontSize: 'clamp(1.8rem, 8vw, 2.5rem)',
                                    fontWeight: 800,
                                    color: 'var(--blue-vivid)',
                                    fontFamily: "'Inter', sans-serif",
                                    marginBottom: '4px'
                                }}>
                                    {summary.totalUsers}
                                </p>
                                <p style={{
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-muted)',
                                    fontWeight: 700
                                }}>
                                    Total Users
                                </p>
                            </div>

                            {/* Total Providers Card */}
                            <div style={{
                                background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '14px',
                                padding: 'clamp(16px, 4vw, 24px)',
                                textAlign: 'center',
                                boxShadow: '0 0 30px rgba(52, 211, 153, 0.15)'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '6px' }}>🏢</div>
                                <p style={{
                                    fontSize: 'clamp(1.8rem, 8vw, 2.5rem)',
                                    fontWeight: 800,
                                    color: '#34d399',
                                    fontFamily: "'Inter', sans-serif",
                                    marginBottom: '4px'
                                }}>
                                    {summary.totalProviders}
                                </p>
                                <p style={{
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-muted)',
                                    fontWeight: 700
                                }}>
                                    Total Providers
                                </p>
                            </div>
                        </div>

                        {/* ── Tabs ── */}
                        <div style={{
                            display: 'flex',
                            background: 'var(--bg-nav)',
                            borderRadius: '8px',
                            padding: '4px',
                            border: '1px solid var(--border-subtle)',
                            marginBottom: '20px'
                        }}>
                            <button
                                onClick={() => setActiveTab('users')}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.65rem',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    fontWeight: 700,
                                    fontFamily: "'Inter', sans-serif",
                                    cursor: 'pointer',
                                    background: activeTab === 'users' ? 'var(--blue-glow)' : 'transparent',
                                    color: activeTab === 'users' ? 'var(--text-primary)' : 'var(--text-muted)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                👤 Users ({summary.totalUsers})
                            </button>
                            <button
                                onClick={() => setActiveTab('providers')}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.65rem',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    fontWeight: 700,
                                    fontFamily: "'Inter', sans-serif",
                                    cursor: 'pointer',
                                    background: activeTab === 'providers' ? 'rgba(52,211,153,0.1)' : 'transparent',
                                    color: activeTab === 'providers' ? '#34d399' : 'var(--text-muted)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                🏢 Providers ({summary.totalProviders})
                            </button>
                        </div>

                        {/* ── List ── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {(activeTab === 'users' ? summary.users : summary.providers).length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.9rem'
                                }}>
                                    No {activeTab} found
                                </div>
                            ) : (
                                (activeTab === 'users' ? summary.users : summary.providers).map((person) => (
                                    <div key={person.id} style={{
                                        background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                                        border: '1px solid var(--border-subtle)',
                                        borderRadius: '12px',
                                        padding: 'clamp(12px, 3vw, 16px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        {/* Avatar */}
                                        <div style={{
                                            width: '42px',
                                            height: '42px',
                                            borderRadius: '50%',
                                            background: activeTab === 'users'
                                                ? 'linear-gradient(135deg, var(--blue-neon), var(--blue-vivid))'
                                                : 'linear-gradient(135deg, #059669, #34d399)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontWeight: 700,
                                            fontSize: '1rem',
                                            flexShrink: 0
                                        }}>
                                            {person.name.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{
                                                fontWeight: 700,
                                                fontSize: '0.9rem',
                                                color: 'var(--text-primary)',
                                                fontFamily: "'Inter', sans-serif",
                                                marginBottom: '2px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {person.name}
                                            </p>
                                            <p style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-muted)',
                                                fontFamily: "'Inter', sans-serif",
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                marginBottom: '2px'
                                            }}>
                                                {person.email}
                                            </p>
                                            <p style={{
                                                fontSize: '0.7rem',
                                                color: 'var(--text-muted)',
                                                fontFamily: "'Inter', sans-serif"
                                            }}>
                                                📱 {person.phone} · Joined {new Date(person.created_at).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Status Badge */}
                                        <div style={{
                                            flexShrink: 0,
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            fontWeight: 700,
                                            background: person.is_active
                                                ? 'rgba(16,185,129,0.1)'
                                                : 'rgba(239,68,68,0.1)',
                                            color: person.is_active
                                                ? 'var(--green-status)'
                                                : 'var(--red-status)',
                                            border: `1px solid ${person.is_active ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`
                                        }}>
                                            {person.is_active ? '● Active' : '● Blocked'}
                                        </div>

                                        {/* Block / Unblock Action Button */}
                                        <button
                                            onClick={() => handleToggleActive(person.id, person.is_active)}
                                            style={{
                                                flexShrink: 0,
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                fontSize: '0.6rem',
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                background: person.is_active ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                                                color: person.is_active ? 'var(--red-status)' : 'var(--green-status)',
                                                border: `1px solid ${person.is_active ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                                                fontFamily: "'Inter', sans-serif",
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.filter = 'brightness(1.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.filter = 'none';
                                            }}
                                        >
                                            {person.is_active ? 'Block' : 'Unblock'}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}