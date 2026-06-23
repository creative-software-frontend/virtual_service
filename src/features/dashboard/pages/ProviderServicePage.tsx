import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { serviceApi, providerApi } from '../../../utils/api';
import type { Post, ChatMessage, ActiveUser } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

/* ─────────────────────────────────────────────────────────────── helpers */
function timeAgo(dateStr: string) {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function avatarColor(name: string) {
    const colors = [
        'linear-gradient(135deg,#6366f1,#818cf8)',
        'linear-gradient(135deg,#0ea5e9,#38bdf8)',
        'linear-gradient(135deg,#ec4899,#f472b6)',
        'linear-gradient(135deg,#10b981,#34d399)',
        'linear-gradient(135deg,#f59e0b,#fcd34d)',
        'linear-gradient(135deg,#8b5cf6,#a78bfa)',
    ];
    let h = 0;
    for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
    return colors[h % colors.length];
}

/* ─────────────────────────────────────────────────────────────── Avatar */
function Avatar({ name, size = 40 }: { name: string; size?: number }) {
    const initials = name ? name.substring(0, 2).toUpperCase() : '??';
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: avatarColor(name),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: size * 0.36,
            fontFamily: "'Inter', sans-serif", flexShrink: 0,
        }}>
            {initials}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── Newsfeed */
