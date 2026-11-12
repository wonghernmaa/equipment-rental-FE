import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { MAX_BORROW_QTY } from '../constants';
import { todayTH, addDays } from '../utils/format';
import Modal from './Modal';
import Notice from './Notice';
import { labelStyle, inputStyle, btnPrimary, btnGhost } from './formStyles';

// ฟอร์มขอยืม -> POST /api/borrow-requests (สถานะ pending รอแอดมินอนุมัติ ยังไม่หักสต็อก)
// กฎของ BE: วันที่ยืมต้องไม่ใช่อดีต, วันที่คืนต้องหลังวันที่ยืม, จำนวนต้องไม่เกินที่ว่าง
export default function BorrowModal({ isOpen, onClose, equipment, onSuccess }) {
  if (!isOpen || !equipment) return null;
  // key ทำให้ฟอร์มรีเซ็ตทุกครั้งที่เปิด/เปลี่ยนอุปกรณ์
  return <BorrowForm key={equipment.id} equipment={equipment} onClose={onClose} onSuccess={onSuccess} />;
}

function BorrowForm({ equipment, onClose, onSuccess }) {
  const navigate = useNavigate();
  const today = todayTH();
  const maxQty = Math.max(1, Math.min(MAX_BORROW_QTY, equipment.availableQty));

  const [borrowDate, setBorrowDate] = useState(today);
  const [returnDate, setReturnDate] = useState(addDays(today, 1));
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleBorrowDate = (v) => {
    setBorrowDate(v);
    if (v && returnDate <= v) setReturnDate(addDays(v, 1)); // วันคืนต้องหลังวันยืม
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) return setError('กรุณาระบุจำนวนที่ต้องการยืมให้ถูกต้อง');
    if (qty > MAX_BORROW_QTY) return setError(`จำกัดการยืมสูงสุดไม่เกิน ${MAX_BORROW_QTY} ชิ้นต่อครั้ง`);
    if (qty > equipment.availableQty) return setError(`อุปกรณ์นี้เหลือให้ยืมแค่ ${equipment.availableQty} ชิ้นเท่านั้น`);
    if (!borrowDate || borrowDate < today) return setError('วันที่ยืมต้องไม่ใช่วันที่ผ่านมาแล้ว');
    if (!returnDate || returnDate <= borrowDate) return setError('วันที่คืนต้องอยู่หลังวันที่ยืม');

    setSubmitting(true);
    try {
      await api.createBorrow({ equipmentId: equipment.id, quantity: qty, borrowDate, returnDate });
      setDone(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message); // เช่น OUT_OF_STOCK, BAD_DATE, FORBIDDEN
      if (err.code === 'OUT_OF_STOCK' && onSuccess) onSuccess(); // ให้รายการรีเฟรชสต็อกล่าสุด
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Modal onClose={onClose} maxWidth={420}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🎉</span>
          <h3 style={{ margin: '0 0 8px 0', color: '#0F172A', fontSize: '20px', fontWeight: '900' }}>ส่งคำขอยืมเรียบร้อย</h3>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px 0', lineHeight: 1.6 }}>
            คำขอยืม <strong style={{ color: '#0F172A' }}>{equipment.name}</strong> อยู่ในสถานะรออนุมัติ
            ติดตามผลได้ที่หน้าประวัติการยืม
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ ...btnGhost, flex: 1 }}>ปิด</button>
            <button type="button" onClick={() => { onClose(); navigate('/my-borrowings'); }} style={{ ...btnPrimary, flex: 1 }}>ดูประวัติการยืม</button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} busy={submitting} maxWidth={450}>
      <h3 style={{ margin: '0 0 4px 0', color: '#1E293B', fontSize: '18px' }}>📋 ฟอร์มขอยืมอุปกรณ์</h3>
      <p style={{ color: '#2563EB', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
        {equipment.name} <span style={{ color: '#64748B', fontWeight: 'normal', fontSize: '12px' }}>(คงเหลือ: {equipment.availableQty} ชิ้น)</span>
      </p>

      <Notice>{error}</Notice>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label htmlFor="bw-from" style={labelStyle}>วันที่ต้องการยืม</label>
          <input id="bw-from" type="date" required min={today} value={borrowDate} onChange={(e) => handleBorrowDate(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="bw-to" style={labelStyle}>กำหนดวันคืน</label>
          <input id="bw-to" type="date" required min={borrowDate ? addDays(borrowDate, 1) : today} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="bw-qty" style={labelStyle}>
            จำนวนที่ต้องการยืม <span style={{ color: '#E11D48', fontWeight: 'normal' }}>(สูงสุดไม่เกิน {maxQty} ชิ้น)</span>
          </label>
          <input id="bw-qty" type="number" min="1" max={maxQty} required value={quantity} onChange={(e) => setQuantity(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          <button type="button" onClick={onClose} disabled={submitting} style={{ ...btnGhost, flex: 1 }}>ยกเลิก</button>
          <button type="submit" disabled={submitting} style={{ ...btnPrimary, flex: 1, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? 'กำลังส่งคำขอ...' : 'ยืนยันการยืม'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
