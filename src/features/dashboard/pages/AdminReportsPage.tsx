import { useEffect, useState, useMemo } from 'react';
import { adminApi } from '../../../utils/api';
import type { ReportsData } from '../../../utils/api';

const fmt = (n: number) =>
    '৳ ' + Number(n).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const typeLabel: Record<string, { label: string; color: string; bg: string }> = {
        deposit: { label: 'Deposit', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
        withdraw: { label: 'Withdraw', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
        earning: { label: 'Earning', color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
    };

    const Icon = ({
        children,
        color = 'currentColor',
    }: {
        children: React.ReactNode;
        color?: string;
    }) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color }}>
            {children}
        </span>
    );

    const Svg = ({ children }: { children: React.ReactNode }) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {children}
        </svg>
    );

    const icons = {
        report: (
            <Icon>
                <Svg>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6 17V7a2 2 0 0 1 2-2h8l4 4v8" />
                    <path d="M8 21v-4" />
                    <path d="M12 21v-8" />
                    <path d="M16 21v-6" />
                </Svg>
            </Icon>
        ),
        deposit: (
            <Icon>
                <Svg>
                    <path d="M12 2v20" />
                    <path d="M17 7l-5-5-5 5" />
                    <path d="M5 22h14" />
                </Svg>
            </Icon>
        ),
        withdraw: (
            <Icon>
                <Svg>
                    <path d="M12 2v20" />
                    <path d="M17 17l-5 5-5-5" />
                    <path d="M5 2h14" />
                </Svg>
            </Icon>
        ),
        earning: (
            <Icon>
                <Svg>
                    <path d="M12 1v22" />
                    <path d="M17 5l-5-4-5 4" />
                    <path d="M7 9h10" />
                    <path d="M7 15h10" />
                    <path d="M7 21h10" />
                </Svg>
            </Icon>
        ),
        wallet: (
            <Icon>
                <Svg>
                    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
                    <path d="M16 12h6" />
                    <circle cx="16.5" cy="12" r="1.5" />
                </Svg>
            </Icon>
        ),
        user: (
            <Icon>
                <Svg>
                    <path d="M20 21a8 8 0 0 0-16 0" />
                    <circle cx="12" cy="8" r="4" />
                </Svg>
            </Icon>
        ),
        provider: (
            <Icon>
                <Svg>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6" />
                    <path d="M23 11h-6" />
                </Svg>
            </Icon>
        ),
        topDepositors: (
            <Icon>
                <Svg>
                    <path d="M12 2l9 4-9 4-9-4 9-4Z" />
                    <path d="M3 10l9 4 9-4" />
                    <path d="M3 14l9 4 9-4" />
                </Svg>
            </Icon>
        ),
        topEarners: (
            <Icon>
                <Svg>
                    <path d="M12 17.3l-6.18 3.25L7 13l-4-3.94L9.5 8 12 2l2.5 6 6.5 1.06L17 13l1.18 7.55L12 17.3Z" />
                </Svg>
            </Icon>
        ),
        ledger: (
            <Icon>
                <Svg>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6 17V7a2 2 0 0 1 2-2h8l4 4v8" />
                </Svg>
            </Icon>
        ),
    };

const PAGE_SIZE = 20;

