import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TopNav } from "./TopNav";
import { useAuth } from "../../../context/AuthContext";

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

export function ProfilePage() {
    const navigate = useNavigate();
    const auth = useAuth();
    const user = localStorage.getItem('bluedise_user') || 'member';

    const handleLogout = () => {
        auth.logout();
        navigate('/');
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            style={{ minHeight: '100vh', background: 'var(--bg-main)', width: '100%' }}
        >
            {/* Navigation Header */}
            <TopNav />

            {/* Bottom Nav Border/Divider Line */}
            <div style={{
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(19,34,71,0.1) 0%, var(--border-default) 50%, rgba(19,34,71,0.1) 100%)'
            }} />

            {/* Main Wide Content Viewport Framework */}
            <div style={{
                width: '100%',
                maxWidth: '2400px',
                margin: '0 auto',
                padding: '108px 16px 48px 16px',
                boxSizing: 'border-box'
            }}>

                {/* CRITICAL CHANGE: Widened out to 1100px max layout width boundary */}
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                    {/* Avatar & User info */}
                    <motion.div variants={fadeUp} style={{
                        textAlign: 'center', margin: '0 0 40px 0',
                    }}>
                        <div style={{
                            width: '110px', height: '110px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--blue-neon), var(--blue-vivid))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                            border: '3px solid var(--border-subtle)',
                            fontSize: '3rem', fontWeight: 700, color: '#fff',
                            textTransform: 'uppercase',
                            boxShadow: 'var(--shadow-blue)'
                        }}>
                            {user.charAt(0)}
                        </div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', textTransform: 'capitalize' }}>
                            {user}
                        </h3>
                        <span style={{
                            display: 'inline-block',
                            fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                            color: 'var(--blue-vivid)', fontFamily: "'Inter', sans-serif", fontWeight: 700,
                            background: 'var(--blue-glow)', padding: '6px 18px', borderRadius: '20px',
                            border: '1px solid var(--border-subtle)'
                        }}>
                            Verification Pending
                        </span>
                    </motion.div>

                    {/* Grid Container: Automatically shifts between a widescreen side-by-side double row
                      and standard column layout configurations natively via Flex Wrapping
                    */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '24px',
                        width: '100%'
                    }}>

                        {/* Identity Credentials - Flex Column Left (Takes up remaining space) */}
                        <motion.div variants={fadeUp} style={{
                            flex: '1 1 500px',
                            background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '16px', padding: '32px',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <span style={{
                                display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em',
                                textTransform: 'uppercase', color: 'var(--blue-vivid)', fontWeight: 700,
                                marginBottom: '24px',
                            }}>
                                Identity Credentials
                            </span>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { label: 'Portal ID', value: '#BLD-88291' },
                                    { label: 'Registered Email', value: `${user}@gmail.com` },
                                    { label: 'Role', value: 'Visitor / Free Tier' },
                                    { label: 'Join Date', value: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) },
                                ].map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        fontSize: '0.9rem', paddingBottom: '14px',
                                        borderBottom: '1px solid var(--border-subtle)',
                                    }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Account Actions - Flex Column Right (Fixed wider layout context) */}
                        <motion.div variants={fadeUp} style={{
                            flex: '1 1 380px',
                            background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '16px', padding: '32px',
                            display: 'flex', flexDirection: 'column', gap: '16px',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <span style={{
                                display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em',
                                textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700,
                                marginBottom: '8px',
                            }}>
                                Account Management
                            </span>

                            <button
                                style={{
                                    width: '100%', padding: '16px',
                                    background: 'transparent', border: '1px solid var(--border-subtle)',
                                    borderRadius: '10px', color: 'var(--blue-vivid)',
                                    fontSize: '0.85rem', fontWeight: 600,
                                    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => navigate('../network')}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-glow)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                Referral
                            </button>

                            <button style={{
                                width: '100%', padding: '16px',
                                background: 'transparent', border: '1px solid var(--border-subtle)',
                                borderRadius: '10px', color: 'var(--blue-vivid)',
                                fontSize: '0.85rem', fontWeight: 600,
                                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-glow)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                Change Password
                            </button>


                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%', padding: '16px',
                                    background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: '10px', color: 'var(--red-status)',
                                    fontSize: '0.85rem', fontWeight: 600,
                                    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)'}
                            >
                                Sign Out
                            </button>
                        </motion.div>

                    </div>
                </div>

            </div>
        </motion.div>
    );
}