function NewsfeedTab({ myId, myName }: { myId: number; myName: string }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const loadPosts = async () => {
        const res = await serviceApi.getPosts();
        if (!res.error) setPosts(res.data ?? []);
        setLoading(false);
    };

    useEffect(() => { loadPosts(); }, []);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 4 * 1024 * 1024) { setError('Image must be under 4 MB'); return; }
        const reader = new FileReader();
        reader.onload = () => {
            const b64 = reader.result as string;
            setImageBase64(b64);
            setImagePreview(b64);
        };
        reader.readAsDataURL(file);
    };

    const submitPost = async () => {
        if (!content.trim()) { setError('Write something first!'); return; }
        setPosting(true); setError(null);
        const res = await serviceApi.createPost(content.trim(), imageBase64);
        setPosting(false);
        if (res.error) { setError(res.error); return; }
        if (res.data) setPosts(prev => [res.data!, ...prev]);
        setContent(''); setImageBase64(null); setImagePreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Compose card */}
            <div style={{
                background: 'linear-gradient(135deg,rgba(30,41,59,0.95),rgba(15,23,42,0.95))',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 16,
                padding: '18px 16px',
                boxShadow: '0 0 20px rgba(99,102,241,0.15)',
            }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <Avatar name={myName} size={38} />
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Share something with the community…"
                        rows={3}
                        style={{
                            flex: 1, background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(99,102,241,0.25)',
                            borderRadius: 10, color: 'var(--text-primary)',
                            padding: '10px 12px', resize: 'none',
                            fontFamily: "'Inter', sans-serif", fontSize: '0.9rem',
                            outline: 'none', lineHeight: 1.5,
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; }}
                    />
                </div>

                {imagePreview && (
                    <div style={{ position: 'relative', marginBottom: 12 }}>
                        <img src={imagePreview} alt="preview"
                            style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10, display: 'block' }} />
                        <button onClick={() => { setImagePreview(null); setImageBase64(null); if (fileRef.current) fileRef.current.value = ''; }}
                            style={{
                                position: 'absolute', top: 8, right: 8,
                                background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                                width: 28, height: 28, color: '#fff', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                            }}>✕</button>
                    </div>
                )}

                {error && <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: 10 }}>{error}</p>}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={() => fileRef.current?.click()} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
                        borderRadius: 8, color: '#818cf8', padding: '7px 14px',
                        fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600,
                        transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.22)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        Photo
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />

                    <button onClick={submitPost} disabled={posting} style={{
                        background: posting ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#818cf8)',
                        border: 'none', borderRadius: 8, color: '#fff',
                        padding: '8px 20px', fontSize: '0.82rem', fontWeight: 700,
                        cursor: posting ? 'wait' : 'pointer', transition: 'all 0.2s',
                        boxShadow: '0 0 12px rgba(99,102,241,0.4)',
                    }}>
                        {posting ? 'Posting…' : 'Post'}
                    </button>
                </div>
            </div>

            {/* Feed */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>Loading feed…</div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12, display: 'block', margin: '0 auto 12px' }}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    No posts yet. Be the first!
                </div>
            ) : (
                posts.map(post => (
                    <div key={post.id} style={{
                        background: 'linear-gradient(135deg,rgba(30,41,59,0.9),rgba(15,23,42,0.9))',
                        border: '1px solid rgba(99,102,241,0.18)',
                        borderRadius: 14, padding: '16px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                        animation: 'fadeIn 0.3s ease',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <Avatar name={post.author_name} size={36} />
                            <div style={{ flex: 1 }}>
                                <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>
                                    {post.author_name}
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                                    {post.author_role.toUpperCase()} · {timeAgo(post.created_at)}
                                </p>
                            </div>
                            {post.author_role === 'provider' && (
                                <span style={{
                                    fontSize: '0.6rem', letterSpacing: '0.1em',
                                    background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)',
                                    color: '#818cf8', padding: '3px 8px', borderRadius: 20, fontWeight: 700,
                                }}>PROVIDER</span>
                            )}
                        </div>
                        <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: post.image_url ? 12 : 0 }}>
                            {post.content}
                        </p>
                        {post.image_url && (
                            <img src={post.image_url} alt="post" style={{
                                width: '100%', borderRadius: 10, display: 'block', maxHeight: 280,
                                objectFit: 'cover', marginTop: 8,
                                border: '1px solid rgba(99,102,241,0.2)',
                            }} />
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── Chat */
function ChatTab({ myId, myName, role }: { myId: number; myName: string; role: string }) {
    const [contacts, setContacts] = useState<ActiveUser[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [selectedContact, setSelectedContact] = useState<ActiveUser | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Load contacts: users see providers, providers see users
    const loadContacts = async () => {
        setLoadingContacts(true);
        const res = role === 'user'
            ? await providerApi.getOnlineProviders()
            : await providerApi.getOnlineUsers();
        if (!res.error) setContacts(res.data ?? []);
        setLoadingContacts(false);
    };

    useEffect(() => { loadContacts(); }, [role]);

    // Load and poll messages
    const loadMessages = async (contact: ActiveUser) => {
        setLoadingMsgs(true);
        const res = await serviceApi.getMessages(contact.id);
        if (!res.error) setMessages(res.data ?? []);
        setLoadingMsgs(false);
    };

    useEffect(() => {
        if (!selectedContact) return;
        loadMessages(selectedContact);
        pollRef.current = setInterval(() => loadMessages(selectedContact), 4000);
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [selectedContact?.id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    const sendMsg = async () => {
        if (!input.trim() || !selectedContact) return;
        setSending(true);
        const res = await serviceApi.sendMessage(selectedContact.id, input.trim());
        setSending(false);
        if (res.error) return;
        setInput('');
        if (res.data) {
            setMessages(prev => [...prev, {
                id: res.data!.id, sender_id: myId,
                receiver_id: selectedContact.id, message: res.data!.message,
                created_at: new Date().toISOString(), sender_name: myName,
            }]);
        }
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
    };

    if (selectedContact) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100svh - 220px)', minHeight: 400 }}>
                {/* Chat header */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                    background: 'linear-gradient(135deg,rgba(30,41,59,0.98),rgba(15,23,42,0.98))',
                    border: '1px solid rgba(99,102,241,0.25)', borderRadius: '14px 14px 0 0',
                    marginBottom: 2,
                }}>
                    <button onClick={() => setSelectedContact(null)} style={{
                        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                        borderRadius: 8, color: '#818cf8', width: 32, height: 32,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, flexShrink: 0,
                    }}>←</button>
                    <Avatar name={selectedContact.name} size={36} />
                    <div>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>
                            {selectedContact.name}
                        </p>
                        <p style={{ color: '#34d399', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 6px #34d399' }} />
                            Online now
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div style={{
                    flex: 1, overflowY: 'auto', padding: '16px 12px',
                    background: 'rgba(10,14,26,0.85)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                    {loadingMsgs && messages.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 40 }}>Loading messages…</p>
                    ) : messages.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 40 }}>
                            No messages yet. Say hello! 👋
                        </p>
                    ) : (
                        messages.map(msg => {
                            const isMine = msg.sender_id === myId;
                            return (
                                <div key={msg.id} style={{
                                    display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', gap: 8,
                                }}>
                                    {!isMine && <Avatar name={msg.sender_name} size={28} />}
                                    <div style={{
                                        maxWidth: '72%',
                                        background: isMine
                                            ? 'linear-gradient(135deg,#6366f1,#818cf8)'
                                            : 'rgba(30,41,59,0.9)',
                                        border: isMine ? 'none' : '1px solid rgba(99,102,241,0.2)',
                                        borderRadius: isMine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                        padding: '9px 13px',
                                        boxShadow: isMine ? '0 2px 10px rgba(99,102,241,0.35)' : '0 2px 8px rgba(0,0,0,0.25)',
                                    }}>
                                        <p style={{ color: '#fff', fontSize: '0.88rem', lineHeight: 1.5 }}>{msg.message}</p>
                                        <p style={{ color: isMine ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', fontSize: '0.65rem', marginTop: 4, textAlign: 'right' }}>
                                            {timeAgo(msg.created_at)}
                                        </p>
                                    </div>
                                    {isMine && <Avatar name={myName} size={28} />}
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div style={{
                    display: 'flex', gap: 8, padding: '12px 12px',
                    background: 'linear-gradient(135deg,rgba(30,41,59,0.98),rgba(15,23,42,0.98))',
                    border: '1px solid rgba(99,102,241,0.25)', borderRadius: '0 0 14px 14px',
                }}>
                    <input
                        value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                        placeholder="Type a message…"
                        style={{
                            flex: 1, background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(99,102,241,0.25)', borderRadius: 10,
                            color: 'var(--text-primary)', padding: '10px 14px',
                            fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', outline: 'none',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; }}
                    />
                    <button onClick={sendMsg} disabled={sending || !input.trim()} style={{
                        background: sending ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#818cf8)',
                        border: 'none', borderRadius: 10, color: '#fff',
                        width: 44, height: 44, cursor: sending ? 'wait' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 12px rgba(99,102,241,0.4)', transition: 'all 0.2s', flexShrink: 0,
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    // Contact list
    const label = role === 'user' ? 'providers' : 'users';
    return (
        <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 16, letterSpacing: '0.08em' }}>
                {loadingContacts ? 'Finding active ' + label + '…' : `${contacts.length} active ${label} online`}
            </p>
            {contacts.length === 0 && !loadingContacts ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 12px' }}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    No {label} online right now.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {contacts.map(c => (
                        <button key={c.id} onClick={() => setSelectedContact(c)} style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            background: 'linear-gradient(135deg,rgba(30,41,59,0.9),rgba(15,23,42,0.9))',
                            border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12,
                            padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                            transition: 'all 0.2s', width: '100%',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(99,102,241,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ position: 'relative' }}>
                                <Avatar name={c.name} size={42} />
                                <span style={{
                                    position: 'absolute', bottom: 1, right: 1,
                                    width: 11, height: 11, borderRadius: '50%',
                                    background: '#34d399', border: '2px solid var(--bg-card)',
                                    boxShadow: '0 0 6px #34d399',
                                }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.92rem', marginBottom: 3 }}>{c.name}</p>
                                <p style={{ color: '#34d399', fontSize: '0.72rem' }}>● Active now</p>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── Main page */
export function ProviderServicePage() {
    const { role } = useParams<{ role: string }>();
    const [tab, setTab] = useState<'feed' | 'chat'>('feed');
    const { user } = useAuth();

    const myName = user?.username ?? 'Member';
    const myId = user?.id ?? 0;

    const tabs: { key: 'feed' | 'chat'; label: string; icon: JSX.Element }[] = [
        {
            key: 'feed', label: 'Newsfeed',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" />
                </svg>
            ),
        },
        {
            key: 'chat', label: 'Chat',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
        },
    ];

    return (
        <div style={{ background: 'var(--bg-root)', minHeight: '100svh' }}>
            {/* ── Top bar ── */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'linear-gradient(180deg,rgba(10,14,26,0.98) 0%,rgba(10,14,26,0.9) 100%)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(99,102,241,0.2)',
                padding: '14px 16px 0',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 14px rgba(99,102,241,0.5)',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>
                            Services
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Community · Chat · Feed
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '10px 0', position: 'relative',
                            color: tab === t.key ? '#818cf8' : 'var(--text-secondary)',
                            fontWeight: tab === t.key ? 700 : 500,
                            fontSize: '0.82rem', fontFamily: "'Inter', sans-serif",
                            transition: 'color 0.2s',
                        }}>
                            {t.icon}
                            {t.label}
                            {tab === t.key && (
                                <span style={{
                                    position: 'absolute', bottom: -1, left: '20%', right: '20%', height: 2,
                                    background: 'linear-gradient(90deg,#6366f1,#818cf8)',
                                    borderRadius: 4, boxShadow: '0 0 8px rgba(99,102,241,0.6)',
                                }} />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab content ── */}
            <div style={{ padding: '16px 14px 100px' }}>
                {tab === 'feed' ? (
                    <NewsfeedTab myId={myId} myName={myName} />
                ) : (
                    <ChatTab myId={myId} myName={myName} role={role ?? 'user'} />
                )}
            </div>
        </div>
    );
}
