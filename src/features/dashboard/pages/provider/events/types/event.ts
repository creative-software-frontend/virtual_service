export interface Event {
    id: number;
    title: string;
    description: string | null;
    date_time: string;
    location: string;
    capacity: number;
    creator_id: number;
    creator_name?: string;
    status: 'active' | 'cancelled' | 'completed';
    created_at: string;
    participant_count: number;
    joined?: number; // 1 = true, 0 = false (for user joined status)
}

export interface EventParticipant {
    id: number;
    name: string;
    email: string;
    joined_at: string;
}
