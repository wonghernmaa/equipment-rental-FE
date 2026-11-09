import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { mockEquipments } from '../data/mockEquipments';
import EquipmentCard from '../components/EquipmentCard';
import AuthModal from '../components/AuthModal';
import BorrowModal from '../components/BorrowModal';

export default function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // กำหนดหมวดหมู่ตามที่คุณต้องการ
  const categories = ['ทั้งหมด', 'กีฬา', 'ไอที', 'อุปกรณ์ถ่ายภาพ', 'อื่นๆ'];

  // กรองข้อมูลตาม Search, หมวดหมู่ และสถานะ
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
    if (user.role === 'guest') {
      setAuthModalOpen(true);
    } else {
      setSelectedEquipment(equipment);
      setBorrowModalOpen(true);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
      <h2 style={{ fontSize: '22px', color: '#1E293B', marginBottom: '20px', fontWeight: '700' }}>
        📦 รายการอุปกรณ์ทั้งหมด
      </h2>

      {/* Search & Filter Bar */}
      <div style={{
        background: '#FFFFFF',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* ช่องค้นหา */}
        <input 
          type="text"
          placeholder="🔍 ค้นหาชื่ออุปกรณ์..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: '1 1 220px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            fontSize: '14px',
            outline: 'none',
            background: '#F8FAFC'
          }}
        />

        {/* ตัวกรองประเภท พร้อมข้อความกำกับข้างนอก */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>ประเภท:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '14px',
              background: '#F8FAFC',
              color: '#1E293B',
              cursor: 'pointer'
            }}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* ตัวกรองสถานะ พร้อมข้อความกำกับข้างนอก */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>สถานะ:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '14px',
              background: '#F8FAFC',
              color: '#1E293B',
              cursor: 'pointer'
            }}
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="มีของพร้อมยืม">มีของพร้อมยืม</option>
            <option value="ของหมด">ของหมด</option>
          </select>
        </div>
      </div>

      {/* Grid แสดงการ์ดอุปกรณ์ขนาดกะทัดรัด */}
      {filteredEquipments.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {filteredEquipments.map((equipment) => (
            <EquipmentCard 
              key={equipment.id} 
              equipment={equipment} 
              onBorrow={handleBorrowClick} 
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>
          <p style={{ fontSize: '16px' }}>❌ ไม่พบอุปกรณ์ที่คุณค้นหา</p>
        </div>
      )}

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

      <BorrowModal 
        isOpen={borrowModalOpen} 
        onClose={() => setBorrowModalOpen(false)} 
        equipment={selectedEquipment} 
      />
    </div>
  );
}