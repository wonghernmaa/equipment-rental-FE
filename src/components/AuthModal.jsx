import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isGuestAccount = !!user; // login แล้วแต่ role=guest ยืมไม่ได้

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#FFFFFF',
        padding: '32px',
        borderRadius: '16px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>{isGuestAccount ? '👀' : '🔒'}</div>
        <h3 style={{ margin: '0 0 8px 0', color: '#1E293B', fontSize: '20px' }}>{isGuestAccount ? 'บัญชีผู้เยี่ยมชมยืมอุปกรณ์ไม่ได้' : 'กรุณาเข้าสู่ระบบก่อน'}</h3>
        <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>
          {isGuestAccount
            ? 'บัญชี Guest ดูรายการอุปกรณ์ได้อย่างเดียว หากต้องการยืม กรุณาออกจากระบบแล้วสมัครสมาชิกแบบ Member'
            : 'คุณต้องเข้าสู่ระบบหรือสมัครสมาชิกเพื่อทำรายการยืมอุปกรณ์'}
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#475569',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isGuestAccount ? 'ตกลง' : 'ยกเลิก'}
          </button>
          {!isGuestAccount && <button
            onClick={() => { onClose(); navigate('/login'); }}
            style={{
              flex: 1,
              padding: '10px',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ไปหน้าเข้าสู่ระบบ
          </button>}
        </div>
      </div>
    </div>
  );
}