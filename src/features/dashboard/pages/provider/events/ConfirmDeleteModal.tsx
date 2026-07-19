import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../../../components/Toast';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    /** Name of the item being deleted, rendered inside the warning body. */
    itemName?: string;
    /** Custom body text. Falls back to a default message using `itemName`. */
    message?: string;
    /** Modal title. Defaults to "Delete Event?". */
    title?: string;
    /** Label for the destructive confirm button. Defaults to "Delete Event". */
    confirmLabel?: string;
    /** Called when the user confirms. Should perform the deletion and return
     *  a result object. If the result contains an `error` string the modal
     *  stays open and shows the error toast. */
    onConfirm: () => Promise<{ error?: string } | undefined | void>;
    /** Called after a successful deletion (e.g. to refresh the list). */
    onSuccess?: () => void;
    onClose: () => void;
}

export function ConfirmDeleteModal({
    isOpen,
    itemName,
    message,
    title = 'Delete Event?',
    confirmLabel = 'Delete Event',
    onConfirm,
    onSuccess,
    onClose,
}: ConfirmDeleteModalProps) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    // Reset the loading state whenever the modal is (re)opened.
    useEffect(() => {
        if (isOpen) setLoading(false);
    }, [isOpen]);

    // Close on Escape (but not while a request is in flight).
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !loading) onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, loading, onClose]);

    const handleConfirm = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = (await onConfirm()) as { error?: string } | undefined;
            if (res && 'error' in res && res.error) {
                toast.error(res.error);
                return; // keep modal open so the user can retry
            }
            toast.success(`${itemName ? `'${itemName}' has` : 'The event has'} been deleted.`);
            onSuccess?.();
            onClose();
        } catch (err) {
            const message =
                err && typeof err === 'object' && 'message' in err
                    ? String((err as { message: unknown }).message)
                    : 'Unable to delete event.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const body =
        message ??
        `Are you sure you want to permanently delete '${
            itemName ?? 'this event'
        }'?\nThis action cannot be undone.`;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                        if (!loading) onClose();
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'var(--bg-overlay)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999,
                        padding: '20px',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                        onClick={(e) => e.stopPropagation()}
                        className="card gold-top-edge"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="confirm-delete-title"
                        style={{
                            width: '100%',
                            maxWidth: '420px',
                            position: 'relative',
                            boxSizing: 'border-box',
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '14px',
                                gap: '12px',
                            }}
                        >
                            <h3
                                id="confirm-delete-title"
                                style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    margin: 0,
                                    fontFamily: "'Inter', sans-serif",
                                }}
                            >
                                {title}
                            </h3>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="btn btn-ghost btn-sm"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <p
                            style={{
                                fontSize: '0.88rem',
                                lineHeight: 1.55,
                                color: 'var(--text-secondary)',
                                margin: '0 0 22px 0',
                                whiteSpace: 'pre-line',
                            }}
                        >
                            {body}
                        </p>

                        {/* Actions */}
                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end',
                                flexWrap: 'wrap',
                            }}
                        >
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="btn btn-ghost btn-sm"
                                style={{ minWidth: '110px' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={loading}
                                className="btn btn-sm"
                                style={{
                                    minWidth: '140px',
                                    color: '#fff',
                                    background:
                                        'linear-gradient(135deg, var(--red-status), #dc2626)',
                                    borderColor: 'transparent',
                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading)
                                        e.currentTarget.style.filter = 'brightness(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.filter = 'none';
                                }}
                            >
                                {loading ? (
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: '14px',
                                                height: '14px',
                                                borderRadius: '50%',
                                                border: '2px solid rgba(255,255,255,0.4)',
                                                borderTopColor: '#fff',
                                                display: 'inline-block',
                                                animation: 'spin 0.7s linear infinite',
                                            }}
                                        />
                                        Deleting...
                                    </span>
                                ) : (
                                    confirmLabel
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ConfirmDeleteModal;
