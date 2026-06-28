import { EventCard } from './EventCard';
import { EmptyState } from './EmptyState';
import type { Event } from './types/event';

interface EventListProps {
    events: Event[];
    role: string;
    currentUserId: number;
    actionLoading: number | null;
    onJoin: (id: number) => void;
    onLeave: (id: number) => void;
    onEdit: (event: Event) => void;
    onDelete: (id: number) => void;
    onViewDetails: (event: Event) => void;
    emptyMessage?: string;
}

export function EventList({
    events,
    role,
    currentUserId,
    actionLoading,
    onJoin,
    onLeave,
    onEdit,
    onDelete,
    onViewDetails,
    emptyMessage
}: EventListProps) {
    if (events.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {events.map(event => (
                <EventCard
                    key={event.id}
                    event={event}
                    role={role}
                    currentUserId={currentUserId}
                    actionLoading={actionLoading}
                    onJoin={onJoin}
                    onLeave={onLeave}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
}
export default EventList;
