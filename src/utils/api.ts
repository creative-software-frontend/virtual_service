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
};
