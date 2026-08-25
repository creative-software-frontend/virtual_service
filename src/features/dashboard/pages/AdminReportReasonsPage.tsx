import { useEffect, useState } from 'react';
import { TopNav } from './TopNav';
import { adminApi } from '../../../utils/api';
import type { ReportReason } from '../../../utils/api';
import { useToast } from '../../../components/Toast';
import { useConfirmDialog } from '../../../components/ConfirmDialog';

type ReasonWithFlag = ReportReason & { is_active: number };

const btn = (color: string): React.CSSProperties => ({
    border: `1px solid ${color}66`, background: `${color}18`, color, borderRadius: 8,
    padding: '8px 11px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer',
    whiteSpace: 'nowrap',
});

const input: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-default)',
    borderRadius: 8,
    padding: '9px 12px',
    color: 'var(--text-primary)',
    fontSize: '0.82rem',
    boxSizing: 'border-box',
};

export function AdminReportReasonsPage() {
    const toast = useToast();
    const confirmDialog = useConfirmDialog();
    const [reasons, setReasons] = useState<ReasonWithFlag[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');

    const load = async () => {
        setLoading(true);
        const res = await adminApi.getReportReasons();
        if (res.error) toast.error(res.error);
        else setReasons((res.data?.reasons ?? []) as ReasonWithFlag[]);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const add = async () => {
        if (!name.trim()) return toast.error('Reason name is required.');
        setSaving(true);
        const res = await adminApi.createReportReason({ name: name.trim(), description: description.trim() || undefined });
        setSaving(false);
        if (res.error) toast.error(res.error);
        else { setName(''); setDescription(''); toast.success('Reason added.'); await load(); }
    };

    const toggle = async (r: ReasonWithFlag) => {
        const res = await adminApi.toggleReportReason(r.id, r.is_active !== 1);
        if (res.error) toast.error(res.error);
        else await load();
    };

    const startEdit = (r: ReasonWithFlag) => {
        setEditingId(r.id);
        setEditName(r.name);
        setEditDesc(r.description ?? '');
    };

    const saveEdit = async () => {
        if (!editName.trim()) return toast.error('Reason name is required.');
        const res = await adminApi.updateReportReason(editingId!, { name: editName.trim(), description: editDesc.trim() || undefined });
        if (res.error) toast.error(res.error);
        else { setEditingId(null); toast.success('Reason updated.'); await load(); }
    };

    const remove = async (r: ReasonWithFlag) => {
        const ok = await confirmDialog({
            title: 'Delete report reason?',
            message: `"${r.name}" will be permanently deleted. This cannot be undone.`,
            confirmLabel: 'Delete',
            variant: 'danger',
        });
        if (!ok) return;
        const res = await adminApi.deleteReportReason(r.id);
        if (res.error) toast.error(res.error);
        else { toast.success('Reason deleted.'); await load(); }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', width: '100%', color: 'var(--text-primary)' }}>
            <TopNav />
            <div style={{ padding: 'clamp(90px, 22vw, 108px) clamp(12px, 4vw, 16px) clamp(32px, 8vw, 80px)', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ marginBottom: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-mid)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px rgba(197,168,128,0.6))' }}>
                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
                        </svg>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 5vw, 1.35rem)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                            Report Reasons
                        </h2>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                        Manage the reasons users and providers see when reporting an account.
                    </p>
                </div>

                <section className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ margin: '0 0 14px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Add new reason</h3>
                    <div style={{ display: 'grid', gap: 10 }}>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Reason name"
                            style={input}
                        />
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description (optional)"
                            style={input}
                        />
                        <button type="button" onClick={add} disabled={saving} style={btn('var(--gold-mid)')}>
                            {saving ? 'Saving...' : 'Add reason'}
                        </button>
                    </div>
                </section>

                <section className="card" style={{ padding: 'var(--space-6)' }}>
                    <h3 style={{ margin: '0 0 14px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>All reasons</h3>
                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Loading reasons...</p>
                    ) : reasons.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No report reasons found.</p>
                    ) : (
                        <div style={{ display: 'grid', gap: 10 }}>
                            {reasons.map((r) => (
                                <article
                                    key={r.id}
                                    style={{
                                        border: '1px solid var(--border-subtle)',
                                        borderRadius: 10,
                                        padding: 13,
                                        background: 'var(--bg-input)',
                                    }}
                                >
                                    {editingId === r.id ? (
                                        <div style={{ display: 'grid', gap: 8 }}>
                                            <input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                style={input}
                                            />
                                            <input
                                                value={editDesc}
                                                onChange={(e) => setEditDesc(e.target.value)}
                                                placeholder="Description (optional)"
                                                style={input}
                                            />
                                            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                                                <button type="button" onClick={saveEdit} style={btn('var(--green-status)')}>Save</button>
                                                <button type="button" onClick={() => setEditingId(null)} style={btn('var(--text-muted)')}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.82rem' }}>{r.name}</strong>
                                                <span style={{
                                                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                                                    background: r.is_active === 1 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                                                    color: r.is_active === 1 ? 'var(--green-status)' : 'var(--red-status)',
                                                    border: `1px solid ${r.is_active === 1 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                                }}>
                                                    {r.is_active === 1 ? 'Active' : 'Disabled'}
                                                </span>
                                            </div>
                                            {r.description && (
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.76rem', margin: '6px 0 0' }}>{r.description}</p>
                                            )}
                                            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 9 }}>
                                                <button type="button" onClick={() => toggle(r)} style={btn(r.is_active === 1 ? 'var(--red-status)' : 'var(--green-status)')}>
                                                    {r.is_active === 1 ? 'Disable' : 'Enable'}
                                                </button>
                                                <button type="button" onClick={() => startEdit(r)} style={btn('var(--blue-vivid)')}>Edit</button>
                                                <button type="button" onClick={() => remove(r)} style={btn('var(--text-muted)')}>Delete</button>
                                            </div>
                                        </>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default AdminReportReasonsPage;
