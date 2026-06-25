import { useEffect, useRef, useState } from 'react';
import type { Post } from '../../../../utils/api';
import { serviceApi } from '../../../../utils/api';
import { Avatar } from './Avatar';

export function NewsfeedTab({ myName }: { myName: string }) {
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

    const timeAgo = (dateStr: string) => {
        const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
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
