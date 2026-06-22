import { Link } from "react-router-dom";

export function TopNav({ username = "Z", walletBalance = 0 }: { username?: string; walletBalance?: number }) {
    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 200,
            width: '100%',
            backgroundColor: 'var(--bg-overlay)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-subtle)',
        }}>
            <div className="navbar-inner" style={{ justifyContent: 'center' }}>
                {/* Brand */}
                <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
                    BLUEDISE
                </Link>
            </div>
        </nav>
    );
}