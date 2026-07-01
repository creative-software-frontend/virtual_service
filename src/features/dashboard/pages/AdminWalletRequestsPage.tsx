import { useEffect, useState } from 'react';
import { TopNav } from './TopNav';

interface DepositRequestItem {
    id: number;
    user_name?: string;
    user_email?: string;
    amount: number;
    method: string;
    trx_id: string;
    screenshot_url: string;
    status: string;
    admin_note?: string | null;
    created_at: string;
}

interface WithdrawRequestItem {
    id: number;
    user_name?: string;
    user_email?: string;
    amount: number;
    method: string;
    account_number: string;
    status: string;
    admin_note?: string | null;
    created_at: string;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
    return localStorage.getItem('bluedise_token');
}

async function request<T>(path: string, options: RequestInit = {}) {
    const token = getToken();
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(json.message || 'Request failed');
    }
    return json as T;
}

export function AdminWalletRequestsPage() {
    const [deposits, setDeposits] = useState<DepositRequestItem[]>([]);
    const [withdrawals, setWithdrawals] = useState<WithdrawRequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState<Record<string, string>>({});

    const load = async () => {
        setLoading(true);
        try {
            const [depositData, withdrawData] = await Promise.all([
                request<DepositRequestItem[]>('/admin-wallet/deposit-requests'),
                request<WithdrawRequestItem[]>('/admin-wallet/withdraw-requests'),
            ]);
            setDeposits(depositData || []);
            setWithdrawals(withdrawData || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const approveDeposit = async (id: number) => {
        await request(`/admin-wallet/deposit/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ admin_note: note[String(id)] || '' }) });
        await load();
    };

    const rejectDeposit = async (id: number) => {
        await request(`/admin-wallet/deposit/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ admin_note: note[String(id)] || '' }) });
        await load();
    };

    const approveWithdraw = async (id: number) => {
        await request(`/admin-wallet/withdraw/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ admin_note: note[String(id)] || '' }) });
        await load();
    };

    const rejectWithdraw = async (id: number) => {
        await request(`/admin-wallet/withdraw/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ admin_note: note[String(id)] || '' }) });
        await load();
    };

    if (loading) {
        return <div style={{ padding: 24, color: 'var(--text-muted)' }}>Loading requests...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', padding: '90px 16px 120px' }}>
            <TopNav />
            <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
                    <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700 }}>Manual Wallet Review</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Approve or reject deposits and withdrawals after verifying the payment details.</p>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700 }}>Pending Deposits</h3>
                    {deposits.filter((d) => d.status === 'Pending').length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No pending deposits.</p> : deposits.filter((d) => d.status === 'Pending').map((item) => (
                        <div key={item.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                                <div><strong>{item.user_name || item.user_email || `User ${item.id}`}</strong><div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{item.method} • TrxID: {item.trx_id}</div></div>
                                <div style={{ fontWeight: 700 }}>৳ {Number(item.amount).toFixed(2)}</div>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(item.created_at).toLocaleString()}</div>
                            {item.screenshot_url ? <a href={item.screenshot_url} target="_blank" rel="noreferrer" style={{ color: 'var(--blue-vivid)', fontWeight: 600 }}>View Screenshot</a> : null}
                            <textarea value={note[String(item.id)] || ''} onChange={(e) => setNote((prev) => ({ ...prev, [String(item.id)]: e.target.value }))} placeholder="Admin note" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)' }} />
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => approveDeposit(item.id)} style={{ padding: '10px 12px', borderRadius: 10, border: 'none', background: 'var(--green-status)', color: '#fff', fontWeight: 700 }}>Approve</button>
                                <button onClick={() => rejectDeposit(item.id)} style={{ padding: '10px 12px', borderRadius: 10, border: 'none', background: 'var(--red-status)', color: '#fff', fontWeight: 700 }}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700 }}>Pending Withdrawals</h3>
                    {withdrawals.filter((w) => w.status === 'Pending').length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No pending withdrawals.</p> : withdrawals.filter((w) => w.status === 'Pending').map((item) => (
                        <div key={item.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                                <div><strong>{item.user_name || item.user_email || `User ${item.id}`}</strong><div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{item.method} • Account: {item.account_number}</div></div>
                                <div style={{ fontWeight: 700 }}>৳ {Number(item.amount).toFixed(2)}</div>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(item.created_at).toLocaleString()}</div>
                            <textarea value={note[String(item.id)] || ''} onChange={(e) => setNote((prev) => ({ ...prev, [String(item.id)]: e.target.value }))} placeholder="Admin note" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)' }} />
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => approveWithdraw(item.id)} style={{ padding: '10px 12px', borderRadius: 10, border: 'none', background: 'var(--green-status)', color: '#fff', fontWeight: 700 }}>Approve</button>
                                <button onClick={() => rejectWithdraw(item.id)} style={{ padding: '10px 12px', borderRadius: 10, border: 'none', background: 'var(--red-status)', color: '#fff', fontWeight: 700 }}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
