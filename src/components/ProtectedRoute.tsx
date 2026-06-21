import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isAuthenticated } = useAuth();
    const { role } = useParams<{ role: string }>();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to their own dashboard
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    if (role && user && role !== user.role) {
        // Prevent accessing another role's dashboard
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    return <>{children}</>;
}
