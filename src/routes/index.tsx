import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        lazy: async () => {
            const { LandingPage } = await import("../features/landing/LandingPage");
            return { element: <LandingPage /> };
        },
    },
    {
        path: "/login",
        lazy: async () => {
            const { AuthPage } = await import("../features/auth/AuthPage");
            return { element: <AuthPage /> };
        },
    },
    {
        path: "/signup",
        lazy: async () => {
            const { AuthPage } = await import("../features/auth/AuthPage");
            return { element: <AuthPage /> };
        },
    },
    {
        path: "/provider/register",
        lazy: async () => {
            const { ProviderRegisterPage } = await import("../features/auth/ProviderRegisterPage");
            return { element: <ProviderRegisterPage /> };
        },
    },
    // ── Unified Role Dashboard ──────────────────────────────────────────────
    {
        path: "/:role/dashboard",
        lazy: async () => {
            const { DashboardLayout } = await import("../features/dashboard/DashboardLayout");
            return {
                element: (
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                )
            };
        },
        children: [
            {
                index: true,
                lazy: async () => {
                    const { DashboardHome } = await import("../features/dashboard/pages/DashboardHome");
                    return { element: <DashboardHome /> };
                }
            },
            {
                path: "membership",
                lazy: async () => {
                    const { MembershipPage } = await import("../features/dashboard/pages/MembershipPage");
                    return { element: <MembershipPage /> };
                }
            },
            {
                path: "assets",
                lazy: async () => {
                    const { AssetsPage } = await import("../features/dashboard/pages/AssetsPage");
                    return { element: <AssetsPage /> };
                }
            },
            {
                path: "network",
                lazy: async () => {
                    const { NetworkPage } = await import("../features/dashboard/pages/NetworkPage");
                    return { element: <NetworkPage /> };
                }
            },
            {
                path: "profile",
                lazy: async () => {
                    const { ProfilePage } = await import("../features/dashboard/pages/ProfilePage");
                    return { element: <ProfilePage /> };
                }
            },
            {
                path: "models",
                lazy: async () => {
                    const { ModelsPage } = await import("../features/dashboard/pages/ModelsPage");
                    return { element: <ModelsPage /> };
                }
            }
            ,
           {
             path: "users",
             lazy: async () => {
             const { AdminUsersPage } = await import("../features/dashboard/pages/AdminUsersPage");
             return { element: <AdminUsersPage /> };
                }
            },
            {
                path: "settings",
                lazy: async () => {
                    const { AdminSettingsPage } = await import("../features/dashboard/pages/AdminSettingsPage");
                    return { element: <AdminSettingsPage /> };
                }
            }
        ]
    }
]);
