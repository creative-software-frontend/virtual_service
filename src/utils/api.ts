// Central API utility — all backend calls go through here
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    status: number;
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('bluedise_token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const res = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers,
            credentials: 'include',
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            return {
                status: res.status,
                error: json.message || `Request failed (${res.status})`,
            };
        }

        return { status: res.status, data: json as T };
    } catch {
        return { status: 0, error: 'Network error — is the backend running?' };
    }
}

// ── Auth endpoints ────────────────────────────────────────────────────────────

export interface RegisterPayload {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'user' | 'provider';
    privacyAccepted?: boolean;
}


export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponseData {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'provider';
    token: string;
}

export const authApi = {
    register: (payload: RegisterPayload) =>
        request<AuthResponseData>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    login: (payload: LoginPayload) =>
        request<AuthResponseData>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),
};

export interface Transaction {
    id: number;
    type: 'deposit' | 'withdraw' | 'earning';
    amount: number;
    status: string;
    description: string;
    created_at: string;
}

export interface WalletResponse {
    balance: number;
    earnings: number;
    role: string;
    transactions: Transaction[];
}

// ── User endpoints ────────────────────────────────────────────────────────────
export interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
    gender: string | null;
    date_of_birth: string | null;
    profession: string | null;
    education: string | null;
    location: string | null;
    bio: string | null;
    interests: string | null;
    relationship_goal: string | null;
    marital_status: string | null;
    avatar_url: string | null;
    role: 'admin' | 'user' | 'provider';
    created_at: string;
}

export interface UpdateUserProfilePayload {
    // editable fields only
    name?: string;
    phone?: string;
    gender?: string | null;
    date_of_birth?: string | null; // YYYY-MM-DD
    profession?: string | null;
    education?: string | null;
    location?: string | null;
    bio?: string | null;
    interests?: string | null;
    relationship_goal?: string | null;
    marital_status?: string | null;
    avatar_url?: string | null; // base64 data URL
}

export const userApi = {
    getProfile: () =>
        request<UserProfile>('/user/profile'),

    updateProfile: (payload: UpdateUserProfilePayload) =>
        request<UserProfile>('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),

    getWallet: () => request<WalletResponse>('/user/wallet'),
    deposit: (amount: number) => request<{ message: string; amount: number }>('/user/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount }),
    }),
    withdraw: (amount: number) => request<{ message: string; amount: number }>('/user/withdraw', {
        method: 'POST',
        body: JSON.stringify({ amount }),
    }),
};


// ── Provider endpoints ────────────────────────────────────────────────────────
export const providerApi = {
    getDashboard: () => request<{ message: string }>('/provider/dashboard'),
    getOnlineProviders: () =>
        request<Array<{ id: number; name: string; last_seen: string | null; is_online: number }>>(
            '/provider/online-providers'
        ),
    getOnlineUsers: () =>
        request<Array<{ id: number; name: string; last_seen: string | null; is_online: number }>>(
            '/provider/online-users'
        ),
};

// ── Social / Service endpoints ─────────────────────────────────────────────────

export interface Post {
    id: number;
    content: string;
    image_url: string | null;
    created_at: string;
    user_id: number;
    author_name: string;
    author_role: string;
}

export interface ChatMessage {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    created_at: string;
    sender_name: string;
}

export interface ActiveUser {
    id: number;
    name: string;
    last_seen: string | null;
    is_online: number;
}

export const serviceApi = {
    getPosts: () => request<Post[]>('/provider/posts'),
    createPost: (content: string, image_url?: string | null) =>
        request<Post>('/provider/posts', {
            method: 'POST',
            body: JSON.stringify({ content, image_url: image_url ?? null }),
        }),
    getMessages: (partnerId: number) =>
        request<ChatMessage[]>(`/provider/messages?with=${partnerId}`),
    sendMessage: (receiver_id: number, message: string) =>
        request<{ id: number; sender_id: number; receiver_id: number; message: string }>(
            '/provider/messages',
            { method: 'POST', body: JSON.stringify({ receiver_id, message }) }
        ),
    getActiveProviders: () =>
        request<ActiveUser[]>('/provider/active-providers'),
};
// ── Admin endpoints ────────────────────────────────────────────────────────────

