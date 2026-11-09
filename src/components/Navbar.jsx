import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 40px',
      background: '#1E3A8A', // สีน้ำเงินเข้มสีเดียว มินิมอล
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ fontSize: '20px', fontWeight: '800' }}>
        <Link to="/" style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🎓</span>
          <span>Uni<span style={{ color: '#93C5FD' }}>Equipment</span></span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
          หน้าแรก
        </Link>

        {user.role === 'member' && (
          <Link to="/my-borrowings" style={{ color: '#E2E8F0', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
            ประวัติการยืม
          </Link>
        )}

        {user.role === 'admin' && (
          <Link to="/admin" style={{ 
            color: '#FDE047', 
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '6px 12px',
            borderRadius: '6px',
            textDecoration: 'none', 
            fontWeight: '600', 
            fontSize: '13px' 
          }}>
            🛡️ จัดการหลังบ้าน
          </Link>
        )}

        {user.role === 'guest' ? (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link to="/login" style={{
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              เข้าสู่ระบบ
            </Link>
            <Link to="/register" style={{
              background: '#2563EB',
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              สมัครสมาชิก
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#E2E8F0' }}>
              👤 {user.name} (<strong style={{ color: '#93C5FD' }}>{user.role}</strong>)
            </span>
            <button 
              onClick={() => { logout(); navigate('/'); }}
              style={{
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}