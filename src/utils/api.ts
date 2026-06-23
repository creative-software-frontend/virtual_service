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

// ── User endpoints ────────────────────────────────────────────────────────────
export const userApi = {
    getProfile: () => request<{ id: number; name: string; email: string; created_at: string }>('/user/profile'),
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
};