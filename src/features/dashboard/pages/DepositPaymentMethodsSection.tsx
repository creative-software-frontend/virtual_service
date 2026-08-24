import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { paymentMethodApi, depositMethodLabel, type DepositPaymentMethod } from '../../../utils/api';
import { userApi } from '../../../utils/api';
import { useToast } from '../../../components/Toast';
import { useConfirmDialog } from '../../../components/ConfirmDialog';
import bkashLogo from '../../../assets/bikash-logo.png';
import nagadLogo from '../../../assets/Nagad-Logo.png';

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.6rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-default)',
    borderRadius: '8px',
    padding: '11px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
};

const typeLabel = (t: string | null) => (!t ? 'Merchant' : t === 'agent' ? 'Agent' : 'Personal');
const methodName = (m: string) => depositMethodLabel(m);

function StoreIcon({ size = 30 }: { size?: number }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#c5a880" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9l1.5-5h15L21 9" />
            <path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
            <path d="M3 9a2.5 2.5 0 0 0 5 0a2.5 2.5 0 0 0 5 0a2.5 2.5 0 0 0 5 0" />
            <path d="M9 21v-6h6v6" />
        </svg>
    );
}

function methodLogo(m: DepositPaymentMethod) {
    if (m.method === 'bkash') return bkashLogo;
    if (m.method === 'nagad') return nagadLogo;
    return null; // merchant uses the store glyph
}

type FormMethod = 'bkash' | 'nagad' | 'merchant';

