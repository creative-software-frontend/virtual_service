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
            background: '#060d1a',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '480px',
            margin: '0 auto',
            position: 'relative',
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Page content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '72px' }}>
                <Outlet />
            </div>

            {/* Bottom navigation */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                height: '64px',
                background: 'rgba(6, 13, 26, 0.97)',
                borderTop: '1px solid rgba(30, 58, 100, 0.5)',
                backdropFilter: 'blur(20px)',
                zIndex: 200,
                boxSizing: 'border-box',
            }}>
                {/* INNER CONTAINER: Perfectly centers navigation nodes on widescreen dashboards */}
                <div style={{
                    maxWidth: '490px', // Matches the exact max-width layout of your top navigation header container
                    width: '100%',
                    height: '100%',
                    margin: '0 auto',  // Master engine centering hook
                    padding: '0 24px', // Mirrors your header's gutter padding exactly
                    display: 'flex',
                    justifyContent: 'space-between', // Creates uniform responsive gaps exactly like the desktop view request
                    alignItems: 'center',
                    boxSizing: 'border-box'
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
                                padding: '0 16px', // Generates premium interactive spacing boxes around elements
                                gap: '5px',
                                textDecoration: 'none',
                                color: isActive ? '#4a9eff' : '#64748b',
                                transition: 'all 0.2s ease-in-out',
                                fontSize: '0.65rem',
                                letterSpacing: '0.12em',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                textShadow: isActive ? '0 0 10px rgba(74, 158, 255, 0.4)' : 'none'
                            })}
                        >
                            {({ isActive }) => (
                                <>
                                    <span style={{
                                        color: isActive ? '#4a9eff' : '#64748b',
                                        display: 'flex',
                                        transform: 'scale(1.15)',
                                        transition: 'transform 0.2s ease',
                                        filter: isActive ? 'drop-shadow(0 0 8px rgba(74, 158, 255, 0.6))' : 'none'
                                    }}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
}
