import { useEffect } from 'react';
import type { ActiveUser } from '../../../../../utils/api';

export function useChatPolling({
    selectedContact,
    loadMessages,
}: {
    selectedContact: ActiveUser | null;
    loadMessages: (contact: ActiveUser) => Promise<void>;
}) {
    useEffect(() => {
        if (!selectedContact) return;

        loadMessages(selectedContact);

        const intervalId = setInterval(() => loadMessages(selectedContact), 4000);

        return () => {
            clearInterval(intervalId);
        };
    }, [selectedContact?.id, loadMessages]);
}

