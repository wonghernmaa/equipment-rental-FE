import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import * as api from '../api';
import { ROLE_LABEL } from '../constants';
import { formatDateTime } from '../utils/format';

export default function Profile() {
  const { user, canBorrow } = useAuth();
  const [profile, setProfile] = useState(null); // ข้อมูลล่าสุดจาก GET /api/me (member/admin เท่านั้น)
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!canBorrow) return undefined;
    let alive = true;
    api.getMe().then((m) => alive && setProfile(m)).catch(() => {});
    return () => { alive = false; };
  }, [canBorrow]);

  const me = profile || user;

  // State ควบคุมการเปิด-ปิด (Accordion) ของฟอร์มเปลี่ยนรหัสผ่าน
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (saving) return;
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร' });
      return;
    }

    setSaving(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setMessage({ type: 'success', text: '🔒 เปลี่ยนรหัสผ่านสำเร็จเรียบร้อยแล้ว!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message }); // เช่น รหัสผ่านเดิมไม่ถูกต้อง
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Header Profile Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0284C7 100%)',
        borderRadius: '24px',
        padding: '36px 40px',
        color: '#FFFFFF',
        marginBottom: '32px',
        boxShadow: '0 15px 35px rgba(15, 23, 42, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '36px',
          boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)',
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          👤
        </div>
        <div>
          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
            MEMBER PROFILE
          </span>
          <h2 style={{ fontSize: '28px', margin: '8px 0 4px 0', fontWeight: '900', letterSpacing: '-0.5px' }}>
            {me?.displayName || "สมาชิกผู้ใช้งาน"}
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
            สถานะบัญชี: <span style={{ color: '#34D399', fontWeight: '700' }}>● Active Member</span>
          </p>
        </div>
      </div>

      {/* Profile Details Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        <div style={{
          background: '#FFFFFF',
          padding: '32px',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#0F172A', fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📋</span> ข้อมูลบัญชีผู้ใช้งาน
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '4px', fontWeight: '700' }}>ชื่อ-นามสกุล</span>
              <strong style={{ color: '#0F172A', fontSize: '15px' }}>{me?.displayName || "-"}</strong>
            </div>
            
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '4px', fontWeight: '700' }}>อีเมลที่ใช้ลงทะเบียน</span>
              <strong style={{ color: '#0F172A', fontSize: '15px' }}>{me?.email || "-"}</strong>
            </div>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '4px', fontWeight: '700' }}>สิทธิ์การใช้งานระบบ</span>
              <strong style={{ color: '#0284C7', fontSize: '15px' }}>{ROLE_LABEL[me?.role] || '-'}</strong>
            </div>

            {profile?.createdAt && (
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '4px', fontWeight: '700' }}>สมัครสมาชิกเมื่อ</span>
                <strong style={{ color: '#0F172A', fontSize: '15px' }}>{formatDateTime(profile.createdAt)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Card (Accordion Style) */}
        {!canBorrow ? (
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#B45309', padding: '20px 24px', borderRadius: '20px', fontSize: '14px', lineHeight: 1.6 }}>
            บัญชีผู้เยี่ยมชม (Guest) ดูรายการอุปกรณ์ได้อย่างเดียว ไม่สามารถเปลี่ยนรหัสผ่านหรือยืมอุปกรณ์ได้
            หากต้องการใช้งานเต็มรูปแบบ กรุณาสมัครสมาชิกแบบ Member
          </div>
        ) : (
        <div style={{
          background: '#FFFFFF',
          padding: '28px 32px',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          transition: 'all 0.3s ease'
        }}>
          {/* ส่วนหัวข้อ คลิกเพื่อกางออก / หุบเข้า */}
          <div 
            onClick={() => setIsPasswordOpen(!isPasswordOpen)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 4px 0', color: '#0F172A', fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔒</span> เปลี่ยนรหัสผ่าน
              </h3>
              <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>
                คลิกเพื่อจัดการความปลอดภัยและเปลี่ยนรหัสผ่านบัญชีของคุณ
              </p>
            </div>
            
            {/* ลูกศรบอกสถานะเปิด-ปิด */}
            <div style={{
              background: isPasswordOpen ? '#E0F2FE' : '#F1F5F9',
              color: isPasswordOpen ? '#0284C7' : '#64748B',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'transform 0.3s ease, background 0.2s',
              transform: isPasswordOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>
              ▼
            </div>
          </div>

          {/* ส่วนฟอร์มที่จะซ่อนหรือกางออกเมื่อคลิก */}
          {isPasswordOpen && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E2E8F0', animation: 'fadeIn 0.3s ease-in-out' }}>
              
              {message.text && (
                <div style={{
                  background: message.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                  border: `1px solid ${message.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
                  color: message.type === 'success' ? '#065F46' : '#DC2626',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>{message.type === 'success' ? '✅' : '❌'}</span> {message.text}
                </div>
              )}

              <form onSubmit={handlePasswordChange}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>รหัสผ่านเดิม</label>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>รหัสผ่านใหม่</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>ยืนยันรหัสผ่านใหม่</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button 
                    type="button"
                    onClick={() => setIsPasswordOpen(false)}
                    style={{
                      padding: '12px 20px',
                      background: '#F1F5F9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    ยกเลิก
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    style={{
                      opacity: saving ? 0.6 : 1,
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)'
                    }}
                  >
                    {saving ? 'กำลังบันทึก...' : '💾 บันทึกรหัสผ่านใหม่'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        )}

      </div>
    </div>
  );
}