export default function AdminReportsPage() {
    const [data, setData] = useState<ReportsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ledgerFilter, setLedgerFilter] = useState<'all' | 'deposit' | 'withdraw' | 'earning'>('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        (async () => {
            try {
                const res = await adminApi.getReports();
                if ('error' in res && res.error) {
                    throw new Error(res.error);
                }
                setData(res.data ?? null);
            } catch (e: any) {
                setError(e?.message || 'Failed to load reports');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filteredLedger = useMemo(() => {
        const ledger = data?.ledger ?? [];
        return ledger.filter(e => {
            const matchType = ledgerFilter === 'all' || e.type === ledgerFilter;
            const q = search.trim().toLowerCase();
            const matchSearch =
                q === '' ||
                e.user_name.toLowerCase().includes(q) ||
                e.user_role.toLowerCase().includes(q) ||
                e.description?.toLowerCase().includes(q);
            return matchType && matchSearch;
        });
    }, [data, ledgerFilter, search]);

    const totalPages = Math.ceil(filteredLedger.length / PAGE_SIZE);
    const pagedLedger = filteredLedger.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleFilterChange = (f: typeof ledgerFilter) => {
        setLedgerFilter(f);
        setPage(1);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
                <div className="spinner" style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #f59e0b', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: 'var(--text-muted)' }}>Loading Reports…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: 32, textAlign: 'center', color: '#f87171' }}>
                <p>⚠ {error}</p>
            </div>
        );
    }

    const s = data?.stats ?? {
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalEarnings: 0,
        netHoldings: 0,
        totalUsers: 0,
        totalProviders: 0,
    };

    return (
        <div style={{ padding: '24px 16px 100px', maxWidth: 900, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(245,158,11,0.35)' }}>
                    {icons.report}
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Platform Reports</h1>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Live financial overview &amp; audit ledger</p>
                </div>
            </div>

            {/* Summary Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14, marginBottom: 28 }}>
                {[
                    { label: 'Total Deposits', value: fmt(s.totalDeposits), color: '#22c55e', icon: icons.deposit },
                    { label: 'Total Withdrawals', value: fmt(s.totalWithdrawals), color: '#f87171', icon: icons.withdraw },
                    { label: 'Total Earnings', value: fmt(s.totalEarnings), color: '#818cf8', icon: icons.earning },
                    { label: 'Net Holdings', value: fmt(s.netHoldings), color: '#38bdf8', icon: icons.wallet },
                    { label: 'Total Users', value: s.totalUsers.toString(), color: '#a3e635', icon: icons.user },
                    { label: 'Total Providers', value: s.totalProviders.toString(), color: '#fb923c', icon: icons.provider },
                ].map(card => (
                    <div key={card.label} style={{
                        background: 'var(--card-bg, rgba(30,30,50,0.85))',
                        borderRadius: 14,
                        padding: '16px 14px',
                        border: '1px solid rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                    }}>
                        <div style={{ fontSize: 22, marginBottom: 8, color: card.color }}>{card.icon}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>{card.label}</div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: card.color, letterSpacing: '-0.3px' }}>{card.value}</div>
                    </div>
                ))}
            </div>

            {/* Leaderboard Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>

                {/* Top Depositors */}
                <div style={{ background: 'var(--card-bg, rgba(30,30,50,0.85))', borderRadius: 14, padding: '18px 16px', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
                    <h2 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {icons.topDepositors} <span style={{ marginLeft: 8 }}>Top Depositors</span>
                    </h2>
                    {data!.topDepositors.length === 0
                        ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No data yet</p>
                        : data!.topDepositors.map((u, i) => (
                            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < data!.topDepositors.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                <div style={{ width: 26, height: 26, borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg,#fbbf24,#d97706)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: i === 0 ? '#1a1a1a' : 'var(--text-muted)', flexShrink: 0 }}>
                                    {i + 1}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{u.role}</div>
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', flexShrink: 0 }}>{fmt(u.total_deposited ?? 0)}</div>
                            </div>
                        ))
                    }
                </div>

                {/* Top Earners */}
                <div style={{ background: 'var(--card-bg, rgba(30,30,50,0.85))', borderRadius: 14, padding: '18px 16px', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
                    <h2 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {icons.topEarners} <span style={{ marginLeft: 8 }}>Top Earners</span>
                    </h2>
                    {data!.topEarners.length === 0
                        ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No data yet</p>
                        : data!.topEarners.map((u, i) => (
                            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < data!.topEarners.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                <div style={{ width: 26, height: 26, borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg,#818cf8,#6366f1)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: i === 0 ? '#fff' : 'var(--text-muted)', flexShrink: 0 }}>
                                    {i + 1}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{u.role}</div>
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#818cf8', flexShrink: 0 }}>{fmt(u.total_earned ?? 0)}</div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Global Ledger */}
            <div style={{ background: 'var(--card-bg, rgba(30,30,50,0.85))', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
                {/* Ledger Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 160 }}>
                        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            {icons.ledger} <span>Global Ledger</span>
                        </h2>
                        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{filteredLedger.length} transactions</p>
                    </div>

                    {/* Search */}
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search user, role, note…"
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 8,
                            color: 'var(--text-primary)',
                            fontSize: 13,
                            padding: '7px 12px',
                            outline: 'none',
                            width: 180,
                        }}
                    />

                    {/* Type Filter Tabs */}
                    <div style={{ display: 'flex', gap: 6 }}>
                        {(['all', 'deposit', 'withdraw', 'earning'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => handleFilterChange(f)}
                                style={{
                                    border: 'none',
                                    borderRadius: 8,
                                    padding: '6px 12px',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: ledgerFilter === f ? '#f59e0b' : 'rgba(255,255,255,0.07)',
                                    color: ledgerFilter === f ? '#1a1a1a' : 'var(--text-muted)',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                                {['#', 'User', 'Role', 'Type', 'Amount', 'Status', 'Note', 'Date'].map(h => (
                                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pagedLedger.length === 0
                                ? (
                                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No transactions found</td></tr>
                                )
                                : pagedLedger.map((e, idx) => {
                                    const typeInfo = typeLabel[e.type] ?? { label: e.type, color: '#888', bg: 'transparent' };
                                    const globalIdx = (page - 1) * PAGE_SIZE + idx + 1;
                                    return (
                                        <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                            onMouseEnter={ev => (ev.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                                            onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}
                                        >
                                            <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 11 }}>{globalIdx}</td>
                                            <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{e.user_name}</td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: e.user_role === 'admin' ? 'rgba(245,158,11,0.15)' : e.user_role === 'provider' ? 'rgba(129,140,248,0.15)' : 'rgba(34,197,94,0.12)', color: e.user_role === 'admin' ? '#f59e0b' : e.user_role === 'provider' ? '#818cf8' : '#22c55e', textTransform: 'capitalize' }}>
                                                    {e.user_role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: typeInfo.bg, color: typeInfo.color }}>
                                                    {typeInfo.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 14px', fontWeight: 700, color: typeInfo.color, whiteSpace: 'nowrap' }}>
                                                {e.type === 'withdraw' ? '-' : '+'}{fmt(Number(e.amount))}
                                            </td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: e.status === 'completed' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.12)', color: e.status === 'completed' ? '#22c55e' : '#f59e0b', textTransform: 'capitalize' }}>
                                                    {e.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 14px', color: 'var(--text-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description || '—'}</td>
                                            <td style={{ padding: '10px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: 11 }}>
                                                {new Date(e.created_at).toLocaleString('en-BD', { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '5px 14px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.08)', color: 'var(--text-primary)', cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.4 : 1, fontSize: 13 }}>← Prev</button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '5px 14px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.08)', color: 'var(--text-primary)', cursor: page === totalPages ? 'default' : 'pointer', opacity: page === totalPages ? 0.4 : 1, fontSize: 13 }}>Next →</button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
              input::placeholder { color: rgba(255,255,255,0.3); }
            `}</style>
        </div>
    );
}
