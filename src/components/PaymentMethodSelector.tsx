import { useEffect, useState } from 'react';
import { paymentMethodApi, depositMethodLabel, type DepositPaymentMethod } from '../utils/api';
import { resolveMediaUrl } from '../config/apiConfig';
import bkashLogo from '../assets/bikash-logo.png';
import nagadLogo from '../assets/Nagad-Logo.png';

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.6rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    marginBottom: '8px',
};

function StoreIcon() {
    return (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#c5a880" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9l1.5-5h15L21 9" />
            <path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
            <path d="M3 9a2.5 2.5 0 0 0 5 0a2.5 2.5 0 0 0 5 0a2.5 2.5 0 0 0 5 0" />
            <path d="M9 21v-6h6v6" />
        </svg>
    );
}

function methodLogo(method: DepositPaymentMethod): React.ReactNode {
    if (method.method === 'bkash') return <img src={bkashLogo} alt={depositMethodLabel(method.method)} style={{ width: 30, height: 30, objectFit: 'contain' }} />;
    if (method.method === 'nagad') return <img src={nagadLogo} alt={depositMethodLabel(method.method)} style={{ width: 30, height: 30, objectFit: 'contain' }} />;
    const img = method.instruction_image_url ? resolveMediaUrl(method.instruction_image_url) : null;
    if (img) {
        return <img src={img} alt={method.provider_name || 'Merchant'} style={{ width: 30, height: 30, objectFit: 'contain' }} />;
    }
    return <StoreIcon />;
}

function MethodCard({
    name,
    logo,
    available,
    selected,
    onPick,
}: {
    name: string;
    logo: React.ReactNode;
    available: boolean;
    selected: boolean;
    onPick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={available ? onPick : undefined}
            disabled={!available}
            aria-pressed={selected}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '12px 8px', cursor: available ? 'pointer' : 'not-allowed',
                borderRadius: 12,
                background: selected ? 'rgba(197,168,128,0.14)' : 'var(--bg-input)',
                border: selected ? '2px solid var(--gold-mid)' : '1px solid var(--border-subtle)',
                opacity: available ? 1 : 0.45,
                boxSizing: 'border-box',
                transition: 'all 0.18s',
            }}
            onMouseEnter={(e) => { if (available) e.currentTarget.style.borderColor = 'var(--gold-mid)'; }}
            onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
            <span style={{ width: 34, height: 34, borderRadius: 8, overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {logo}
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: selected ? 'var(--gold-mid)' : 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>{name}</span>
        </button>
    );
}

/**
 * Dynamic bKash/Nagad/Merchant payment-method chooser for deposit and
 * withdrawal modals. Reads ACTIVE methods from the backend — never hardcodes
 * numbers or merchant configuration.
 *
 * - Deposit mode (`mode: 'deposit'`): shows the admin-configured account
 *   number/type for the selected method, plus payment instructions
 *   (Merchant also shows its provider name and optional instruction image).
 * - Withdraw mode (`mode: 'withdraw'`): only bKash/Nagad are offered (money is
 *   received into the user's own account); the user enters their receiving
 *   account number in the form below.
 */
