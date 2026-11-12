import React from 'react';

// กล่องข้อความแจ้งเตือน type: 'error' | 'success'
export default function Notice({ type = 'error', children, onClose }) {
  if (!children) return null;
  const ok = type === 'success';
  return (
    <div role={ok ? 'status' : 'alert'} style={{
      background: ok ? '#ECFDF5' : '#FEF2F2', border: `1px solid ${ok ? '#A7F3D0' : '#FECACA'}`,
      color: ok ? '#065F46' : '#DC2626', padding: '12px 16px', borderRadius: '12px', fontSize: '13px',
      fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '8px',
    }}>
      <span>{ok ? '✅' : '❌'}</span>
      <span style={{ flex: 1 }}>{children}</span>
      {onClose && (
        <button onClick={onClose} aria-label="ปิดข้อความ"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '16px', lineHeight: 1 }}>×</button>
      )}
    </div>
  );
}
