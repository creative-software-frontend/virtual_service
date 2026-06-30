import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import { useEvents } from './hooks/useEvents';
import { EventFilters } from './EventFilters';
import { EventList } from './EventList';
import { MyEvents } from './MyEvents';
import { JoinedEvents } from './JoinedEvents';
import { CreateEventModal } from './CreateEventModal';
import { EventDetailsModal } from './EventDetailsModal';
import type { Event } from './types/event';
import { PartnerSearchPanel } from '../../partner/PartnerSearchPanel';

export function EventPage() {
    const { role = 'user' } = useParams<{ role: string }>();
    const { user } = useAuth();
    const currentUserId = user?.id ?? 0;

    const {
        events,
        loading,
        error,
        actionLoading,
        refresh,
        joinEvent,
        leaveEvent,
        deleteEvent
    } = useEvents(role);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeTab, setActiveTab] = useState<'browse' | 'my-events' | 'joined-events' | 'partner'>('browse');

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [eventToView, setEventToView] = useState<Event | null>(null);

    const handleEditClick = (event: Event) => {
        setEventToEdit(event);
        setIsCreateOpen(true);
    };

    const handleViewDetails = (event: Event) => {
        setEventToView(event);
    };

    // Filter events before rendering
    const filteredEvents = events.filter(e => {
        // Status filter
        if (statusFilter !== 'all' && e.status !== statusFilter) {
            return false;
        }

        // Search text
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const matchesTitle = e.title.toLowerCase().includes(query);
            const matchesLocation = e.location.toLowerCase().includes(query);
            const matchesDesc = e.description ? e.description.toLowerCase().includes(query) : false;
            return matchesTitle || matchesLocation || matchesDesc;
        }

        return true;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Tab navigation */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid rgba(99,102,241,0.15)',
                marginBottom: 8
            }}>
                <button
                    onClick={() => setActiveTab('browse')}
                    style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        color: activeTab === 'browse' ? '#818cf8' : 'var(--text-secondary)',
                        padding: '12px 0',
                        fontSize: '0.85rem',
                        fontWeight: activeTab === 'browse' ? 700 : 500,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'color 0.2s'
                    }}
                >
                    Browse Events
                    {activeTab === 'browse' && (
                        <span style={{
                            position: 'absolute',
                            bottom: -1,
                            left: '25%',
                            right: '25%',
                            height: 2,
                            background: 'linear-gradient(90deg,#6366f1,#818cf8)',
                            borderRadius: 4
                        }} />
                    )}
                </button>

                {role === 'provider' && (
                    <button
                        onClick={() => setActiveTab('my-events')}
                        style={{
                            flex: 1,
                            background: 'none',
                            border: 'none',
                            color: activeTab === 'my-events' ? '#818cf8' : 'var(--text-secondary)',
                            padding: '12px 0',
                            fontSize: '0.85rem',
                            fontWeight: activeTab === 'my-events' ? 700 : 500,
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'color 0.2s'
                        }}
                    >
                        My Events
                        {activeTab === 'my-events' && (
                            <span style={{
                                position: 'absolute',
                                bottom: -1,
                                left: '25%',
                                right: '25%',
                                height: 2,
                                background: 'linear-gradient(90deg,#6366f1,#818cf8)',
                                borderRadius: 4
                            }} />
                        )}
                    </button>
                )}

                {role === 'user' && (
                    <>
                        <button
                            onClick={() => setActiveTab('joined-events')}
                            style={{
                                flex: 1,
                                background: 'none',
                                border: 'none',
                                color: activeTab === 'joined-events' ? '#818cf8' : 'var(--text-secondary)',
                                padding: '12px 0',
                                fontSize: '0.85rem',
                                fontWeight: activeTab === 'joined-events' ? 700 : 500,
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'color 0.2s'
                            }}
                        >
                            Joined Events
                            {activeTab === 'joined-events' && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: -1,
                                    left: '25%',
                                    right: '25%',
                                    height: 2,
                                    background: 'linear-gradient(90deg,#6366f1,#818cf8)',
                                    borderRadius: 4
                                }} />
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('partner')}
                            style={{
                                flex: 1,
                                background: 'none',
                                border: 'none',
                                color: activeTab === 'partner' ? '#818cf8' : 'var(--text-secondary)',
                                padding: '12px 0',
                                fontSize: '0.85rem',
                                fontWeight: activeTab === 'partner' ? 700 : 500,
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'color 0.2s'
                            }}
                        >
                            Partner
                            {activeTab === 'partner' && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: -1,
                                    left: '25%',
                                    right: '25%',
                                    height: 2,
                                    background: 'linear-gradient(90deg,#6366f1,#818cf8)',
                                    borderRadius: 4
                                }} />
                            )}
                        </button>
                    </>
                )}
            </div>

            {/* Event Lists depending on active tab */}
            {activeTab === 'partner' ? (
                <PartnerSearchPanel />
            ) : loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                    Loading experiences...
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#f87171' }}>
                    {error}
                </div>
            ) : (
                <>
                    <EventFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        showCreateButton={role === 'provider'}
                        onCreateClick={() => {
                            setEventToEdit(null);
                            setIsCreateOpen(true);
                        }}
                    />
                    {activeTab === 'browse' && (
                        <EventList
                            events={filteredEvents}
                            role={role}
                            currentUserId={currentUserId}
                            actionLoading={actionLoading}
                            onJoin={joinEvent}
                            onLeave={leaveEvent}
                            onEdit={handleEditClick}
                            onDelete={deleteEvent}
                            onViewDetails={handleViewDetails}
                            emptyMessage="No events match your criteria."
                        />
                    )}

                    {activeTab === 'my-events' && role === 'provider' && (
                        <MyEvents
                            events={filteredEvents}
                            role={role}
                            currentUserId={currentUserId}
                            actionLoading={actionLoading}
                            onEdit={handleEditClick}
                            onDelete={deleteEvent}
                            onViewDetails={handleViewDetails}
                        />
                    )}

                    {activeTab === 'joined-events' && role === 'user' && (
                        <JoinedEvents
                            events={filteredEvents}
                            role={role}
                            currentUserId={currentUserId}
                            actionLoading={actionLoading}
                            onLeave={leaveEvent}
                            onViewDetails={handleViewDetails}
                        />
                    )}
                </>
            )}

            {/* Create & Edit Modal */}
            <CreateEventModal
                isOpen={isCreateOpen}
                eventToEdit={eventToEdit}
                onClose={() => {
                    setIsCreateOpen(false);
                    setEventToEdit(null);
                }}
                onSuccess={refresh}
            />

            {/* Details Modal */}
            <EventDetailsModal
                isOpen={eventToView !== null}
                event={eventToView}
                onClose={() => setEventToView(null)}
                role={role}
            />
        </div>
    );
}
export default EventPage;