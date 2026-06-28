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
                maxWidth: 480,
                background: 'linear-gradient(135deg,rgba(30,41,59,0.98),rgba(15,23,42,0.98))',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 20,
                padding: '24px 20px',
                boxShadow: '0 0 30px rgba(99,102,241,0.25)',
                boxSizing: 'border-box',
                animation: 'fadeIn 0.25s ease'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}>
                    <h2 style={{
                        color: 'var(--text-primary)',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        fontFamily: "'Inter', sans-serif",
                        margin: 0
                    }}>
                        {eventToEdit ? 'Edit Experience Event' : 'Create Exclusive Event'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
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
