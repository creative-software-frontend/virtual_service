import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === '/login';
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        // Extract username from email (before @)
        const user = isLogin
            ? (email.split('@')[0] || 'member')
            : (username || email.split('@')[0] || 'member');
        localStorage.setItem('bluedise_user', user);
        navigate('/dashboard');
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-main)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background glows */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '800px', height: '500px', borderRadius: '50%',
                    background: 'radial-gradient(ellipse, var(--blue-glow) 0%, transparent 70%)',
                }} />
                <div style={{
                    position: 'absolute', top: '20%', left: '30%',
                    width: '400px', height: '300px', borderRadius: '50%',
                    background: 'var(--blue-glow)', filter: 'blur(80px)',
                }} />
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.12,
                    backgroundImage: 'radial-gradient(circle, var(--blue-glow) 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                }} />
            </div>

            {/* Card */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '440px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: '20px',
                padding: '40px 36px',
                boxShadow: 'var(--shadow-lg)',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
                    background: 'linear-gradient(90deg, transparent, var(--blue-vivid), transparent)',
                }} />

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '2rem', letterSpacing: '0.2em',
                        color: 'var(--gold-mid)', fontWeight: 400, marginBottom: '6px',
                    }}>
                        BLUEDISE
                    </h1>
                    <span style={{
                        display: 'block', fontSize: '0.6rem', letterSpacing: '0.3em',
                        textTransform: 'uppercase', color: 'var(--text-muted)',
                        fontFamily: "'Inter', sans-serif", fontWeight: 600,
                    }}>
                        Member Portal
                    </span>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex', background: 'var(--bg-nav)',
                    borderRadius: '8px', padding: '4px',
                    border: '1px solid var(--border-subtle)', marginBottom: '28px',
                }}>
                    <Link to="/signup" style={{
                        flex: 1, textAlign: 'center', padding: '9px 0',
                        fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                        fontWeight: 600, fontFamily: "'Inter', sans-serif",
                        textDecoration: 'none', borderRadius: '5px', transition: 'all 0.2s',
                        color: !isLogin ? 'var(--text-primary)' : 'var(--text-muted)',
                        background: !isLogin ? 'var(--blue-glow)' : 'transparent',
                    }}>Register</Link>
                    <Link to="/login" style={{
                        flex: 1, textAlign: 'center', padding: '9px 0',
                        fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                        fontWeight: 600, fontFamily: "'Inter', sans-serif",
                        textDecoration: 'none', borderRadius: '5px', transition: 'all 0.2s',
                        color: isLogin ? 'var(--text-primary)' : 'var(--text-muted)',
                        background: isLogin ? 'var(--blue-glow)' : 'transparent',
                    }}>Sign In</Link>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '10px 14px', background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
                        color: '#fca5a5', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif",
                        marginBottom: '18px',
                    }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {/* Username (signup only) */}
                    {!isLogin && (
                        <div>
                            <label style={{
                                display: 'block', fontSize: '0.6rem', letterSpacing: '0.18em',
                                textTransform: 'uppercase', color: 'var(--text-muted)',
                                fontFamily: "'Inter', sans-serif", fontWeight: 600, marginBottom: '8px',
                            }}>Username</label>
                            <input
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 16px',
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: '8px', color: 'var(--text-primary)',
                                    fontSize: '0.875rem', fontFamily: "'Inter', sans-serif",
                                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold-mid)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label style={{
                            display: 'block', fontSize: '0.6rem', letterSpacing: '0.18em',
                            textTransform: 'uppercase', color: 'var(--text-muted)',
                            fontFamily: "'Inter', sans-serif", fontWeight: 600, marginBottom: '8px',
                        }}>
                            {isLogin ? 'Email or Username' : 'Email Address'}
                        </label>
                        <input
                            type="email"
                            placeholder={isLogin ? 'your@email.com' : 'your@email.com'}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px',
                                background: 'var(--bg-input)',
                                border: '1px solid var(--border-default)',
                                borderRadius: '8px', color: 'var(--text-primary)',
                                fontSize: '0.875rem', fontFamily: "'Inter', sans-serif",
                                outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold-mid)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{
                            display: 'block', fontSize: '0.6rem', letterSpacing: '0.18em',
                            textTransform: 'uppercase', color: 'var(--text-muted)',
                            fontFamily: "'Inter', sans-serif", fontWeight: 600, marginBottom: '8px',
                        }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 44px 12px 16px',
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: '8px', color: 'var(--text-primary)',
                                    fontSize: '0.875rem', fontFamily: "'Inter', sans-serif",
                                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold-mid)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
                            />
                            <button type="button" onClick={() => setShowPass(v => !v)} style={{
                                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer',
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password (signup only) */}
                    {!isLogin && (
                        <div>
                            <label style={{
                                display: 'block', fontSize: '0.6rem', letterSpacing: '0.18em',
                                textTransform: 'uppercase', color: 'var(--text-muted)',
                                fontFamily: "'Inter', sans-serif", fontWeight: 600, marginBottom: '8px',
                            }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Repeat password"
                                    style={{
                                        width: '100%', padding: '12px 44px 12px 16px',
                                        background: 'var(--bg-input)',
                                        border: '1px solid var(--border-default)',
                                        borderRadius: '8px', color: 'var(--text-primary)',
                                        fontSize: '0.875rem', fontFamily: "'Inter', sans-serif",
                                        outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                                    }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold-mid)')}
                                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
                                />
                                <button type="button" onClick={() => setShowConfirm(v => !v)} style={{
                                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer',
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <button type="submit" style={{
                        width: '100%', padding: '14px', marginTop: '4px',
                        background: 'linear-gradient(135deg, var(--blue-neon), var(--blue-vivid))',
                        border: 'none', borderRadius: '8px', color: '#fff',
                        fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                        fontWeight: 700, fontFamily: "'Inter', sans-serif",
                        cursor: 'pointer', boxShadow: 'var(--shadow-blue)',
                        transition: 'filter 0.2s, transform 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        {isLogin ? 'Secure Sign In' : 'Create Account'}
                    </button>
                </form>

                {/* Footer link */}
                <p style={{
                    textAlign: 'center', marginTop: '24px',
                    fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", color: 'var(--text-muted)',
                }}>
                    {isLogin ? (
                        <>New to BLUEdise?{' '}
                            <Link to="/signup" style={{ color: 'var(--blue-vivid)', textDecoration: 'none', fontWeight: 500 }}>Create an account</Link>
                        </>
                    ) : (
                        <>Already a member?{' '}
                            <Link to="/login" style={{ color: 'var(--blue-vivid)', textDecoration: 'none', fontWeight: 500 }}>Sign in here</Link>
                        </>
                    )}
                </p>
                <p style={{
                    textAlign: 'center', marginTop: '20px',
                    fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif",
                }}>
                    © 2026 BLUEDISE SECURED PORTAL
                </p>
            </div>
        </div>
    );
}
