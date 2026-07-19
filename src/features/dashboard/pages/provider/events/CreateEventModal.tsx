import { EventForm } from './EventForm';
import type { Event } from './types/event';

interface CreateEventModalProps {
    isOpen: boolean;
    eventToEdit?: Event | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateEventModal({ isOpen, eventToEdit, onClose, onSuccess }: CreateEventModalProps) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            background: 'rgba(5, 8, 16, 0.85)',
            backdropFilter: 'blur(8px)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: 600,
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'linear-gradient(135deg, rgba(11,21,45,0.98), rgba(7,16,32,0.98))',
                border: '1px solid var(--gold-border)',
                borderRadius: 'var(--radius-2xl)',
                padding: '28px 26px',
                boxShadow: '0 0 40px rgba(197,168,128,0.12), var(--shadow-lg)',
                boxSizing: 'border-box',
                animation: 'fadeIn 0.25s ease'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 22,
                    gap: 12
                }}>
                    <div>
                        <h2 style={{
                            color: 'var(--text-primary)',
                            fontSize: '1.35rem',
                            fontWeight: 700,
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                            letterSpacing: '-0.01em'
                        }}>
                            {eventToEdit ? 'Edit Event' : 'Create Event'}
                        </h2>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.82rem',
                            fontFamily: "'Inter', sans-serif",
                            margin: '6px 0 0',
                            lineHeight: 1.4
                        }}>
                            {eventToEdit ? 'Update the details of your event.' : 'Organize a new event for users.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-muted)',
                            fontSize: '1rem',
                            lineHeight: 1,
                            width: 32,
                            height: 32,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = 'var(--text-primary)';
                            e.currentTarget.style.borderColor = 'var(--gold-border)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = 'var(--text-muted)';
                            e.currentTarget.style.borderColor = 'var(--border-default)';
                        }}
                    >
                        ✕
                    </button>
                </div>

                <EventForm
                    eventToEdit={eventToEdit}
                    onSuccess={() => {
                        onSuccess();
                        onClose();
                    }}
                    onCancel={onClose}
                />
            </div>
        </div>
    );
}
export default CreateEventModal;
