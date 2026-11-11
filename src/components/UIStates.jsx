import React from 'react';

// 1. สถานะกำลังโหลด (Loading Spinner)
export function LoadingState({ message = "กำลังโหลดข้อมูล..." }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #E2E8F0',
        borderTop: '4px solid #0284C7',
        borderRadius: '50%',
        margin: '0 auto 16px auto',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>{message}</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// 2. สถานะข้อมูลว่างเปล่า (Empty State)
export function EmptyState({ title = "ไม่พบข้อมูลในระบบ", description = "ลองเปลี่ยนคำค้นหา หรือเพิ่มรายการใหม่ในระบบ" }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', color: '#64748B' }}>
      <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>📭</span>
      <h4 style={{ color: '#0F172A', fontSize: '18px', fontWeight: '800', margin: '0 0 6px 0' }}>{title}</h4>
      <p style={{ fontSize: '14px', margin: 0 }}>{description}</p>
    </div>
  );
}

// 3. สถานะเกิดข้อผิดพลาด (Error State)
export function ErrorState({ message = "เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง", onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', background: '#FEF2F2', borderRadius: '20px', border: '1px solid #FECACA', color: '#DC2626' }}>
      <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>⚠️</span>
      <h4 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 6px 0' }}>ไม่สามารถเชื่อมต่อข้อมูลได้</h4>
      <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}>{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
        >
          🔄 ลองใหม่อีกครั้ง
        </button>
      )}
    </div>
  );
}