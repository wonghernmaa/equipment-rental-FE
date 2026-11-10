import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { mockEquipments } from '../data/mockEquipments';
import BorrowModal from '../components/BorrowModal';
import AuthModal from '../components/AuthModal';

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ดึงข้อมูลอุปกรณ์ตาม ID
  const equipment = mockEquipments.find(item => item.id === parseInt(id)) || mockEquipments[0];

  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // ข้อมูลจำลองรายการรีวิว
  const [reviews] = useState([
    { id: 1, userName: "กฤษฎา คงแก้ว", rating: 5, comment: "อุปกรณ์ใช้งานได้ดี สภาพใหม่ ไม่มีปัญหาเลยครับ", date: "2026-11-10" },
    { id: 2, userName: "สมชาย สายลุย", rating: 4, comment: "แบตเตอรี่อึดตามสเปก แต่กระเป๋าหนักไปนิดนึง", date: "2026-11-05" }
  ]);

  const handleBorrowClick = () => {
    if (!user || user.role === 'guest') {
      setAuthModalOpen(true);
    } else {
      setBorrowModalOpen(true);
    }
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* ปุ่มย้อนกลับ */}
      <button 
        onClick={() => navigate('/')}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          padding: '10px 20px',
          borderRadius: '12px',
          cursor: 'pointer',
          marginBottom: '24px',
          fontWeight: '700',
          color: '#0F172A',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          fontSize: '14px',
          transition: 'transform 0.2s'
        }}
      >
        ⬅️ ย้อนกลับหน้าแรก
      </button>

      {/* Main Detail Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
        border: '1px solid #E2E8F0',
        marginBottom: '36px'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          
          {/* Image Container */}
          <div style={{ flex: '1 1 420px', height: '400px', background: '#F8FAFC', position: 'relative', overflow: 'hidden' }}>
            <img 
              src={equipment.image} 
              alt={equipment.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(8px)',
              color: '#38BDF8',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '800',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              {equipment.category}
            </div>
          </div>
          
          {/* Content Info */}
          <div style={{ flex: '1 1 420px', padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '28px', color: '#0F172A', margin: '0 0 14px 0', fontWeight: '900', letterSpacing: '-0.5px' }}>
                {equipment.name}
              </h2>
              <p style={{ color: '#64748B', fontSize: '15px', lineHeight: '1.7', margin: '0 0 24px 0' }}>
                {equipment.description || 'ไม่มีคำอธิบายเพิ่มเติมสำหรับอุปกรณ์ชิ้นนี้'}
              </p>
              
              {/* Stock Info Bar */}
              <div style={{ 
                background: '#F8FAFC', 
                padding: '16px 20px', 
                borderRadius: '16px', 
                border: '1px solid #F1F5F9',
                display: 'flex', 
                gap: '24px', 
                fontSize: '14px' 
              }}>
                <div>
                  <span style={{ color: '#64748B', fontSize: '12px', display: 'block', marginBottom: '2px' }}>สต็อกทั้งหมด</span>
                  <strong style={{ color: '#0F172A', fontSize: '16px' }}>{equipment.totalStock} ชิ้น</strong>
                </div>
                <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '24px' }}>
                  <span style={{ color: '#64748B', fontSize: '12px', display: 'block', marginBottom: '2px' }}>คงเหลือในคลัง</span>
                  <strong style={{ color: equipment.availableStock > 0 ? '#16A34A' : '#DC2626', fontSize: '16px' }}>
                    {equipment.availableStock > 0 ? `${equipment.availableStock} ชิ้น` : 'ของหมด'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Borrow Action Button */}
            <div style={{ marginTop: '32px' }}>
              {equipment.availableStock > 0 ? (
                <button 
                  onClick={handleBorrowClick}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '14px',
                    fontWeight: '800',
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(56, 189, 248, 0.35)',
                    transition: 'all 0.2s'
                  }}
                >
                  ⚡ ส่งคำขอยืมอุปกรณ์นี้
                </button>
              ) : (
                <button 
                  disabled 
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    background: '#E2E8F0', 
                    color: '#94A3B8', 
                    border: 'none', 
                    borderRadius: '14px', 
                    fontWeight: '800',
                    fontSize: '16px',
                    cursor: 'not-allowed' 
                  }}
                >
                  🔒 ของหมดชั่วคราว
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div style={{ 
        background: '#FFFFFF', 
        padding: '36px', 
        borderRadius: '24px', 
        border: '1px solid #E2E8F0', 
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.03)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '22px', color: '#0F172A', margin: 0, fontWeight: '800' }}>
            ⭐ รีวิวประสบการณ์ใช้งาน ({reviews.length})
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div 
                key={rev.id} 
                style={{ 
                  padding: '20px', 
                  borderRadius: '16px', 
                  border: '1px solid #F1F5F9', 
                  background: '#F8FAFC'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>👤</span>
                    <strong style={{ color: '#0F172A', fontSize: '15px' }}>{rev.userName}</strong>
                  </div>
                  <span style={{ color: '#F59E0B', fontSize: '14px', background: '#FEF3C7', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>
                    {'⭐'.repeat(rev.rating)}
                  </span>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                  "{rev.comment}"
                </p>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>📅 วันที่รีวิว: {rev.date}</span>
              </div>
            ))
          ) : (
            <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>ยังไม่มีรีวิวสำหรับอุปกรณ์ชิ้นนี้</p>
          )}
        </div>
      </div>

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <BorrowModal isOpen={borrowModalOpen} onClose={() => setBorrowModalOpen(false)} equipment={equipment} />
    </div>
  );
}