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
import { JoinEventModal } from './JoinEventModal';
import type { Event } from './types/event';
import { PartnerSearchPanel } from '../../partner/PartnerSearchPanel';
import { FeatureGate } from '../../../../../components/FeatureGate';

export function EventPage() {
    const { role = 'user' } = useParams<{ role: string }>();
    const { user } = useAuth();
    const currentUserId = user?.id ?? 0;

    // Use the authenticated user's role (not the URL param) to decide which
    // navigation items are visible. The backend still enforces the actual
    // permissions (e.g. requireFeature("MY_EVENTS") on POST /provider/events),
    // so we only gate the UI here.
    const userRole = user?.role ?? role;

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

    // Providers can create events; the backend still enforces the MY_EVENTS
    // feature gate on POST /provider/events. Users never create events.
    // Visibility is driven by role only (not the membership feature), so the
    // Create Event item is always shown to providers.
    const canCreateEvent = userRole === 'provider';

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeTab, setActiveTab] = useState<'browse' | 'my-events' | 'joined-events' | 'partner'>('browse');

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [eventToView, setEventToView] = useState<Event | null>(null);
    const [eventToJoin, setEventToJoin] = useState<Event | null>(null);

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

                {userRole === 'provider' && (
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

                {userRole === 'provider' && canCreateEvent && (
                    <button
                        onClick={() => {
                            setEventToEdit(null);
                            setIsCreateOpen(true);
                        }}
                        style={{
                            flex: 1,
                            background: 'none',
                            border: 'none',
                            color: isCreateOpen ? '#818cf8' : 'var(--text-secondary)',
                            padding: '12px 0',
                            fontSize: '0.85rem',
                            fontWeight: isCreateOpen ? 700 : 500,
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'color 0.2s'
                        }}
                    >
                        Create Event
                        {isCreateOpen && (
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

                {userRole === 'user' && (
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
                        showCreateButton={false}
                    />
                    {activeTab === 'browse' && (
                        <FeatureGate
                            feature={userRole === 'provider' ? 'BROWSE_EVENTS' : 'EVENT_ACCESS'}
                            fullPage
                            requiredTier={userRole === 'provider' ? 'Provider' : 'Platinum'}
                        >
                            <EventList
                                events={filteredEvents}
                                role={role}
                                currentUserId={currentUserId}
                                actionLoading={actionLoading}
                                onJoin={(id) => {
                                    const ev = events.find(e => e.id === id);
                                    if (ev) setEventToJoin(ev);
                                }}
                                onLeave={leaveEvent}
                                onEdit={handleEditClick}
                                onDelete={deleteEvent}
                                onViewDetails={handleViewDetails}
                                emptyMessage="No events match your criteria."
                            />
                        </FeatureGate>
                    )}

                    {activeTab === 'my-events' && userRole === 'provider' && (
                        <FeatureGate feature="MY_EVENTS" fullPage requiredTier="Provider">
                            <MyEvents
                                events={filteredEvents}
                                role={role}
                                currentUserId={currentUserId}
                                actionLoading={actionLoading}
                                onEdit={handleEditClick}
                                onDelete={deleteEvent}
                                onViewDetails={handleViewDetails}
                            />
                        </FeatureGate>
                    )}

                    {activeTab === 'joined-events' && userRole === 'user' && (
                        <FeatureGate feature="EVENT_ACCESS" fullPage requiredTier="Platinum">
                            <JoinedEvents
                                events={filteredEvents}
                                role={role}
                                currentUserId={currentUserId}
                                actionLoading={actionLoading}
                                onLeave={leaveEvent}
                                onViewDetails={handleViewDetails}
                            />
                        </FeatureGate>
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

            {/* Join Event confirmation modal */}
            <JoinEventModal
                isOpen={eventToJoin !== null}
                event={eventToJoin}
                onClose={() => setEventToJoin(null)}
                onJoin={joinEvent}
                onSuccess={refresh}
            />
        </div>
    );
}
export default EventPage;