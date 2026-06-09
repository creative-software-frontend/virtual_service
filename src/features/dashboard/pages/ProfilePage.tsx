import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TopNav } from "./TopNav";

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
    const user = localStorage.getItem('bluedise_user') || 'member';

    const handleLogout = () => {
        localStorage.removeItem('bluedise_user');
        navigate('/');
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            style={{ minHeight: '100vh', background: '#060d1a', width: '100%' }}
        >
            {/* Navigation Header */}
            <TopNav />

            {/* Bottom Nav Border/Divider Line */}
            <div style={{
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(19,34,71,0.1) 0%, rgba(19,34,71,0.8) 50%, rgba(19,34,71,0.1) 100%)'
            }} />

            {/* Main Wide Content Viewport Framework */}
            <div style={{
                width: '100%',
                maxWidth: '2400px',
                margin: '0 auto',
                padding: '108px 40px 48px 40px', // Increased side padding for elegant wide display
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
                            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                            border: '3px solid rgba(59,130,246,0.3)',
                            fontSize: '3rem', fontWeight: 700, color: '#fff',
                            textTransform: 'uppercase',
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
                        }}>
                            {user.charAt(0)}
                        </div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px', textTransform: 'capitalize' }}>
                            {user}
                        </h3>
                        <span style={{
                            display: 'inline-block',
                            fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                            color: '#3b82f6', fontFamily: "'Inter', sans-serif", fontWeight: 700,
                            background: 'rgba(30,58,100,0.4)', padding: '6px 18px', borderRadius: '20px',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
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
                            flex: '1 1 500px', // Dynamically grows wide, shrinks up to 500px min-width
                            background: 'linear-gradient(135deg, #0a122c, #070d22)',
                            border: '1px solid #132247',
                            borderRadius: '16px', padding: '32px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                        }}>
                            <span style={{
                                display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em',
                                textTransform: 'uppercase', color: '#4a9eff', fontWeight: 700,
                                marginBottom: '24px',
                            }}>
                                Identity Credentials
                            </span>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { label: 'Portal ID', value: '#BLD-88291' },
                                    { label: 'Registered Email', value: `${user}@gmail.com` },
                                    { label: 'Role Level', value: 'Visitor / Free Tier' },
                                    { label: 'Join Date', value: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) },
                                ].map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        fontSize: '0.9rem', paddingBottom: '14px',
                                        borderBottom: '1px solid #132247',
                                    }}>
                                        <span style={{ color: '#64748b' }}>{item.label}</span>
                                        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Account Actions - Flex Column Right (Fixed wider layout context) */}
                        <motion.div variants={fadeUp} style={{
                            flex: '1 1 380px', // Dynamically grows wide, shrinks up to 380px min-width
                            background: 'linear-gradient(135deg, #0a122c, #070d22)',
                            border: '1px solid #132247',
                            borderRadius: '16px', padding: '32px',
                            display: 'flex', flexDirection: 'column', gap: '16px',
                            justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                        }}>
                            <span style={{
                                display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em',
                                textTransform: 'uppercase', color: '#64748b', fontWeight: 700,
                                marginBottom: '8px',
                            }}>
                                Account Management
                            </span>

                            <button style={{
                                width: '100%', padding: '16px',
                                background: 'transparent', border: '1px solid rgba(59, 130, 246, 0.4)',
                                borderRadius: '10px', color: '#3b82f6',
                                fontSize: '0.85rem', fontWeight: 600,
                                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                Reset Password
                            </button>

                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%', padding: '16px',
                                    background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: '10px', color: '#ef4444',
                                    fontSize: '0.85rem', fontWeight: 600,
                                    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)'}
                            >
                                Sign Out Session
                            </button>
                        </motion.div>

                    </div>
                </div>

            </div>
        </motion.div>
    );
}