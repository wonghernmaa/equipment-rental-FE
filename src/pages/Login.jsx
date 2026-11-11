import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg(''); // เคลียร์ข้อความแจ้งเตือนเก่า

    const success = login(username, password);

    if (success) {
      // ล็อกอินสำเร็จ พุ่งเข้าหน้าแรกทันทีโดยไม่มีข้อความแจ้งเตือนใดๆ กวนใจ
      navigate('/');
    } else {
      // ดักเฉพาะตอนรหัสผ่านหรือชื่อผู้ใช้ผิด แจ้งเตือนมินิมอลใต้หัวข้อ
      setErrorMsg('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at top, #1E293B 0%, #0F172A 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        padding: '40px',
        borderRadius: '24px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '32px' }}>👋</span>
          <h2 style={{ color: '#0F172A', fontSize: '26px', margin: '10px 0 6px 0', fontWeight: '900' }}>ยินดีต้อนรับกลับ</h2>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>เข้าสู่ระบบ khongunai เพื่อติดตามและยืมอุปกรณ์</p>
        </div>

        {/* กล่องแจ้งเตือนเฉพาะตอนรหัสผิด แบบมินิมอล */}
        {errorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>❌</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>ชื่อผู้ใช้งาน (Username)</label>
            <input 
              type="text"
              placeholder="เช่น ponza0191 หรือ admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                outline: 'none',
                background: '#F8FAFC',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>รหัสผ่าน (Password)</label>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                outline: 'none',
                background: '#F8FAFC',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '800',
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)',
              marginBottom: '20px'
            }}
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div style={{ background: '#F1F5F9', padding: '14px', borderRadius: '12px', fontSize: '12px', color: '#475569', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
          <strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>🔑 บัญชีสำหรับทดสอบระบบ:</strong>
          <div>• Member: <code style={{ color: '#0284C7' }}>ponza0191</code> / <code style={{ color: '#0284C7' }}>1234</code></div>
          <div>• Admin: <code style={{ color: '#0284C7' }}>admin</code> / <code style={{ color: '#0284C7' }}>1234</code></div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
          ยังไม่มีบัญชีใช้งานใช่ไหม? <Link to="/register" style={{ color: '#0284C7', fontWeight: '700', textDecoration: 'none' }}>สมัครสมาชิก</Link>
        </div>
      </div>
    </div>
  );
}