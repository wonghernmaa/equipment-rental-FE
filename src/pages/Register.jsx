import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); // State สำหรับข้อความสำเร็จแบบมินิมอล
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    // จำลองการสมัครสำเร็จ และแสดงข้อความแบบมินิมอลในหน้าจอทันที
    setSuccessMsg('สมัครสมาชิกสำเร็จ! กำลังพาท่านไปหน้าเข้าสู่ระบบ...');
    
    // หน่วงเวลา 1.5 วินาที แล้วพาไปหน้า Login
    setTimeout(() => {
      navigate('/login');
    }, 1500);
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
          <span style={{ fontSize: '32px' }}>✨</span>
          <h2 style={{ color: '#0F172A', fontSize: '26px', margin: '10px 0 6px 0', fontWeight: '900' }}>สร้างบัญชีใหม่</h2>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>ลงทะเบียนเพื่อใช้งานระบบยืมอุปกรณ์ khongunai</p>
        </div>

        {/* กล่องแจ้งเตือนสมัครสมาชิกสำเร็จแบบมินิมอล */}
        {successMsg && (
          <div style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '700',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'center',
            justifyContent: 'center'
          }}>
            <span>🎉</span> {successMsg}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>ชื่อ-นามสกุล</label>
            <input 
              type="text"
              placeholder="สมชาย เรียนดี"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>อีเมล หรือ Username</label>
            <input 
              type="text"
              placeholder="username หรือ email@example.com"
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
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>รหัสผ่าน</label>
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
            สมัครสมาชิก
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
          มีบัญชีอยู่แล้วใช่ไหม? <Link to="/login" style={{ color: '#0284C7', fontWeight: '700', textDecoration: 'none' }}>เข้าสู่ระบบ</Link>
        </div>
      </div>
    </div>
  );
}