export function PaymentMethodSelector({
    onSelect,
    mode = 'deposit',
    showAccountInfo,
}: {
    onSelect: (method: DepositPaymentMethod | null) => void;
    mode?: 'deposit' | 'withdraw';
    /** @deprecated use `mode` — kept for backward compatibility with existing callers. */
    showAccountInfo?: boolean;
}) {
    const [methods, setMethods] = useState<DepositPaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<DepositPaymentMethod | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const res = await paymentMethodApi.getActive();
            if (cancelled) return;
            setMethods(res.error ? [] : res.data?.methods ?? []);
            setLoading(false);
        })();
        return () => { cancelled = true; };
    }, []);

    // Withdrawals never offer Merchant — it is a deposit-only destination.
    // Legacy callers pass `showAccountInfo={false}` for withdrawal mode.
    const isWithdrawMode = mode === 'withdraw' || showAccountInfo === false;
    const visibleMethods = isWithdrawMode ? methods.filter((m) => m.method !== 'merchant') : methods;

    const activeFor = (method: 'bkash' | 'nagad' | 'merchant') =>
        visibleMethods.find((m) => m.method === method && m.is_active === 1) ?? null;

    const pick = (m: DepositPaymentMethod) => {
        setSelected(m);
        onSelect(m);
    };

    const bkash = activeFor('bkash');
    const nagad = activeFor('nagad');
    const merchant = activeFor('merchant');

    // Deselect automatically if the selected method disappeared from view.
    const selectedVisible = selected && visibleMethods.some((m) => m.id === selected.id);

    return (
        <div>
            <label style={labelStyle}>Select Payment Method</label>

            {loading ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Loading payment methods…</p>
            ) : visibleMethods.length === 0 ? (
                <p style={{ color: 'var(--gold-mid)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
                    Payment method is currently unavailable.
                </p>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: merchant ? 'repeat(3, 1fr)' : '1fr 1fr', gap: 10 }}>
                        <MethodCard
                            name="bKash"
                            logo={methodLogo(bkash ?? ({ method: 'bkash' } as DepositPaymentMethod))}
                            available={!!bkash}
                            selected={selected?.method === 'bkash'}
                            onPick={() => bkash && pick(bkash)}
                        />
                        <MethodCard
                            name="Nagad"
                            logo={methodLogo(nagad ?? ({ method: 'nagad' } as DepositPaymentMethod))}
                            available={!!nagad}
                            selected={selected?.method === 'nagad'}
                            onPick={() => nagad && pick(nagad)}
                        />
                        {merchant && (
                            <MethodCard
                                name={merchant.provider_name?.trim() || 'Merchant'}
                                logo={methodLogo(merchant)}
                                available
                                selected={selected?.method === 'merchant'}
                                onPick={() => pick(merchant)}
                            />
                        )}
                    </div>

                    {selectedVisible && (
                        <div style={{
                            marginTop: 12, padding: '12px 14px', borderRadius: 10,
                            background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
                            fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: 'var(--text-primary)',
                        }}>
                            <div style={{ fontWeight: 700, color: 'var(--gold-mid)', marginBottom: 6 }}>
                                Selected: {selected!.method === 'merchant' && selected!.provider_name ? selected!.provider_name : depositMethodLabel(selected!.method)}
                            </div>
                            {!isWithdrawMode ? (
                                <>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>Send money to:</span>
                                        <span style={{ fontWeight: 800 }}>{selected!.account_number}</span>
                                    </div>
                                    {selected!.method === 'merchant' ? (
                                        selected!.instructions ? (
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 6, whiteSpace: 'pre-wrap' }}>
                                                {selected!.instructions}
                                            </div>
                                        ) : (
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 6 }}>
                                                After payment, enter the Transaction ID below and upload your payment screenshot.
                                            </div>
                                        )
                                    ) : (
                                        <>
                                            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                                                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>Account type:</span>
                                                <span style={{ fontWeight: 700 }}>{selected!.account_type === 'agent' ? 'Agent' : 'Personal'}</span>
                                            </div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 6 }}>
                                                After payment, enter the Transaction ID below and upload your payment screenshot.
                                            </div>
                                        </>
                                    )}
                                    {selected!.method === 'merchant' && selected!.instruction_image_url && (
                                        <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                                            <img
                                                src={resolveMediaUrl(selected!.instruction_image_url)}
                                                alt={`${selected!.provider_name || 'Merchant'} payment instructions`}
                                                style={{ width: '100%', maxHeight: 220, objectFit: 'contain', background: '#fff', display: 'block' }}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                                    Enter your own {depositMethodLabel(selected!.method)} account number below to receive the money.
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default PaymentMethodSelector;
