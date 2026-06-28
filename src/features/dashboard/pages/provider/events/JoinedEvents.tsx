import { EventList } from './EventList';
import type { Event } from './types/event';

interface JoinedEventsProps {
    events: Event[];
    role: string;
    currentUserId: number;
    actionLoading: number | null;
    onLeave: (id: number) => void;
    onViewDetails: (event: Event) => void;
}

export function JoinedEvents({
    events,
    role,
    currentUserId,
    actionLoading,
    onLeave,
    onViewDetails
}: JoinedEventsProps) {
    const userJoinedEvents = events.filter(e => e.joined === 1);

    return (
        <EventList
            events={userJoinedEvents}
            role={role}
            currentUserId={currentUserId}
            actionLoading={actionLoading}
            onJoin={() => {}}
            onLeave={onLeave}
            onEdit={() => {}}
            onDelete={() => {}}
            onViewDetails={onViewDetails}
            emptyMessage="You have not joined any events yet."
        />
    );
}
export default JoinedEvents;
