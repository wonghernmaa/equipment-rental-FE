import React, { useState } from 'react';

export default function BorrowModal({ isOpen, onClose, equipment }) {
  const [borrowDate, setBorrowDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !equipment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const qtyNum = parseInt(quantity);

    // ตรวจสอบเงื่อนไขจำนวนที่ยืม
    if (qtyNum > 3) {
      setError('จำกัดการยืมสูงสุดไม่เกิน 3 ชิ้นต่อครั้งครับ');
      return;
    }

    if (qtyNum > equipment.availableStock) {
      setError(`อุปกรณ์นี้เหลือให้ยืมแค่ ${equipment.availableStock} ชิ้นเท่านั้น`);
      return;
    }

    if (qtyNum <= 0) {
      setError('กรุณาระบุจำนวนที่ต้องการยืมให้ถูกต้อง');
      return;
    }

    alert(`ทำรายการยืม "${equipment.name}" จำนวน ${qtyNum} ชิ้น สำเร็จ!\nกำหนดคืน: ${returnDate}`);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#FFFFFF',
        padding: '28px',
        borderRadius: '16px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 4px 0', color: '#1E293B', fontSize: '18px' }}>📋 ฟอร์มขอยืมอุปกรณ์</h3>
        <p style={{ color: '#2563EB', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
          {equipment.name} <span style={{ color: '#64748B', fontWeight: 'normal', fontSize: '12px' }}>(คงเหลือ: {equipment.availableStock} ชิ้น)</span>
        </p>

        {error && (
          <div style={{
            background: '#FEF2F2',
            color: '#DC2626',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            marginBottom: '14px',
            border: '1px solid #FCA5A5'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>วันที่ต้องการยืม</label>
            <input 
              type="date" 
              required
              value={borrowDate}
              onChange={(e) => setBorrowDate(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>กำหนดวันคืน</label>
            <input 
              type="date" 
              required
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
              จำนวนที่ต้องการยืม <span style={{ color: '#E11D48', fontWeight: 'normal' }}>(สูงสุดไม่เกิน 3 ชิ้น)</span>
            </label>
            <input 
              type="number" 
              min="1" 
              max="3"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>วัตถุประสงค์ในการใช้งาน</label>
            <textarea 
              rows="2"
              placeholder="ระบุวิชา หรือโปรเจกต์ที่ใช้งาน..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '10px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              style={{ flex: 1, padding: '10px', background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              ยืนยันการยืม
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}