import { Link } from "react-router-dom";

export function TopNav({ username = "Z", walletBalance = 0 }: { username?: string; walletBalance?: number }) {
    // Bulletproof fallback: handles empty strings, spaces, or missing values safely
    const initial = (username?.trim() || "Z").charAt(0).toUpperCase();

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                width: "100%", // Takes full width on both mobile and desktop
                zIndex: 50,
                background: "var(--bg-overlay)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid var(--border-subtle)",
                /* Generous responsive padding: shifts gracefully from phone edges to wide screens */
                padding: "clamp(12px, 1.5vw, 18px) clamp(16px, 4vw, 40px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxSizing: "border-box",
            }}
        >
            {/* Brand wordmark */}
            <Link
                to="/"
                style={{
                    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                    /* Scales up seamlessly to a prominent 1.5rem on desktop */
                    fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                    /* Automatically scales fluidly because em is relative to the fluid fontSize */
                    letterSpacing: "0.22em",
                    color: "var(--blue-vivid)",
                    fontWeight: 400,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                }}
            >
                BLUEDISE
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1.5vw, 16px)" }}>

                {/* Wallet pill */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(4px, 1vw, 8px)",
                        background: "var(--blue-glow)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: 999,
                        padding: "clamp(5px, 0.8vw, 8px) clamp(10px, 1.5vw, 16px)",
                        color: "var(--text-secondary)",
                        /* Grows comfortably for better readability on desktop layout */
                        fontSize: "clamp(0.72rem, 1vw, 0.88rem)",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                    }}
                >
                    <svg
                        width="clamp(12px, 1.2vw, 16px)"
                        height="clamp(12px, 1.2vw, 16px)"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--blue-vivid)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ flexShrink: 0 }}
                    >
                        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16v4" />
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                        <circle cx="17" cy="14" r="1.2" fill="var(--blue-vivid)" />
                    </svg>
                    ৳{walletBalance}
                </div>

                {/* Avatar */}
                <div
                    style={{
                        /* Upgraded size limit so it doesn't look like a speck on desktop viewports */
                        width: "clamp(32px, 3vw, 42px)",
                        height: "clamp(32px, 3vw, 42px)",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--blue-dim), var(--bg-card))",
                        border: "1px solid var(--border-default)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--blue-vivid)",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "clamp(0.75rem, 1vw, 0.95rem)",
                        flexShrink: 0,
                    }}
                >
                    {initial}
                </div>
            </div>
        </header>
    );
}