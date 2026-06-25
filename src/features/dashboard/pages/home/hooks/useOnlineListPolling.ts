import { useEffect } from 'react';

// NOTE: This hook is intentionally minimal-risk.
// It moves only: loadOnlineList + polling effect + interval cleanup.
// No UI logic, no styling changes, no extra optimization.


export function useOnlineListPolling({
    showOnlineCard,
    isProviderDashboard,
    loadOnlineList,
}: {
    showOnlineCard: boolean;
    isProviderDashboard: boolean;
    loadOnlineList: () => Promise<void>;
}) {
    useEffect(() => {
        if (!showOnlineCard) return;

        loadOnlineList();
        const interval = window.setInterval(loadOnlineList, 10_000);
        return () => window.clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showOnlineCard, isProviderDashboard]);
}

