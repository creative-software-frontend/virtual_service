import { TopNav } from "./TopNav";
import { useAuth } from "../../../context/AuthContext";
import { NewsfeedTab } from "./provider/NewsfeedTab";

export function NewsfeedPage() {
    const { user } = useAuth();

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
            <TopNav />

            {/* Page header */}
            <div style={{
                background: 'linear-gradient(180deg, rgba(99,102,241,0.12) 0%, transparent 100%)',
                borderBottom: '1px solid rgba(99,102,241,0.15)',
                padding: '18px 16px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div>
                    <h2 style={{
                        margin: 0,
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                    }}>
                        Community Feed
                    </h2>
                    <p style={{
                        margin: '3px 0 0',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.04em',
                    }}>
                        Share moments · Connect · Inspire
                    </p>
                </div>

                {/* Live badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: 20,
                    padding: '4px 10px',
                }}>
                    <span style={{
                        width: 6, height: 6,
                        borderRadius: '50%',
                        background: '#34d399',
                        boxShadow: '0 0 6px #34d399',
                        display: 'inline-block',
                        animation: 'pulse 2s infinite',
                    }} />
                    <span style={{ fontSize: '0.65rem', color: '#a5b4fc', fontWeight: 700, letterSpacing: '0.08em' }}>
                        LIVE
                    </span>
                </div>
            </div>

            {/* Feed */}
            <div style={{ padding: '12px 12px 24px' }}>
                <NewsfeedTab myName={user?.username ?? ""} />
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
}
