import { useCreateEvent } from './hooks/useCreateEvent';
import type { Event } from './types/event';

interface EventFormProps {
    eventToEdit?: Event | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export function EventForm({ eventToEdit, onSuccess, onCancel }: EventFormProps) {
    const {
        values,
        errors,
        submitting,
        submitError,
        handleChange,
        handleSubmit
    } = useCreateEvent({ eventToEdit, onSuccess });

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                    EVENT TITLE
                </label>
                <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    placeholder="E.g., VIP Yacht Gathering"
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: errors.title ? '1px solid #f87171' : '1px solid rgba(99,102,241,0.25)',
                        borderRadius: 10,
                        color: 'var(--text-primary)',
                        padding: '10px 12px',
                        fontSize: '0.9rem',
                        fontFamily: "'Inter', sans-serif",
                        outline: 'none',
                        boxSizing: 'border-box'
                    }}
                />
                {errors.title && <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 4, display: 'block' }}>{errors.title}</span>}
            </div>

            <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                    DESCRIPTION
                </label>
                <textarea
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    placeholder="Provide details about the exclusive experience..."
                    rows={4}
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: errors.description ? '1px solid #f87171' : '1px solid rgba(99,102,241,0.25)',
                        borderRadius: 10,
                        color: 'var(--text-primary)',
                        padding: '10px 12px',
                        fontSize: '0.9rem',
                        fontFamily: "'Inter', sans-serif",
                        resize: 'none',
                        outline: 'none',
                        boxSizing: 'border-box'
                    }}
                />
                {errors.description && <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 4, display: 'block' }}>{errors.description}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                        DATE & TIME
                    </label>
                    <input
                        type="datetime-local"
                        name="date_time"
                        value={values.date_time}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.05)',
                            border: errors.date_time ? '1px solid #f87171' : '1px solid rgba(99,102,241,0.25)',
                            borderRadius: 10,
                            color: 'var(--text-primary)',
                            padding: '10px 12px',
                            fontSize: '0.9rem',
                            fontFamily: "'Inter', sans-serif",
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                    {errors.date_time && <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 4, display: 'block' }}>{errors.date_time}</span>}
                </div>

                <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                        MAX CAPACITY (0 = UNLIMITED)
                    </label>
                    <input
                        type="number"
                        name="capacity"
                        value={values.capacity}
                        onChange={handleChange}
                        placeholder="Unlimited"
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.05)',
                            border: errors.capacity ? '1px solid #f87171' : '1px solid rgba(99,102,241,0.25)',
                            borderRadius: 10,
                            color: 'var(--text-primary)',
                            padding: '10px 12px',
                            fontSize: '0.9rem',
                            fontFamily: "'Inter', sans-serif",
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                    {errors.capacity && <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 4, display: 'block' }}>{errors.capacity}</span>}
                </div>
            </div>

            <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                    LOCATION
                </label>
                <input
                    type="text"
                    name="location"
                    value={values.location}
                    onChange={handleChange}
                    placeholder="E.g., Blue Lounge St. Tropez"
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: errors.location ? '1px solid #f87171' : '1px solid rgba(99,102,241,0.25)',
                        borderRadius: 10,
                        color: 'var(--text-primary)',
                        padding: '10px 12px',
                        fontSize: '0.9rem',
                        fontFamily: "'Inter', sans-serif",
                        outline: 'none',
                        boxSizing: 'border-box'
                    }}
                />
                {errors.location && <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 4, display: 'block' }}>{errors.location}</span>}
            </div>

            {eventToEdit && (
                <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                        STATUS
                    </label>
                    <select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            background: 'rgba(25,35,55,0.95)',
                            border: '1px solid rgba(99,102,241,0.25)',
                            borderRadius: 10,
                            color: 'var(--text-primary)',
                            padding: '10px 12px',
                            fontSize: '0.9rem',
                            fontFamily: "'Inter', sans-serif",
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            )}

            {submitError && (
                <div style={{ color: '#f87171', fontSize: '0.82rem', padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8 }}>
                    {submitError}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10,
                        color: 'var(--text-secondary)',
                        padding: '10px 20px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        background: submitting ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#818cf8)',
                        border: 'none',
                        borderRadius: 10,
                        color: '#fff',
                        padding: '10px 24px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: submitting ? 'wait' : 'pointer',
                        boxShadow: '0 0 14px rgba(99,102,241,0.4)',
                        transition: 'all 0.2s'
                    }}
                >
                    {submitting ? 'Saving...' : eventToEdit ? 'Save Changes' : 'Create Event'}
                </button>
            </div>
        </form>
    );
}
export default EventForm;
