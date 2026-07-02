import { useEffect, useState, useMemo } from 'react';
import { adminApi } from '../../../utils/api';
import type { ReportsData } from '../../../utils/api';
import { motion } from 'framer-motion';

const fmt = (n: number) =>
    '৳ ' + Number(n).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const typeLabel: Record<string, { label: string; color: string; bg: string }> = {
    deposit: { label: 'Deposit', color: 'var(--green-status)', bg: 'rgba(16,185,129,0.1)' },
    withdraw: { label: 'Withdraw', color: 'var(--gold-mid)', bg: 'rgba(197,168,128,0.1)' },
    earning: { label: 'Earning', color: 'var(--blue-vivid)', bg: 'rgba(59,130,246,0.1)' },
    event_payment: { label: 'Event Payment', color: 'var(--red-status)', bg: 'rgba(239,68,68,0.1)' },
    event_income: { label: 'Event Income', color: 'var(--blue-vivid)', bg: 'rgba(59,130,246,0.1)' },
};

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const containerAnim = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const Icon = ({ children, color = 'currentColor' }: { children: React.ReactNode; color?: string; }) => (
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

type PendingWalletRequest = {
    id: number;
    user_id: number;
    amount: number;
    method: string;
    trx_id?: string;
    screenshot_url?: string;
    account_number?: string;
    status: string;
    created_at: string;
    user_name?: string;
    user_email?: string;
};

export default function AdminReportsPage() {
    const [data, setData] = useState<ReportsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ledgerFilter, setLedgerFilter] = useState<'all' | 'deposit' | 'withdraw' | 'earning' | 'event_payment' | 'event_income'>('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pendingRequests, setPendingRequests] = useState<{ deposits: PendingWalletRequest[]; withdrawals: PendingWalletRequest[] }>({ deposits: [], withdrawals: [] });
    const [pendingLoading, setPendingLoading] = useState(false);
    const [pendingMessage, setPendingMessage] = useState('');

    const loadPendingRequests = async () => {
        setPendingLoading(true);
        setPendingMessage('');
        try {
            const res = await adminApi.getPendingWalletRequests();
            if (res.error) {
                throw new Error(res.error);
            }
            setPendingRequests(res.data ?? { deposits: [], withdrawals: [] });
        } catch (e: any) {
            setPendingMessage(e?.message || 'Failed to load pending requests');
        } finally {
            setPendingLoading(false);
        }
    };

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
        loadPendingRequests();
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

    const handlePendingAction = async (type: 'deposit' | 'withdraw', id: number, action: 'approve' | 'reject') => {
        setPendingMessage('');
        try {
            const res = action === 'approve'
                ? (type === 'deposit' ? await adminApi.approveDepositRequest(id) : await adminApi.approveWithdrawRequest(id))
                : (type === 'deposit' ? await adminApi.rejectDepositRequest(id) : await adminApi.rejectWithdrawRequest(id));

            if (res.error) {
                throw new Error(res.error);
            }
            setPendingMessage(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} ${action === 'approve' ? 'approved' : 'rejected'}.`);
            await loadPendingRequests();
        } catch (e: any) {
            setPendingMessage(e?.message || 'Action failed');
        }
    };

    const handleFilterChange = (f: typeof ledgerFilter) => {
        setLedgerFilter(f);
        setPage(1);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="spinner" style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border-subtle)', borderTop: '3px solid var(--gold-mid)', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: 'var(--text-muted)' }}>Loading Reports…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--red-status)' }}>
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
        <motion.div initial="hidden" animate="visible" variants={containerAnim} className="container" style={{ paddingBottom: '100px', paddingTop: '108px' }}>
            
            {/* Header */}
            <motion.div variants={fadeUp} style={{ marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--gold-deep), var(--gold-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-gold)' }}>
                    {icons.report}
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Platform Reports</h1>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Live financial overview &amp; audit ledger</p>
                </div>
            </motion.div>

            {/* Summary Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                {[
                    { label: 'Total Deposits', value: fmt(s.totalDeposits), color: 'var(--green-status)', icon: icons.deposit },
                    { label: 'Total Withdrawals', value: fmt(s.totalWithdrawals), color: 'var(--red-status)', icon: icons.withdraw },
                    { label: 'Total Earnings', value: fmt(s.totalEarnings), color: 'var(--blue-vivid)', icon: icons.earning },
                    { label: 'Net Holdings', value: fmt(s.netHoldings), color: 'var(--gold-mid)', icon: icons.wallet },
                    { label: 'Total Users', value: s.totalUsers.toString(), color: 'var(--text-primary)', icon: icons.user },
                    { label: 'Total Providers', value: s.totalProviders.toString(), color: 'var(--text-primary)', icon: icons.provider },
                ].map(card => (
                    <motion.div variants={fadeUp} key={card.label} className="card" style={{ padding: 'var(--space-5) var(--space-4)' }}>
                        <div style={{ fontSize: '1.75rem', marginBottom: 'var(--space-2)', color: card.color }}>{card.icon}</div>
                        <div className="eyebrow" style={{ marginBottom: 'var(--space-1)' }}>{card.label}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: card.color }}>{card.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Pending Requests */}
            <motion.div variants={fadeUp} className="card" style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Pending Wallet Requests</h2>
                    {pendingLoading ? <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Loading…</span> : null}
                </div>
                {pendingMessage ? <div style={{ marginBottom: 'var(--space-3)', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{pendingMessage}</div> : null}
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                    {pendingRequests.deposits.length === 0 && pendingRequests.withdrawals.length === 0 ? (
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>No pending deposit or withdrawal requests.</p>
                    ) : null}
                    
                    {pendingRequests.deposits.map((req) => (
                        <div key={`deposit-${req.id}`} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', background: 'var(--bg-input)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Deposit • {req.user_name || 'User'}</strong>
                                <span style={{ color: 'var(--green-status)', fontWeight: 600 }}>৳ {Number(req.amount).toFixed(2)}</span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 'var(--space-1)' }}>{req.method} • {req.trx_id}</div>
                            {req.screenshot_url ? <a href={req.screenshot_url} target="_blank" rel="noreferrer" style={{ color: 'var(--blue-vivid)', fontSize: '0.75rem', display: 'inline-block', marginBottom: 'var(--space-2)' }}>View screenshot</a> : null}
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--green-status)', border: '1px solid rgba(16,185,129,0.3)' }} onClick={() => handlePendingAction('deposit', req.id, 'approve')}>Approve</button>
                                <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red-status)', border: '1px solid rgba(239,68,68,0.3)' }} onClick={() => handlePendingAction('deposit', req.id, 'reject')}>Reject</button>
                            </div>
                        </div>
                    ))}
                    
                    {pendingRequests.withdrawals.map((req) => (
                        <div key={`withdraw-${req.id}`} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', background: 'var(--bg-input)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Withdraw • {req.user_name || 'User'}</strong>
                                <span style={{ color: 'var(--gold-mid)', fontWeight: 600 }}>৳ {Number(req.amount).toFixed(2)}</span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 'var(--space-1)' }}>{req.method} • {req.account_number}</div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--green-status)', border: '1px solid rgba(16,185,129,0.3)' }} onClick={() => handlePendingAction('withdraw', req.id, 'approve')}>Approve</button>
                                <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red-status)', border: '1px solid rgba(239,68,68,0.3)' }} onClick={() => handlePendingAction('withdraw', req.id, 'reject')}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Leaderboard Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                {/* Top Depositors */}
                <motion.div variants={fadeUp} className="card" style={{ padding: 'var(--space-6)' }}>
                    <h2 style={{ margin: '0 0 var(--space-4)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ color: 'var(--gold-mid)' }}>{icons.topDepositors}</span> <span>Top Depositors</span>
                    </h2>
                    {data!.topDepositors.length === 0
                        ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data yet</p>
                        : <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {data!.topDepositors.map((u, i) => (
                                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2)', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg, var(--gold-deep), var(--gold-light))' : 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: i === 0 ? '#1a1a1a' : 'var(--text-muted)', flexShrink: 0 }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{u.role}</div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--green-status)', flexShrink: 0 }}>{fmt(u.total_deposited ?? 0)}</div>
                                </div>
                            ))}
                        </div>
                    }
                </motion.div>

                {/* Top Earners */}
                <motion.div variants={fadeUp} className="card" style={{ padding: 'var(--space-6)' }}>
                    <h2 style={{ margin: '0 0 var(--space-4)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ color: 'var(--blue-vivid)' }}>{icons.topEarners}</span> <span>Top Earners</span>
                    </h2>
                    {data!.topEarners.length === 0
                        ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data yet</p>
                        : <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {data!.topEarners.map((u, i) => (
                                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2)', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg, var(--blue-dim), var(--blue-vivid))' : 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{u.role}</div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--blue-vivid)', flexShrink: 0 }}>{fmt(u.total_earned ?? 0)}</div>
                                </div>
                            ))}
                        </div>
                    }
                </motion.div>
            </div>

            {/* Global Ledger */}
            <motion.div variants={fadeUp} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Ledger Header */}
                <div style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                    <div style={{ flex: 1, minWidth: 160 }}>
                        <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span style={{ color: 'var(--gold-mid)' }}>{icons.ledger}</span> <span>Global Ledger</span>
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{filteredLedger.length} transactions</p>
                    </div>

                    {/* Search */}
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search user, role, note…"
                        style={{
                            maxWidth: 220,
                        }}
                    />

                    {/* Type Filter Tabs */}
                    <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                        {(['all', 'deposit', 'withdraw', 'earning', 'event_payment', 'event_income'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => handleFilterChange(f)}
                                className={`badge ${ledgerFilter === f ? 'badge-gold' : ''}`}
                                style={{
                                    border: ledgerFilter === f ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                                    background: ledgerFilter === f ? 'var(--gold-glow)' : 'transparent',
                                    color: ledgerFilter === f ? 'var(--gold-mid)' : 'var(--text-muted)',
                                    cursor: 'pointer'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-subtle)' }}>
                                {['#', 'User', 'Role', 'Type', 'Amount', 'Status', 'Note', 'Date'].map(h => (
                                    <th key={h} className="eyebrow" style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', borderBottom: 'none' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pagedLedger.length === 0
                                ? (
                                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>No transactions found</td></tr>
                                )
                                : pagedLedger.map((e, idx) => {
                                    const typeInfo = typeLabel[e.type] ?? { label: e.type, color: 'var(--text-secondary)', bg: 'transparent' };
                                    const globalIdx = (page - 1) * PAGE_SIZE + idx + 1;
                                    return (
                                        <tr key={e.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--duration-fast)' }}
                                            onMouseEnter={ev => (ev.currentTarget.style.background = 'var(--bg-input)')}
                                            onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}
                                        >
                                            <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-muted)' }}>{globalIdx}</td>
                                            <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{e.user_name}</td>
                                            <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                                                <span className={`badge ${e.user_role === 'admin' ? 'badge-gold' : e.user_role === 'provider' ? 'badge-blue' : ''}`} style={{
                                                    background: e.user_role === 'admin' ? 'var(--gold-glow)' : e.user_role === 'provider' ? 'var(--blue-glow)' : 'rgba(16,185,129,0.1)',
                                                    color: e.user_role === 'admin' ? 'var(--gold-mid)' : e.user_role === 'provider' ? 'var(--blue-vivid)' : 'var(--green-status)',
                                                    borderColor: e.user_role === 'admin' ? 'var(--border-gold)' : e.user_role === 'provider' ? 'rgba(59,130,246,0.3)' : 'rgba(16,185,129,0.3)',
                                                }}>
                                                    {e.user_role}
                                                </span>
                                            </td>
                                            <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                                                <span className="badge" style={{ background: typeInfo.bg, color: typeInfo.color, borderColor: typeInfo.color.replace('var(', '').replace(')', '') === 'var(--text-secondary)' ? 'var(--border-subtle)' : 'currentColor' }}>
                                                    {typeInfo.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: typeInfo.color, whiteSpace: 'nowrap' }}>
                                                {((e.type as string) === 'withdraw' || (e.type as string) === 'event_payment') ? '-' : '+'}{fmt(Number(e.amount))}
                                            </td>
                                            <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                                                <span className="badge" style={{
                                                    background: e.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                                    color: e.status === 'completed' ? 'var(--green-status)' : 'var(--gold-mid)',
                                                    borderColor: e.status === 'completed' ? 'rgba(16,185,129,0.3)' : 'var(--border-gold)'
                                                }}>
                                                    {e.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description || '—'}</td>
                                            <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
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
                    <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ opacity: page === 1 ? 0.4 : 1, padding: '6px 12px' }}>← Prev</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ opacity: page === totalPages ? 0.4 : 1, padding: '6px 12px' }}>Next →</button>
                        </div>
                    </div>
                )}
            </motion.div>

            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </motion.div>
    );
}
