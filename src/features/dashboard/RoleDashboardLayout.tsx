import type { PropsWithChildren } from 'react';
import { BottomNav } from './DashboardLayout';

export function RoleDashboardLayout({ children }: PropsWithChildren) {
    const contentStyle: React.CSSProperties = {
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))',
    };

    return (
        <div
            style={{
                minHeight: '100svh',
                background: 'var(--bg-main)',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '480px',
                margin: '0 auto',
                position: 'relative',
                fontFamily: "'Inter', sans-serif",
                overflowX: 'hidden',
            }}
        >
            <div style={contentStyle}>{children}</div>
            <BottomNav />
        </div>
    );
}
