import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { TopNav } from './TopNav';
import { userApi, type DepositRequestItem } from '../../../utils/api';

export function DepositRequestPage() {
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
    const [trxId, setTrxId] = useState('');
    const [screenshotUrl, setScreenshotUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<DepositRequestItem[]>([]);

    const fetchHistory = async () => {
        const res = await userApi.getDepositHistory();
        if (!res.error && res.data) {
            setHistory(res.data);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setSubmitting(true);

        const payload = {
            amount: Number(amount),
            method,
            trx_id: trxId,
            screenshot_url: screenshotUrl,
        };

        const res = await userApi.depositRequest(payload);
        if (res.error) {
            setMessage(res.error);
        } else {
            setMessage('Deposit request submitted successfully. Waiting for admin approval.');
            setAmount('');
            setTrxId('');
            setScreenshotUrl('');
            await fetchHistory();
        }
        setSubmitting(false);
    };

    const statusColor = useMemo(() => ({
        Pending: 'var(--gold-mid)',
        Approved: 'var(--green-status)',
        Rejected: 'var(--red-status)',
    }), []);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', padding: '90px 16px 120px' }}>
            <TopNav />
            <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
                    <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700 }}>Deposit Request</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Send manual payment proof for {user?.username || user?.email || 'your account'}.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 600 }}>
                        Payment Method
                        <select value={method} onChange={(e) => setMethod(e.target.value as 'bKash' | 'Nagad')} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}>
                            <option value="bKash">bKash</option>
                            <option value="Nagad">Nagad</option>
                        </select>
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 600 }}>
                        Amount
                        <input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" required style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)' }} />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 600 }}>
                        Transaction ID
                        <input value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="Enter TrxID" required style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)' }} />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 600 }}>
                        Payment Screenshot
                        <input value={screenshotUrl} onChange={(e) => setScreenshotUrl(e.target.value)} placeholder="Paste image URL or base64 data URL" required style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)' }} />
                    </label>

                    {message ? <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>{message}</div> : null}

                    <button type="submit" disabled={submitting} style={{ padding: '12px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, var(--blue-neon), var(--blue-vivid))', color: '#fff', fontWeight: 700 }}>
                        {submitting ? 'Submitting...' : 'Submit Deposit Request'}
                    </button>
                </form>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700 }}>Deposit History</h3>
                    {history.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No deposit requests yet.</p> : history.map((item) => (
                        <div key={item.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                                <strong>৳ {Number(item.amount).toFixed(2)}</strong>
                                <span style={{ color: statusColor[item.status as keyof typeof statusColor] || 'var(--text-muted)', fontWeight: 700 }}>{item.status}</span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{item.method} • {item.trx_id}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>{new Date(item.created_at).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
