import { useEffect, useState } from 'react';

export function CustomCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateCursor = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            const target = e.target as HTMLElement;
            if (target.closest('a') || target.closest('button') || target.closest('input')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateCursor);
        return () => window.removeEventListener('mousemove', updateCursor);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: isHovering ? '40px' : '20px',
                height: isHovering ? '40px' : '20px',
                border: `2px solid ${isHovering ? '#E8D5A3' : '#C5A880'}`,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 9999,
                transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease',
                backgroundColor: isHovering ? 'rgba(197, 168, 128, 0.15)' : 'transparent',
            }}
        />
    );
}
