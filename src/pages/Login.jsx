import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, SESSION_EXPIRED_KEY } from '../auth/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(() => {
    // ถูกเด้งออกเพราะตั๋วหมดอายุ (ตั๋วจาก BE อายุ 1 ชั่วโมง)
    if (sessionStorage.getItem(SESSION_EXPIRED_KEY)) {
      sessionStorage.removeItem(SESSION_EXPIRED_KEY);
      return 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง';
    }
    return '';
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setErrorMsg('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // กลับไปหน้าที่ตั้งใจจะเข้า (ถ้าถูกเด้งมาจากหน้าที่ต้อง login) ไม่งั้นไปหน้าแรก
      navigate((location.state && location.state.from) || '/', { replace: true });
    } catch (err) {
      setErrorMsg(err.message);
      setSubmitting(false);
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
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>อีเมล</label>
            <input 
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="current-password"
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
            disabled={submitting}
            style={{
              opacity: submitting ? 0.7 : 1,
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
            {submitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
          ยังไม่มีบัญชีใช้งานใช่ไหม? <Link to="/register" style={{ color: '#0284C7', fontWeight: '700', textDecoration: 'none' }}>สมัครสมาชิก</Link>
        </div>
      </div>
    </div>
  );
}