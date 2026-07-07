import { useEffect, useState } from 'react';
import { TopNav } from './TopNav';
import { adminApi } from '../../../utils/api';
import type { Package, CreatePackagePayload } from '../../../utils/api';

// ── Tiny helpers ──────────────────────────────────────────────────────────────

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
    transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
    fontSize: '0.6rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    display: 'block',
    marginBottom: '6px',
};

const sectionTitle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
};

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="var(--gold-mid)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);


// ── Packages Section ──────────────────────────────────────────────────────────

function PackagesSection() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<CreatePackagePayload>({
        name: '',
        description: '',
        price: 0,
        duration_days: 30,
        duration_months: 1,
        tier_type: 'premium',
        features: '',
    });

    const fetchPackages = async () => {
        setLoading(true);
        const res = await adminApi.getPackages();
        if (res.data) setPackages(res.data);
        setLoading(false);
    };

    useEffect(() => { fetchPackages(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (!form.name || !form.price) { setError('Name and price are required.'); return; }
        setSubmitting(true);
        const res = await adminApi.createPackage({
            ...form,
            duration_days: form.duration_months * 30,
        });
        if (res.error) {
            setError(res.error);
        } else {
            setSuccess('Package created successfully!');
            setForm({ name: '', description: '', price: 0, duration_days: 30, duration_months: 1, tier_type: 'premium', features: '' });
            setShowForm(false);
            fetchPackages();
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Delete package "${name}"?`)) return;
        const res = await adminApi.deletePackage(id);
        if (res.error) setError(res.error);
        else { setSuccess('Package deleted.'); fetchPackages(); }
    };

    return (
        <div style={{ marginBottom: '28px' }}>
            {/* Section header */}
            <div style={sectionTitle}>
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    borderRadius: '10px',
                    background: 'var(--blue-glow)',
                    border: '1px solid rgba(59,130,246,0.3)',
                    flexShrink: 0,
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3l-4 4-4-4" />
                    </svg>
                </span>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
                        Service Packages
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif" }}>
                        Create and manage membership packages
                    </p>
                </div>
                <button
                    onClick={() => { setShowForm(v => !v); setError(''); setSuccess(''); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 14px',
                        background: showForm ? 'rgba(59,130,246,0.08)' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                        border: showForm ? '1px solid rgba(59,130,246,0.3)' : 'none',
                        borderRadius: '8px',
                        color: showForm ? 'var(--text-secondary)' : '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontFamily: "'Inter', sans-serif",
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                    }}
                >
                    {showForm ? (
                        <>✕ Cancel</>
                    ) : (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg> New Package</>
                    )}
                </button>
            </div>

            {/* Feedback messages */}
            {error && (
                <div style={{
                    padding: '10px 14px', background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px',
                    color: '#fca5a5', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", marginBottom: '14px',
                }}>⚠ {error}</div>
            )}
            {success && (
                <div style={{
                    padding: '10px 14px', background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px',
                    color: '#6ee7b7', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", marginBottom: '14px',
                }}>✓ {success}</div>
            )}

            {/* Create form */}
            {showForm && (
                <div className="card" style={{ marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--blue-vivid), transparent)' }} />
                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div>
                                <label style={labelStyle}>Tier Type *</label>
                                <select
                                    style={{ ...inputStyle, cursor: 'pointer' }}
                                    value={form.tier_type}
                                    onChange={e => setForm(f => ({ ...f, tier_type: e.target.value as 'starter' | 'premium' | 'elite' }))}
                                >
                                    <option value="starter">⭐ Starter (Free)</option>
                                    <option value="premium">♛ Premium</option>
                                    <option value="elite">♦ Elite</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Duration (Months) *</label>
                                <select
                                    style={{ ...inputStyle, cursor: 'pointer' }}
                                    value={form.duration_months}
                                    onChange={e => setForm(f => ({ ...f, duration_months: parseInt(e.target.value) }))}
                                >
                                    <option value={1}>1 Month</option>
                                    <option value={3}>3 Months</option>
                                    <option value={6}>6 Months</option>
                                    <option value={12}>12 Months</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div>
                                <label style={labelStyle}>Package Name *</label>
                                <input
                                    style={inputStyle}
                                    placeholder="e.g. Gold Plan"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Price (৳) *</label>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="e.g. 999"
                                    value={form.price || ''}
                                    onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={labelStyle}>Duration (Days)</label>
                            <input
                                style={inputStyle}
                                type="number"
                                min="1"
                                placeholder="30"
                                value={form.duration_days || ''}
                                onChange={e => setForm(f => ({ ...f, duration_days: parseInt(e.target.value) || 30 }))}
                            />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={labelStyle}>Description</label>
                            <textarea
                                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                placeholder="Short description of this package…"
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Features (comma-separated)</label>
                            <input
                                style={inputStyle}
                                placeholder="e.g. Unlimited bookings, Priority support, …"
                                value={form.features}
                                onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                width: '100%',
                                padding: '13px',
                                background: submitting
                                    ? 'var(--bg-input)'
                                    : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                                border: 'none', borderRadius: '8px',
                                color: '#fff', fontWeight: 700,
                                fontSize: '0.7rem', letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                fontFamily: "'Inter', sans-serif",
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: submitting ? 'none' : '0 0 20px rgba(59,130,246,0.35)',
                            }}
                        >
                            {submitting ? 'Creating…' : '✓ Create Package'}
                        </button>
                    </form>
                </div>
            )}

            {/* Package list */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Loading packages…
                </div>
            ) : packages.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '40px',
                    background: 'var(--bg-card)', border: '1px dashed var(--border-subtle)',
                    borderRadius: '12px',
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
                        No packages yet. Create your first one!
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                    {[...packages].sort((a, b) => {
                        const order = { starter: 0, premium: 1, elite: 2 };
                        const scoreA = order[a.tier_type as 'starter' | 'premium' | 'elite'] ?? 99;
                        const scoreB = order[b.tier_type as 'starter' | 'premium' | 'elite'] ?? 99;
                        if (scoreA !== scoreB) return scoreA - scoreB;
                        return Number(a.price) - Number(b.price);
                    }).map(pkg => {
                        const featureList = pkg.features
                            ? pkg.features.split(',').map(f => f.trim()).filter(Boolean)
                            : [];
                        const tierLabelText = pkg.tier_type === 'starter' ? 'Starter' : pkg.tier_type === 'elite' ? 'Elite' : 'Premium';
                        return (
                        <div key={pkg.id} className="card gold-top-edge" style={{ position: 'relative' }}>

                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '16px',
                                borderBottom: '1px solid var(--border-subtle)',
                                paddingBottom: '16px',
                                marginBottom: '16px',
                            }}>
                                <div>
                                    <span className="eyebrow" style={{ display: 'block', marginBottom: '4px' }}>{tierLabelText}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <h3 style={{
                                            fontSize: '1.3rem',
                                            fontWeight: 600,
                                            color: 'var(--text-primary)',
                                            margin: 0,
                                        }}>
                                            {pkg.name}
                                        </h3>
                                        <span style={{
                                            fontSize: '0.55rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase',
                                            background: pkg.is_active ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                            color: pkg.is_active ? 'var(--green-status)' : 'var(--red-status)',
                                            border: `1px solid ${pkg.is_active ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                            padding: '2px 8px',
                                            borderRadius: 'var(--radius-pill)',
                                        }}>
                                            {pkg.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    {pkg.description && (
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                                            {pkg.description}
                                        </p>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                    <span style={{
                                        fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
                                        fontWeight: 800,
                                        color: 'var(--gold-mid)',
                                        lineHeight: 1,
                                    }}>
                                        {Number(pkg.price) === 0 ? 'Free' : `৳${Number(pkg.price).toLocaleString()}`}
                                    </span>
                                    <span className="badge badge-gold">
                                        {pkg.duration_months} Month{pkg.duration_months > 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Features list */}
                            <div style={{ marginBottom: '16px' }}>
                                <p style={{
                                    fontSize: '0.6rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.25em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-muted)',
                                    marginBottom: '10px',
                                    fontFamily: 'var(--font-display)',
                                }}>
                                    Included Features
                                </p>
                                {featureList.length > 0 ? (
                                    <ul style={{
                                        listStyle: 'none',
                                        padding: 0,
                                        margin: 0,
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                                        gap: '8px',
                                    }}>
                                        {featureList.map(feat => (
                                            <li key={feat} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontSize: '0.82rem',
                                                color: 'var(--text-secondary)',
                                                fontFamily: 'var(--font-sans)',
                                            }}>
                                                <span style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'var(--gold-glow)',
                                                    border: '1px solid var(--border-gold)',
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    flexShrink: 0,
                                                }}>
                                                    <CheckIcon />
                                                </span>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                        No features listed.
                                    </p>
                                )}
                            </div>

                            {/* Action: Delete (preserve original CRUD) */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                                <button
                                    onClick={() => handleDelete(pkg.id, pkg.name)}
                                    className="btn btn-ghost btn-sm"
                                    style={{
                                        color: 'var(--red-status)',
                                        borderColor: 'rgba(239,68,68,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '';
                                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                                    }}
                                    title="Delete package"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}


export function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState<'packages'>('packages');

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-main)',
            width: '100%',
            color: 'var(--text-primary)',
        }}>
            <TopNav />

            <div style={{
                padding: 'clamp(90px, 22vw, 108px) clamp(12px, 4vw, 16px) clamp(32px, 8vw, 80px)',
                width: '100%',
                boxSizing: 'border-box',
            }}>

                {/* ── Page Title ── */}
                <div style={{ marginBottom: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.6))' }}>
                            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        <h2 style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 'clamp(1.1rem, 5vw, 1.35rem)',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                        }}>
                            Settings
                        </h2>
                    </div>
                    <p style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: '0.05em',
                    }}>
                        Manage packages and platform rates
                    </p>
                </div>

                {/* ── Tabs ── */}
                <div style={{
                    display: 'flex',
                    background: 'var(--bg-nav)',
                    borderRadius: '10px',
                    padding: '4px',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '24px',
                    gap: '4px',
                }}>
                    {([
                        { key: 'packages', label: '📦 Packages', color: 'var(--blue-vivid)', bg: 'rgba(59,130,246,0.12)' },
                    ] as const).map(t => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            style={{
                                flex: 1,
                                padding: '10px 8px',
                                border: 'none',
                                borderRadius: '7px',
                                fontSize: '0.65rem',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                fontWeight: 700,
                                fontFamily: "'Inter', sans-serif",
                                cursor: 'pointer',
                                background: activeTab === t.key ? t.bg : 'transparent',
                                color: activeTab === t.key ? t.color : 'var(--text-muted)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab content ── */}
                {activeTab === 'packages' ? <PackagesSection /> : null}
            </div>
        </div>
    );
}
