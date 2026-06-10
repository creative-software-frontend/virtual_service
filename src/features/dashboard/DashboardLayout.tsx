import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const NAV = [
    {
        to: '/dashboard',
        end: true,
        label: 'HOME',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        to: '/dashboard/membership',
        end: false,
        label: 'MEMBERSHIP',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
            </svg>
        ),
    },
    {
        to: '/dashboard/assets',
        end: false,
        label: 'ASSETS',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" />
            </svg>
        ),
    },
    {
        to: '/dashboard/network',
        end: false,
        label: 'NETWORK',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3" /><circle cx="5" cy="19" r="3" /><circle cx="19" cy="19" r="3" />
                <line x1="12" y1="8" x2="5" y2="16" /><line x1="12" y1="8" x2="19" y2="16" />
            </svg>
        ),
    },
    {
        to: '/dashboard/profile',
        end: false,
        label: 'PROFILE',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
];

export function DashboardLayout() {
    const navigate = useNavigate();
    const user = localStorage.getItem('bluedise_user');

    useEffect(() => {
        if (!user) navigate('/login', { replace: true });
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div style={{
            minHeight: '100svh',
            background: 'var(--bg-main)',
            display: 'flex',
            flexDirection: 'column',
            /* On mobile: full 100vw. On larger screens, cap at 480px centered */
            width: '100%',
            maxWidth: '480px',
            margin: '0 auto',
            position: 'relative',
            fontFamily: "'Inter', sans-serif",
            overflowX: 'hidden',
        }}>
            {/* Page content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                /* Bottom padding = bottom nav height + safe area */
                paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))',
            }}>
                <Outlet />
            </div>

            {/* Bottom navigation — full viewport width, content centred at 480px */}
            <nav
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: '100%',   /* Full width on all screen sizes */
                    height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
                    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                    background: 'var(--bg-nav)',
                    borderTop: '1px solid var(--border-subtle)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 200,
                    boxSizing: 'border-box',
                }}
            >
                {/* Inner row: centred at 480px so icons stay aligned with page content */}
                <div style={{
                    maxWidth: '480px',
                    width: '100%',
                    height: '64px',
                    margin: '0 auto',
                    padding: '0 clamp(8px, 3vw, 16px)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                }}>
                    {NAV.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            style={({ isActive }) => ({
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                flex: 1,
                                padding: '0 2px',
                                gap: '4px',
                                textDecoration: 'none',
                                color: isActive ? 'var(--blue-vivid)' : 'var(--text-secondary)',
                                transition: 'all 0.2s ease-in-out',
                                /* clamp: min 0.52rem, fluid 1.8vw, max 0.65rem */
                                fontSize: 'clamp(0.52rem, 1.8vw, 0.65rem)',
                                letterSpacing: '0.06em',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                textShadow: isActive ? '0 0 10px var(--blue-glow)' : 'none',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                            })}
                        >
                            {({ isActive }) => (
                                <>
                                    <span style={{
                                        color: isActive ? 'var(--blue-vivid)' : 'var(--text-secondary)',
                                        display: 'flex',
                                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'transform 0.2s ease',
                                        filter: isActive ? 'drop-shadow(0 0 8px var(--blue-vivid))' : 'none',
                                    }}>
                                        {item.icon}
                                    </span>
                                    <span style={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        width: '100%',
                                        textAlign: 'center',
                                    }}>
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
}
