import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { mockEquipments } from '../data/mockEquipments';
import EquipmentCard from '../components/EquipmentCard';
import AuthModal from '../components/AuthModal';
import BorrowModal from '../components/BorrowModal';

export default function Equipments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const categories = ['ทั้งหมด', 'อุปกรณ์ถ่ายภาพ', 'ไอที', 'กีฬา', 'อื่นๆ'];

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const filteredEquipments = mockEquipments.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus === 'มีของพร้อมยืม') {
      matchesStatus = item.availableStock > 0;
    } else if (selectedStatus === 'ของหมด') {
      matchesStatus = item.availableStock === 0;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleBorrowClick = (equipment) => {
    if (!user || user.role === 'guest') {
      setAuthModalOpen(true);
    } else {
      setSelectedEquipment(equipment);
      setBorrowModalOpen(true);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* 🌟 Header Banner สุดอลังการ */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0284C7 100%)',
        borderRadius: '24px',
        padding: '40px 48px',
        color: '#FFFFFF',
        marginBottom: '36px',
        boxShadow: '0 15px 35px rgba(15, 23, 42, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
            📦 KHONGUNAI CATALOGUE
          </span>
          <h2 style={{ fontSize: '32px', margin: '12px 0 6px 0', fontWeight: '900', letterSpacing: '-0.5px' }}>
            รายการอุปกรณ์ทั้งหมด
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
            เลือกดูอุปกรณ์สำหรับยืม-คืนในระบบ ค้นหาง่าย รวดเร็ว และตรวจสอบสถานะได้ทันที
          </p>
        </div>
        <div style={{ fontSize: '64px', opacity: 0.8 }}>
          ✨
        </div>
      </div>

      {/* 🔍 Search & Filter Control Bar แบบโมเดิร์น */}
      <div style={{
        background: '#FFFFFF',
        padding: '20px 24px',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        gap: '16px',
        marginBottom: '28px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* ช่องค้นหาแบบเดิมแต่ดีไซน์พรีเมียม */}
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <input 
            type="text"
            placeholder="🔍 ค้นหาชื่ออุปกรณ์ หรือรายละเอียด..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              fontSize: '14px',
              outline: 'none',
              background: '#F8FAFC',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* ตัวเลือกหมวดหมู่ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>ประเภท:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', background: '#F8FAFC', fontWeight: '600', color: '#0F172A', cursor: 'pointer', outline: 'none' }}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat === 'ทั้งหมด' ? 'ทุกประเภท' : cat}</option>
            ))}
          </select>
        </div>

        {/* ตัวเลือกสถานะ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>สถานะ:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', background: '#F8FAFC', fontWeight: '600', color: '#0F172A', cursor: 'pointer', outline: 'none' }}
          >
            <option value="ทั้งหมด">ทุกสถานะ</option>
            <option value="มีของพร้อมยืม">🟢 พร้อมยืม</option>
            <option value="ของหมด">🔴 ของหมด</option>
          </select>
        </div>
      </div>

      {/* ผลการค้นหา */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ margin: 0, color: '#64748B', fontSize: '14px', fontWeight: '600' }}>
          แสดงผลลัพธ์: <strong style={{ color: '#0F172A' }}>{filteredEquipments.length}</strong> รายการ
        </p>
      </div>

      {/* Grid แสดงอุปกรณ์ */}
      {filteredEquipments.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {filteredEquipments.map((equipment) => (
            <div 
              key={equipment.id} 
              onClick={() => navigate(`/equipment/${equipment.id}`)} 
              style={{ cursor: 'pointer' }}
            >
              <EquipmentCard equipment={equipment} onBorrow={handleBorrowClick} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', color: '#64748B' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🔍</span>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', margin: '0 0 6px 0' }}>ไม่พบอุปกรณ์ที่คุณค้นหา</p>
          <p style={{ fontSize: '14px', margin: 0 }}>ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูครับ</p>
        </div>
      )}

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <BorrowModal isOpen={borrowModalOpen} onClose={() => setBorrowModalOpen(false)} equipment={selectedEquipment} />
    </div>
  );
}