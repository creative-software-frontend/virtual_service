export function formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

export function getStatusLabel(status: 'active' | 'cancelled' | 'completed'): string {
    switch (status) {
        case 'active': return 'Active';
        case 'cancelled': return 'Cancelled';
        case 'completed': return 'Completed';
        default: return status;
    }
}

export function getStatusStyle(status: 'active' | 'cancelled' | 'completed') {
    switch (status) {
        case 'active':
            return {
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.4)',
                color: '#34d399'
            };
        case 'cancelled':
            return {
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                color: '#f87171'
            };
        case 'completed':
            return {
                background: 'rgba(156,163,175,0.15)',
                border: '1px solid rgba(156,163,175,0.4)',
                color: '#9ca3af'
            };
        default:
            return {
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.4)',
                color: '#818cf8'
            };
    }
}

export function getCapacityText(participantCount: number, capacity: number): string {
    if (capacity <= 0) {
        return `${participantCount} joined (Unlimited)`;
    }
    if (participantCount >= capacity) {
        return `Full (${capacity}/${capacity})`;
    }
    return `${participantCount} / ${capacity} spots filled`;
}

export function isEventFull(participantCount: number, capacity: number): boolean {
    return capacity > 0 && participantCount >= capacity;
}
