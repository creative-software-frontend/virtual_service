import { Link } from "react-router-dom";

export function TopNav({ username = "Z", walletBalance = 0 }: { username?: string; walletBalance?: number }) {
    const initial = username.charAt(0).toUpperCase();

    return (
        <header
            style={{
                position: "fixed", // Changed from sticky to fixed to break out of parent layout constraints
                top: 0,
                left: 0,
                right: 0,          // Explicitly anchors it to both left and right edges of the screen
                width: "100vw",    // Forces it to match 100% of the viewport width
                zIndex: 50,
                background: "rgba(6, 13, 26, 0.92)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(59,130,246,0.12)",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxSizing: "border-box",
            }}
        >
            <Link
                to="/"
                style={{
                    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                    fontSize: "1.35rem",
                    letterSpacing: "0.28em",
                    color: "#4a9eff",
                    fontWeight: 400,
                    textDecoration: "none",
                }}
            >
                BLUEDISE
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Wallet pill */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "rgba(30,58,100,0.45)",
                        border: "1px solid rgba(59,130,246,0.3)",
                        borderRadius: 999,
                        padding: "6px 12px",
                        color: "#cbd5e1",
                        fontSize: "0.78rem",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16v4" />
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                        <circle cx="17" cy="14" r="1.2" fill="#4a9eff" />
                    </svg>
                    ৳{walletBalance}
                </div>

                {/* Avatar */}
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1e3a6e, #0d1e3d)",
                        border: "1px solid rgba(74,158,255,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#4a9eff",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                    }}
                >
                    {initial}
                </div>
            </div>
        </header>
    );
}