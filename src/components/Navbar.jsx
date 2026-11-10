import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // สไตล์สำหรับเมนู Active แบบ Glow Pill (ไม่ใช้ขีดเส้นใต้)
  const navLinkStyle = (path) => ({
    color: isActive(path) ? '#38BDF8' : '#94A3B8',
    background: isActive(path) ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
    border: isActive(path) ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
    padding: '8px 16px',
    borderRadius: '20px',
    textDecoration: 'none',
    fontWeight: isActive(path) ? '800' : '600',
    fontSize: '14px',
    boxShadow: isActive(path) ? '0 0 12px rgba(56, 189, 248, 0.2)' : 'none',
    transition: 'all 0.25s ease'
  });

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 48px',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo */}
      <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px' }}>
        <Link to="/" style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '26px' }}>📍</span>
          <span>khong<span style={{ color: '#38BDF8', textShadow: '0 0 12px rgba(56, 189, 248, 0.6)' }}>unai</span></span>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '400', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            ของอยู่ไหน?
          </span>
        </Link>
      </div>

      {/* Nav Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/" style={navLinkStyle('/')}>
          หน้าแรก
        </Link>

        <Link to="/equipments" style={navLinkStyle('/equipments')}>
          📦 อุปกรณ์ทั้งหมด
        </Link>

        {user && user.role === 'member' && (
          <Link to="/my-borrowings" style={navLinkStyle('/my-borrowings')}>
            📋 ประวัติการยืม
          </Link>
        )}

        {user && user.role === 'admin' && (
          <Link to="/admin" style={{ 
            color: isActive('/admin') ? '#FFFFFF' : '#FDE047', 
            background: isActive('/admin') ? '#EAB308' : 'rgba(253, 224, 71, 0.12)',
            border: '1px solid rgba(253, 224, 71, 0.4)',
            padding: '8px 16px',
            borderRadius: '20px',
            textDecoration: 'none', 
            fontWeight: '800', 
            fontSize: '13px',
            boxShadow: isActive('/admin') ? '0 0 14px rgba(234, 179, 8, 0.4)' : 'none'
          }}>
            🛡️ หลังบ้าน Admin
          </Link>
        )}

        {(!user || user.role === 'guest') ? (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '12px' }}>
            <Link to="/login" style={{
              color: '#F8FAFC',
              padding: '8px 18px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              เข้าสู่ระบบ
            </Link>
            <Link to="/register" style={{
              background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
              color: '#FFFFFF',
              padding: '8px 18px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)'
            }}>
              สมัครสมาชิก
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '12px' }}>
            <span style={{ fontSize: '13px', color: '#E2E8F0', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              👤 {user.name || user.username} (<strong style={{ color: '#38BDF8' }}>{user.role}</strong>)
            </span>
            <button 
              onClick={() => { logout(); navigate('/'); }}
              style={{
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                padding: '7px 16px',
                borderRadius: '8px',
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