export interface UserInfo {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    is_active: number;
    created_at: string;
}

export interface UsersSummaryData {
    totalUsers: number;
    totalProviders: number;
    users: UserInfo[];
    providers: UserInfo[];
}

export interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    duration_days: number;
    duration_months: number;
    tier_type: 'starter' | 'premium' | 'elite';
    features: string;
    is_active: number;
    created_at: string;
}

export interface CreatePackagePayload {
    name: string;
    description: string;
    price: number;
    duration_days: number;
    duration_months: number;
    tier_type: 'starter' | 'premium' | 'elite';
    features: string;
}

export interface PlatformRate {
    id: number;
    rate_key: string;
    rate_value: number;
    label: string;
    updated_at: string;
}

export interface LedgerEntry {
    id: number;
    type: 'deposit' | 'withdraw' | 'earning';
    amount: number;
    status: string;
    description: string;
    created_at: string;
    user_id: number;
    user_name: string;
    user_role: string;
}

export interface TopAccount {
    id: number;
    name: string;
    role: string;
    total_deposited?: number;
    total_earned?: number;
}

export interface ReportsData {
    stats: {
        totalDeposits: number;
        totalWithdrawals: number;
        totalEarnings: number;
        netHoldings: number;
        totalUsers: number;
        totalProviders: number;
    };
    topDepositors: TopAccount[];
    topEarners: TopAccount[];
    ledger: LedgerEntry[];
}

export const adminApi = {
    getUsersSummary: () =>
        request<UsersSummaryData>('/admin/users-summary'),

    getPublicPackages: () =>
        request<Package[]>('/admin/packages/public'),

    getPackages: () =>
        request<Package[]>('/admin/packages'),

    createPackage: (payload: CreatePackagePayload) =>
        request<Package>('/admin/packages', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    deletePackage: (id: number) =>
        request<{ message: string }>(`/admin/packages/${id}`, { method: 'DELETE' }),

    getRates: () =>
        request<PlatformRate[]>('/admin/rates'),

    updateRate: (key: string, rate_value: number) =>
        request<{ message: string; rate_key: string; rate_value: number }>(
            `/admin/rates/${key}`,
            { method: 'PUT', body: JSON.stringify({ rate_value }) }
        ),

    toggleUserActive: (id: number) =>
        request<{ message: string; is_active: number }>(
            `/admin/users/${id}/toggle-active`,
            { method: 'PUT' }
        ),

    getReports: () =>
        request<ReportsData>('/admin/reports'),
};

// ── Event endpoints ────────────────────────────────────────────────────────────

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
    joined?: number; // 1 or 0
}

export interface EventParticipant {
    id: number;
    name: string;
    email: string;
    joined_at: string;
}

export const eventApi = {
    getEvents: (role: string) =>
        request<Event[]>(`/${role}/events`),

    createEvent: (payload: { title: string; description: string; date_time: string; location: string; capacity: number }) =>
        request<Event>('/provider/events', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    updateEvent: (id: number, payload: { title: string; description: string; date_time: string; location: string; capacity: number; status: string }) =>
        request<Event>(`/provider/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),

    deleteEvent: (id: number) =>
        request<{ message: string }>(`/provider/events/${id}`, {
            method: 'DELETE',
        }),

    joinEvent: (id: number) =>
        request<{ message: string }>(`/user/events/${id}/join`, {
            method: 'POST',
        }),

    leaveEvent: (id: number) =>
        request<{ message: string }>(`/user/events/${id}/leave`, {
            method: 'POST',
        }),

    getParticipants: (id: number) =>
        request<EventParticipant[]>(`/provider/events/${id}/participants`),
};