export function DepositPaymentMethodsSection() {
    const toast = useToast();
    const confirmDialog = useConfirmDialog();

    const [methods, setMethods] = useState<DepositPaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<number | null>(null);

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<DepositPaymentMethod | null>(null);
    const [formMethod, setFormMethod] = useState<FormMethod>('bkash');
    const [formNumber, setFormNumber] = useState('');
    const [formType, setFormType] = useState<'personal' | 'agent'>('personal');
    const [formProviderName, setFormProviderName] = useState('');
    const [formInstructions, setFormInstructions] = useState('');
    const [formImageUrl, setFormImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        const res = await paymentMethodApi.getAll();
        if (!res.error && res.data) setMethods(res.data.methods);
        setLoading(false);
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const res = await paymentMethodApi.getAll();
            if (!cancelled && !res.error && res.data) setMethods(res.data.methods);
            if (!cancelled) setLoading(false);
        })();
        return () => { cancelled = true; };
    }, []);

    const isMerchantForm = formMethod === 'merchant';

    const openAdd = (m: FormMethod) => {
        setEditing(null);
        setFormMethod(m);
        setFormNumber('');
        setFormType('personal');
        setFormProviderName('');
        setFormInstructions('');
        setFormImageUrl('');
        setShowForm(true);
    };

    const openEdit = (m: DepositPaymentMethod) => {
        setEditing(m);
        setFormMethod(m.method);
        setFormNumber(m.account_number);
        if (m.account_type === 'agent' || m.account_type === 'personal') setFormType(m.account_type);
        else setFormType('personal');
        setFormProviderName(m.provider_name || '');
        setFormInstructions(m.instructions || '');
        setFormImageUrl(m.instruction_image_url || '');
        setShowForm(true);
    };

    const handleImageUpload = async (file: File) => {
        if (uploadingImage) return;
        const ext = file.name.toLowerCase().includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '';
        const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.webp']);
        const allowedMime = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
        if (!allowedExt.has(ext) || !allowedMime.has(file.type)) {
            toast.error('Only jpg, jpeg, png, webp images are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Maximum file size is 5MB.');
            return;
        }
        try {
            setUploadingImage(true);
            const res = await userApi.uploadImage(file, 'deposits');
            if (res.error || !res.data?.url) throw new Error(res.error || 'Upload failed');
            setFormImageUrl(res.data.url);
        } catch (err) {
            setFormImageUrl('');
            toast.error(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async () => {
        const num = formNumber.replace(/[\s-]/g, '');
        let payload: Parameters<typeof paymentMethodApi.create>[0];

        if (isMerchantForm) {
            if (formProviderName.trim().length < 2 || formProviderName.trim().length > 100) {
                toast.error('Enter a provider name (2–100 characters).');
                return;
            }
            if (!/^\d{6,20}$/.test(num)) {
                toast.error('Enter a valid merchant number (6–20 digits).');
                return;
            }
            payload = {
                method: 'merchant',
                account_number: num,
                provider_name: formProviderName.trim(),
                instructions: formInstructions.trim(),
                instruction_image_url: formImageUrl.trim() || undefined,
                is_active: true,
            };
        } else {
            if (!num || !/^01[3-9][0-9]{8}$/.test(num)) {
                toast.error('Enter a valid Bangladesh mobile number (01XXXXXXXXX)');
                return;
            }
            payload = {
                method: formMethod,
                account_number: num,
                account_type: formType,
                is_active: true,
            };
        }

        setSaving(true);
        const res = editing
            ? await paymentMethodApi.update(editing.id, payload)
            : await paymentMethodApi.create(payload);
        setSaving(false);
        if (res.error) {
            toast.error(res.error);
            return;
        }
        toast.success(editing ? 'Payment method updated.' : 'Payment method added.');
        setShowForm(false);
        await load();
    };

    const handleToggle = async (m: DepositPaymentMethod) => {
        const activating = m.is_active !== 1;
        if (!activating) {
            const ok = await confirmDialog({
                title: `Disable ${methodName(m.method)}${m.provider_name ? ` (${m.provider_name})` : ''}?`,
                message: 'Users and providers will no longer see this payment method for deposits.',
                confirmLabel: 'Disable',
                variant: 'danger',
            });
            if (!ok) return;
        }
        setBusyId(m.id);
        const res = await paymentMethodApi.toggle(m.id, activating);
        setBusyId(null);
        if (res.error) {
            toast.error(res.error);
            return;
        }
        toast.success(activating ? 'Payment method enabled.' : 'Payment method disabled.');
        await load();
    };

    const handleDelete = async (m: DepositPaymentMethod) => {
        const ok = await confirmDialog({
            title: `Delete ${m.provider_name || 'merchant'}?`,
            message: 'Merchants used by past deposits cannot be deleted — those records keep their history. This action cannot be undone.',
            confirmLabel: 'Delete',
            variant: 'danger',
        });
        if (!ok) return;
        setBusyId(m.id);
        const res = await paymentMethodApi.remove(m.id);
        setBusyId(null);
        if (res.error) {
            toast.error(res.error);
            return;
        }
        toast.success('Merchant removed.');
        await load();
    };

    const logoSrc = (m: DepositPaymentMethod) => methodLogo(m);

    return (
        <>
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="card gold-top-edge" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                    <div style={{ minWidth: 0 }}>
                        <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                            Deposit Payment Methods
                        </h2>
                        <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            bKash / Nagad / Merchant numbers shown to users &amp; providers when depositing.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0, maxWidth: '100%' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => openAdd('bkash')}>+ Add bKash</button>
                        <button className="btn btn-outline btn-sm" onClick={() => openAdd('nagad')}>+ Add Nagad</button>
                        <button className="btn btn-outline btn-sm" onClick={() => openAdd('merchant')}>+ Add Merchant</button>
                    </div>
                </div>

                {loading ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>Loading payment methods…</p>
                ) : methods.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No payment methods configured yet. Add a bKash, Nagad or Merchant account to show users where to send deposits.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {methods.map((m) => {
                            const active = m.is_active === 1;
                            const busy = busyId === m.id;
                            const src = logoSrc(m);
                            return (
                                <div key={m.id} style={{
                                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', flexWrap: 'wrap',
                                    padding: '12px 14px', borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
                                }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {src ? (
                                            <img src={src} alt={methodName(m.method)} style={{ width: 30, height: 30, objectFit: 'contain' }} />
                                        ) : (
                                            <StoreIcon size={26} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 140 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                                {m.method === 'merchant' && m.provider_name ? m.provider_name : methodName(m.method)}
                                            </span>
                                            <span className="badge" style={m.method === 'merchant'
                                                ? { background: 'rgba(197,168,128,0.12)', color: 'var(--gold-mid)', borderColor: 'rgba(197,168,128,0.35)' }
                                                : { background: 'rgba(99,102,241,0.12)', color: '#818cf8', borderColor: 'rgba(99,102,241,0.3)' }}>
                                                {typeLabel(m.account_type)}
                                            </span>
                                            <span className="badge" style={active
                                                ? { background: 'rgba(16,185,129,0.12)', color: 'var(--green-status)', borderColor: 'rgba(16,185,129,0.35)' }
                                                : { background: 'rgba(148,163,184,0.12)', color: '#94a3b8', borderColor: 'rgba(148,163,184,0.3)' }}>
                                                {active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: 3 }}>{m.account_number}</div>
                                        {m.instructions ? (
                                            <div style={{
                                                fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4,
                                                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                            }}>{m.instructions}</div>
                                        ) : null}
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)} style={{ padding: '6px 12px' }}>Edit</button>
                                        {active ? (
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(m)} disabled={busy || busyId !== null} style={{ padding: '6px 12px', color: '#f59e0b', borderColor: 'rgba(245,158,11,0.4)' }}>
                                                {busy ? '…' : 'Disable'}
                                            </button>
                                        ) : (
                                            <button className="btn btn-primary btn-sm" onClick={() => handleToggle(m)} disabled={busy || busyId !== null} style={{ padding: '6px 12px' }}>
                                                {busy ? '…' : 'Enable'}
                                            </button>
                                        )}
                                        {m.method === 'merchant' && (
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(m)} disabled={busy || busyId !== null} style={{ padding: '6px 12px', color: 'var(--red-status)', borderColor: 'rgba(239,68,68,0.4)' }}>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* Add / Edit form modal */}
            {showForm && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={editing ? 'Edit payment method' : 'Add payment method'}
                    onClick={() => { if (!saving) setShowForm(false); }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 800,
                        background: 'var(--bg-overlay)', backdropFilter: 'blur(6px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%', maxWidth: 380, maxHeight: '90vh', overflowY: 'auto',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)', borderRadius: 16,
                            boxShadow: 'var(--shadow-lg)', boxSizing: 'border-box', padding: '22px 20px',
                            fontFamily: "'Inter', sans-serif", animation: 'vserv-toast-in 0.18s ease',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {isMerchantForm ? <StoreIcon size={22} /> : (
                                    (() => {
                                        const src = logoSrc({ id: 0, method: formMethod } as DepositPaymentMethod);
                                        return src ? (
                                            <img src={src} alt={methodName(formMethod)} style={{ width: 26, height: 26, objectFit: 'contain' }} />
                                        ) : <StoreIcon size={22} />;
                                    })()
                                )}
                            </div>
                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                {editing ? 'Edit' : 'Add'} {isMerchantForm ? 'Merchant' : `${methodName(formMethod)} Account`}
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {isMerchantForm && (
                                <div>
                                    <label style={labelStyle}>Provider name *</label>
                                    <input
                                        style={inputStyle}
                                        value={formProviderName}
                                        onChange={(e) => setFormProviderName(e.target.value.slice(0, 100))}
                                        placeholder="e.g. bKash Merchant"
                                    />
                                </div>
                            )}

                            <div>
                                <label style={labelStyle}>{isMerchantForm ? 'Merchant number *' : 'Account number *'}</label>
                                <input
                                    style={inputStyle}
                                    inputMode="numeric"
                                    value={formNumber}
                                    onChange={(e) => setFormNumber(
                                        isMerchantForm
                                            ? e.target.value.replace(/[^\d\s-]/g, '').slice(0, 24)
                                            : e.target.value.replace(/\D/g, '').slice(0, 11)
                                    )}
                                    placeholder={isMerchantForm ? 'Merchant account number' : '01XXXXXXXXX'}
                                />
                            </div>

                            {!isMerchantForm && (
                                <div>
                                    <label style={labelStyle}>Account type</label>
                                    <select
                                        style={{ ...inputStyle, cursor: 'pointer' }}
                                        value={formType}
                                        onChange={(e) => setFormType(e.target.value as 'personal' | 'agent')}
                                    >
                                        <option value="personal">Personal</option>
                                        <option value="agent">Agent</option>
                                    </select>
                                </div>
                            )}

                            {isMerchantForm && (
                                <>
                                    <div>
                                        <label style={labelStyle}>Payment instructions</label>
                                        <textarea
                                            style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                                            value={formInstructions}
                                            onChange={(e) => setFormInstructions(e.target.value.slice(0, 2000))}
                                            placeholder="Optional — e.g. Send money as Personal, then submit the TrxID below."
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Instruction image</label>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            disabled={uploadingImage}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(file);
                                                e.currentTarget.value = '';
                                            }}
                                            style={{ ...inputStyle, padding: '9px 12px' }}
                                        />
                                        {uploadingImage ? (
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 6 }}>Uploading…</div>
                                        ) : formImageUrl ? (
                                            <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                                                <img src={formImageUrl} alt="Instruction preview" style={{ width: '100%', maxHeight: 140, objectFit: 'contain', background: '#fff', display: 'block' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormImageUrl('')}
                                                    style={{
                                                        position: 'absolute', top: 6, right: 6,
                                                        background: 'rgba(2,6,18,0.75)', color: '#fff', border: 'none',
                                                        borderRadius: 6, padding: '4px 10px', fontSize: '0.7rem', cursor: 'pointer',
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 6 }}>Optional — jpg/png/webp up to 5MB.</div>
                                        )}
                                    </div>
                                </>
                            )}

                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
                                <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)} disabled={saving}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || uploadingImage}>
                                    {saving ? 'Saving…' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DepositPaymentMethodsSection;
