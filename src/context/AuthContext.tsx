import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'admin' | 'user' | 'provider';

export interface AuthUser {
    id?: number;
    email: string;
    role: Role;
    username: string;  // maps to `name` from backend
    token: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (user: AuthUser) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'bluedise_auth_session';
const TOKEN_KEY = 'bluedise_token';

function loadSession(): AuthUser | null {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(loadSession);

    const login = (userData: AuthUser) => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
        localStorage.setItem(TOKEN_KEY, userData.token);
        // also write legacy key so old code doesn't break
        localStorage.setItem('bluedise_user', userData.username);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('bluedise_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
