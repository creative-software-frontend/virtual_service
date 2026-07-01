import { useState, useEffect, useCallback } from 'react';
import { eventApi } from '../../../../../../utils/api';
import type { Event } from '../types/event';

export function useEvents(role: string) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null); // tracks event ID being modified

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        const res = await eventApi.getEvents(role);
        if (res.error) {
            setError(res.error);
        } else {
            setEvents(res.data || []);
        }
        setLoading(false);
    }, [role]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const joinEvent = useCallback(async (eventId: number) => {
        const event = events.find(e => e.id === eventId);
        const entryFee = Number(event?.entry_fee || 0);
        if (entryFee > 0) {
            const confirmed = window.confirm(
                `Join Paid Event\n\nThis event requires an entry fee of ৳${entryFee}.\n\nThis amount will be deducted from your wallet.\n\nDo you want to continue?`
            );
            if (!confirmed) return;
        }
        setActionLoading(eventId);
        const res = await eventApi.joinEvent(eventId);
        if (res.error) {
            alert(res.error);
        } else {
            // refresh events
            await fetchEvents();
        }
        setActionLoading(null);
    }, [fetchEvents, events]);

    const leaveEvent = useCallback(async (eventId: number) => {
        setActionLoading(eventId);
        const res = await eventApi.leaveEvent(eventId);
        if (res.error) {
            alert(res.error);
        } else {
            // refresh events
            await fetchEvents();
        }
        setActionLoading(null);
    }, [fetchEvents]);

    const deleteEvent = useCallback(async (eventId: number) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        setActionLoading(eventId);
        const res = await eventApi.deleteEvent(eventId);
        if (res.error) {
            alert(res.error);
        } else {
            // refresh events
            await fetchEvents();
        }
        setActionLoading(null);
    }, [fetchEvents]);

    return {
        events,
        loading,
        error,
        actionLoading,
        refresh: fetchEvents,
        joinEvent,
        leaveEvent,
        deleteEvent
    };
}
