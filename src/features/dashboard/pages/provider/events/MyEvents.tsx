import { EventList } from './EventList';
import type { Event } from './types/event';

interface MyEventsProps {
    events: Event[];
    role: string;
    currentUserId: number;
    actionLoading: number | null;
    onEdit: (event: Event) => void;
    onDelete: (id: number) => void;
    onViewDetails: (event: Event) => void;
}

export function MyEvents({
    events,
    role,
    currentUserId,
    actionLoading,
    onEdit,
    onDelete,
    onViewDetails
}: MyEventsProps) {
    const myCreatedEvents = events.filter(e => e.creator_id === currentUserId);

    return (
        <EventList
            events={myCreatedEvents}
            role={role}
            currentUserId={currentUserId}
            actionLoading={actionLoading}
            onJoin={() => {}}
            onLeave={() => {}}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetails={onViewDetails}
            emptyMessage="You have not created any events yet."
        />
    );
}
export default MyEvents;
