import { createBrowserRouter } from "react-router-dom";

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
    // Extra client portals (e.g., /hub, /directory) go here...
]);
