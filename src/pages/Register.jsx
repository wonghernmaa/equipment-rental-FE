import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleRegister = (e) => {
    e.preventDefault();
    alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
    navigate('/login');
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
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid #E2E8F0'
      }}>
        <h2 style={{ color: '#1E293B', marginTop: 0, marginBottom: '8px', fontSize: '24px' }}>สร้างบัญชีใหม่ ✨</h2>
        <p style={{ color: '#64748B', marginBottom: '24px', fontSize: '14px' }}>ลงทะเบียนเพื่อใช้งานระบบยืมอุปกรณ์มหาวิทยาลัย</p>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>ชื่อ-นามสกุล</label>
            <input 
              type="text" 
              placeholder="สมชาย เรียนดี" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
                fontSize: '14px',
                background: '#F8FAFC'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>อีเมลมหาวิทยาลัย</label>
            <input 
              type="email5" 
              placeholder="student@uni.ac.th" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
                fontSize: '14px',
                background: '#F8FAFC'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>รหัสผ่าน</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '12px',
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
            สมัครสมาชิก
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748B' }}>
          มีบัญชีอยู่แล้ว? <Link to="/login" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '600' }}>เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}