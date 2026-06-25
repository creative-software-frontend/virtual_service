import { useEffect, useRef, useState } from 'react';
import type { ActiveUser, ChatMessage } from '../../../../utils/api';
import { serviceApi, providerApi } from '../../../../utils/api';
import { Avatar } from './Avatar';


/* ─────────────────────────────────────────────────────────────── Chat */
export function ChatTab({ myId, myName, role }: { myId: number; myName: string; role: string }) {
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

    const timeAgo = (dateStr: string) => {
        const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

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
