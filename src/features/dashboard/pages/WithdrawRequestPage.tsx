import { useEffect, useState } from 'react';
import { TopNav } from './TopNav';
import { userApi, type WithdrawRequestItem } from '../../../utils/api';

export function WithdrawRequestPage() {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
    const [accountNumber, setAccountNumber] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<WithdrawRequestItem[]>([]);

    const fetchHistory = async () => {
        const res = await userApi.getWithdrawHistory();
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

        const res = await userApi.withdrawRequest({ amount: Number(amount), method, account_number: accountNumber });
        if (res.error) {
            setMessage(res.error);
        } else {
            setMessage('Withdrawal request submitted successfully. Waiting for admin approval.');
            setAmount('');
            setAccountNumber('');
            await fetchHistory();
        }
        setSubmitting(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', padding: '90px 16px 120px' }}>
            <TopNav />
            <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
                    <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700 }}>Withdraw Request</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Request a manual payout to your mobile wallet.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 600 }}>
                        Amount
                        <input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" required style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)' }} />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 600 }}>
                        Payment Method
                        <select value={method} onChange={(e) => setMethod(e.target.value as 'bKash' | 'Nagad')} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}>
                            <option value="bKash">bKash</option>
                            <option value="Nagad">Nagad</option>
                        </select>
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 600 }}>
                        Account Number
                        <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Enter account/mobile number" required style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)' }} />
                    </label>

                    {message ? <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>{message}</div> : null}

                    <button type="submit" disabled={submitting} style={{ padding: '12px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, var(--blue-neon), var(--blue-vivid))', color: '#fff', fontWeight: 700 }}>
                        {submitting ? 'Submitting...' : 'Submit Withdrawal Request'}
                    </button>
                </form>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700 }}>Withdrawal History</h3>
                    {history.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No withdrawal requests yet.</p> : history.map((item) => (
                        <div key={item.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                                <strong>৳ {Number(item.amount).toFixed(2)}</strong>
                                <span style={{ color: item.status === 'Approved' ? 'var(--green-status)' : item.status === 'Rejected' ? 'var(--red-status)' : 'var(--gold-mid)', fontWeight: 700 }}>{item.status}</span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{item.method} • {item.account_number}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>{new Date(item.created_at).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
