import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
    id: number;
    type: ToastType;
    message: string;
}

interface ToastContextValue {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, string> = {
    success: '✅',
    error: '⚠️',
    info: 'ℹ️',
};

const ACCENT: Record<ToastType, string> = {
    success: 'var(--green-status, #22c55e)',
    error: 'var(--red-status, #ef4444)',
    info: 'var(--gold-mid, #f59e0b)',
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback(
        (type: ToastType, message: string) => {
            const id = Date.now() + Math.random();
            setToasts((prev) => [...prev, { id, type, message }]);
            window.setTimeout(() => dismiss(id), 4000);
        },
        [dismiss]
    );

    const success = useCallback((m: string) => push('success', m), [push]);
    const error = useCallback((m: string) => push('error', m), [push]);
    const info = useCallback((m: string) => push('info', m), [push]);

    return (
        <ToastContext.Provider value={{ success, error, info }}>
            {children}
            <div
                style={{
                    position: 'fixed',
                    top: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    zIndex: 'var(--z-toast, 500)',
                    pointerEvents: 'none',
                    width: 'min(92vw, 420px)',
                }}
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="status"
                        onClick={() => dismiss(t.id)}
                        style={{
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '14px 18px',
                            borderRadius: 12,
                            background: 'rgba(10,15,30,0.96)',
                            border: `1px solid ${ACCENT[t.type]}`,
                            boxShadow: '0 8px 30px rgba(0,0,0,0.45)',
                            color: '#fff',
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            fontFamily: "'Inter', sans-serif",
                            animation: 'toastIn 0.25s ease',
                        }}
                    >
                        <span style={{ fontSize: 18, lineHeight: 1 }}>{ICONS[t.type]}</span>
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a <ToastProvider>');
    return ctx;
}
