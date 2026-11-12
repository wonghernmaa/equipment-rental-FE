import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import * as api from '../api';
import { LoadingState, ErrorState } from '../components/UIStates';
import BorrowModal from '../components/BorrowModal';
import AuthModal from '../components/AuthModal';
import SafeImage from '../components/SafeImage';

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canBorrow } = useAuth();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
      setNotFound(false);
    }
    try {
      setEquipment(await api.getEquipment(id));
    } catch (e) {
      if (e.status === 404 || e.code === 'BAD_ID') setNotFound(true);
      else if (!silent) setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleBorrowClick = () => {
    if (!canBorrow) {
      setAuthModalOpen(true);
    } else {
      setBorrowModalOpen(true);
    }
  };

  if (loading) return <div style={{ maxWidth: '1040px', margin: '40px auto', padding: '0 20px' }}><LoadingState message="กำลังโหลดข้อมูลอุปกรณ์..." /></div>;
  if (notFound) {
    return (
      <div style={{ maxWidth: '1040px', margin: '40px auto', padding: '0 20px' }}>
        <ErrorState message="ไม่พบอุปกรณ์นี้ หรืออุปกรณ์ถูกลบออกจากระบบแล้ว" />
        <button onClick={() => navigate('/equipments')} style={{ marginTop: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>⬅️ กลับไปรายการอุปกรณ์</button>
      </div>
    );
  }
  if (error || !equipment) {
    return <div style={{ maxWidth: '1040px', margin: '40px auto', padding: '0 20px' }}><ErrorState message={error || 'โหลดข้อมูลไม่สำเร็จ'} onRetry={() => load()} /></div>;
  }

  return (
    <div style={{ maxWidth: '1040px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* ปุ่มย้อนกลับ */}
      <button 
        onClick={() => navigate(-1)}
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
        ⬅️ ย้อนกลับ
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
            <SafeImage src={equipment.imageUrl} alt={equipment.name} iconSize={72} />
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
                  <strong style={{ color: '#0F172A', fontSize: '16px' }}>{equipment.totalQty} ชิ้น</strong>
                </div>
                <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '24px' }}>
                  <span style={{ color: '#64748B', fontSize: '12px', display: 'block', marginBottom: '2px' }}>คงเหลือในคลัง</span>
                  <strong style={{ color: equipment.availableQty > 0 ? '#16A34A' : '#DC2626', fontSize: '16px' }}>
                    {equipment.availableQty > 0 ? `${equipment.availableQty} ชิ้น` : 'ของหมด'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Borrow Action Button */}
            <div style={{ marginTop: '32px' }}>
              {equipment.availableQty > 0 ? (
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

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <BorrowModal isOpen={borrowModalOpen} onClose={() => setBorrowModalOpen(false)} equipment={equipment} onSuccess={() => load(true)} />
    </div>
  );
}