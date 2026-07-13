import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function MembershipUpgradeButton({
  children,
  className,
  style,
  variant = 'primary',
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary';
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const membershipRoute =
    user?.role === 'provider'
      ? '/provider/dashboard/membership'
      : '/user/dashboard/membership';

  return (
    <button
      type="button"
      className={className}
      style={
        style ??
        (variant === 'secondary'
          ? {
              marginTop: 4,
              padding: '7px 18px',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 8,
              color: '#818cf8',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }
          : {
              marginTop: 8,
              padding: '13px 32px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 24px rgba(99,102,241,0.4)',
              fontFamily: "'Inter', sans-serif",
              transition: 'opacity 0.2s',
            })
      }
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.opacity = '1';
      }}
      onClick={() => navigate(membershipRoute)}
    >
      {children ?? 'View Membership Plans'}
    </button>
  );
}

