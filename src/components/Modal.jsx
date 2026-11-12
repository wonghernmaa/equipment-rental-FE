import React, { useEffect } from 'react';

// กล่อง modal พื้นฐาน: กด Esc เพื่อปิด (ปิดไม่ได้ตอน busy กันกดซ้อนระหว่างส่งข้อมูล)
export default function Modal({ onClose, busy = false, maxWidth = 460, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, busy]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto',
      }}
    >
      <div style={{
        background: '#FFFFFF', padding: '28px', borderRadius: '24px', maxWidth, width: '100%',
        maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}>
        {children}
      </div>
    </div>
  );
}
