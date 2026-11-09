import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // เช็คสิทธิ์ตามไอดีที่กำหนดไว้ล่วงหน้าเพื่อรอต่อ Backend
    if (username === 'ponza0191' && password === '1234') {
      login('member', 'PONZA');
      navigate('/');
    } else if (username === 'admin' && password === '1234') {
      login('admin', 'Administrator');
      navigate('/admin');
    } else {
      setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง (ใช้ ponza0191 หรือ admin / รหัส 1234)');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#FFFFFF',
        padding: '36px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid #E2E8F0'
      }}>
        <h2 style={{ color: '#1E293B', marginTop: 0, marginBottom: '8px', fontSize: '24px' }}>ยินดีต้อนรับกลับ 👋</h2>
        <p style={{ color: '#64748B', marginBottom: '20px', fontSize: '14px' }}>เข้าสู่ระบบด้วยบัญชีทดสอบระบบ</p>

        {error && (
          <div style={{
            background: '#FEF2F2',
            color: '#DC2626',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '16px',
            border: '1px solid #FCA5A5'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>ชื่อผู้ใช้งาน (Username)</label>
            <input 
              type="text" 
              placeholder="ponza0191 หรือ admin" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
                fontSize: '14px',
                background: '#F8FAFC'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>รหัสผ่าน (Password)</label>
            <input 
              type="password" 
              placeholder="1234" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
                fontSize: '14px',
                background: '#F8FAFC'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: '8px',
              padding: '12px',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* กล่องบอกโพยไอดีเทสต์แบบเนียนๆ */}
        <div style={{
          marginTop: '16px',
          padding: '10px 12px',
          background: '#F1F5F9',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#475569',
          lineHeight: '1.4'
        }}>
          📌 <strong>บัญชีสำหรับเทสต์:</strong><br />
          • Member: <code>ponza0191</code> / <code>1234</code><br />
          • Admin: <code>admin</code> / <code>1234</code>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748B' }}>
          ยังไม่มีบัญชีใช่ไหม? <Link to="/register" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '600' }}>สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  );
}