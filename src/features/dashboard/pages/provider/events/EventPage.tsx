import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import { useMembership } from '../../../../../context/MembershipContext';
import { useEvents } from './hooks/useEvents';
import { EventFilters } from './EventFilters';
import { EventList } from './EventList';
import { MyEvents } from './MyEvents';
import { JoinedEvents } from './JoinedEvents';
import { CreateEventModal } from './CreateEventModal';
import { EventDetailsModal } from './EventDetailsModal';
import { JoinEventModal } from './JoinEventModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import type { Event } from './types/event';
import { PartnerSearchPanel } from '../../partner/PartnerSearchPanel';
import { PartnerRequestsPanel } from '../../partner/PartnerRequestsPanel';
import { FeatureGate } from '../../../../../components/FeatureGate';

export function EventPage() {
    const { role = 'user' } = useParams<{ role: string }>();
    const { user } = useAuth();
    const { hasFeature } = useMembership();
    const currentUserId = user?.id ?? 0;

    const userRole = user?.role ?? role;

    // Provider-only features are DB-driven via the `features` table
    // (provider_my_events / provider_browse_events). A provider WITHOUT an
    // active membership is FREE and must NOT be able to create events or
    // view/handle partner requests — those are locked until they upgrade.
    const providerHasMembership = userRole === 'provider' && hasFeature('MY_EVENTS');

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

    // Providers can create events ONLY with an active membership. The backend
    // enforces the MY_EVENTS feature gate on POST /provider/events, and the
    // Create Event tab is hidden for FREE providers (no active membership).
    // Users never create events.
    const canCreateEvent = providerHasMembership;

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeTab, setActiveTab] = useState<'browse' | 'my-events' | 'joined-events' | 'partner' | 'requests'>('browse');

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [eventToView, setEventToView] = useState<Event | null>(null);
    const [eventToJoin, setEventToJoin] = useState<Event | null>(null);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

    const handleEditClick = (event: Event) => {
        setEventToEdit(event);
        setIsCreateOpen(true);
    };

    const handleViewDetails = (event: Event) => {
        setEventToView(event);
    };

    const handleDeleteClick = (event: Event) => {
        setEventToDelete(event);
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
                borderBottom: '1px solid var(--gold-border)',
                marginBottom: 8
            }}>
                <button
                    onClick={() => setActiveTab('browse')}
                    style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        color: activeTab === 'browse' ? 'var(--gold-mid)' : 'var(--text-secondary)',
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
                            background: 'linear-gradient(90deg, var(--gold-rich), var(--gold-deep))',
                            borderRadius: 4
                        }} />
                    )}
                </button>

                {userRole === 'provider' && providerHasMembership && (
                    <button
                        onClick={() => setActiveTab('my-events')}
                        style={{
                            flex: 1,
                            background: 'none',
                            border: 'none',
                            color: activeTab === 'my-events' ? 'var(--gold-mid)' : 'var(--text-secondary)',
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
                                background: 'linear-gradient(90deg, var(--gold-rich), var(--gold-deep))',
                                borderRadius: 4
                            }} />
                        )}
                    </button>
                )}

                {userRole === 'provider' && canCreateEvent && providerHasMembership && (
                    <button
                        onClick={() => {
                            setEventToEdit(null);
                            setIsCreateOpen(true);
                        }}
                        style={{
                            flex: 1,
                            background: 'none',
                            border: 'none',
                            color: isCreateOpen ? 'var(--gold-mid)' : 'var(--text-secondary)',
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
                                background: 'linear-gradient(90deg, var(--gold-rich), var(--gold-deep))',
                                borderRadius: 4
                            }} />
                        )}
                    </button>
                )}

                {userRole === 'provider' && providerHasMembership && (
                    <button
                        onClick={() => setActiveTab('requests')}
                        style={{
                            flex: 1,
                            background: 'none',
                            border: 'none',
                            color: activeTab === 'requests' ? 'var(--gold-mid)' : 'var(--text-secondary)',
                            padding: '12px 0',
                            fontSize: '0.85rem',
                            fontWeight: activeTab === 'requests' ? 700 : 500,
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'color 0.2s'
                        }}
                    >
                        Requests
                        {activeTab === 'requests' && (
                            <span style={{
                                position: 'absolute',
                                bottom: -1,
                                left: '25%',
                                right: '25%',
                                height: 2,
                                background: 'linear-gradient(90deg, var(--gold-rich), var(--gold-deep))',
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
                                color: activeTab === 'joined-events' ? 'var(--gold-mid)' : 'var(--text-secondary)',
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
                                    background: 'linear-gradient(90deg, var(--gold-rich), var(--gold-deep))',
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
                                color: activeTab === 'partner' ? 'var(--gold-mid)' : 'var(--text-secondary)',
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
                                    background: 'linear-gradient(90deg, var(--gold-rich), var(--gold-deep))',
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
            ) : userRole === 'provider' && !providerHasMembership && (activeTab === 'requests' || activeTab === 'my-events') ? (
                // FREE provider: events + requests are locked until they upgrade.
                <FeatureGate feature="MY_EVENTS" fullPage requiredTier="Provider">
                    <></>
                </FeatureGate>
            ) : activeTab === 'requests' ? (
                <PartnerRequestsPanel />
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
                                onDelete={(id) => {
                                    const ev = events.find(e => e.id === id);
                                    if (ev) handleDeleteClick(ev);
                                }}
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
                                onDelete={(id) => {
                                    const ev = events.find(e => e.id === id);
                                    if (ev) handleDeleteClick(ev);
                                }}
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

            {/* Delete Event confirmation modal */}
            <ConfirmDeleteModal
                isOpen={eventToDelete !== null}
                itemName={eventToDelete?.title}
                onConfirm={() => deleteEvent(eventToDelete!.id)}
                onSuccess={refresh}
                onClose={() => setEventToDelete(null)}
            />
        </div>
    );
}
export default EventPage;