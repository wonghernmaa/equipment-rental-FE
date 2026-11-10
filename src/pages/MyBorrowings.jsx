import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function MyBorrowings() {
  const { user } = useAuth();

  const [borrowings, setBorrowings] = useState([
    {
      id: 1,
      equipmentName: "Sony Mirrorless Camera Alpha 6400",
      quantity: 1,
      borrowDate: "2026-11-15",
      returnDate: "2026-11-18",
      purpose: "ถ่ายโปรเจกต์วิดีโอส่งอาจารย์",
      status: "รออนุมัติ"
    },
    {
      id: 2,
      equipmentName: "Shure SM58 Vocal Microphone",
      quantity: 2,
      borrowDate: "2026-11-10",
      returnDate: "2026-11-12",
      purpose: "อัดเสียงพอดแคสต์กิจกรรม",
      status: "กำลังใช้งาน"
    }
  ]);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleCancel = (id) => {
    setBorrowings(borrowings.filter(item => item.id !== id));
  };

  const handleReturn = (id) => {
    setBorrowings(borrowings.map(item => 
      item.id === id ? { ...item, status: 'คืนสำเร็จ' } : item
    ));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    alert(`บันทึกรีวิวสำหรับ "${selectedItemForReview.equipmentName}" เรียบร้อยแล้ว! ข้อมูลรีวิวจะไปแสดงในหน้ารายละเอียดอุปกรณ์`);
    setReviewModalOpen(false);
    setComment('');
  };

  // นับสถิติต่างๆ
  const pendingCount = borrowings.filter(i => i.status === 'รออนุมัติ').length;
  const activeCount = borrowings.filter(i => i.status === 'กำลังใช้งาน').length;
  const completedCount = borrowings.filter(i => i.status === 'คืนสำเร็จ').length;

  return (
    <div style={{ maxWidth: '1040px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Header & Quick Stats */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ color: '#0F172A', fontSize: '28px', margin: '0 0 8px 0', fontWeight: '900' }}>
          📦 ประวัติการยืมอุปกรณ์ของฉัน
        </h2>
        <p style={{ color: '#64748B', fontSize: '15px', margin: 0 }}>
          ติดตามสถานะคำขอ คืนอุปกรณ์ และแชร์รีวิวประสบการณ์ใช้งาน
        </p>
      </div>

      {/* Cards สรุปสถิติ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#D97706', background: '#FEF3C7', padding: '4px 10px', borderRadius: '20px' }}>⏳ รอการอนุมัติ</span>
          <h3 style={{ fontSize: '28px', color: '#0F172A', margin: '12px 0 0 0', fontWeight: '900' }}>{pendingCount} รายการ</h3>
        </div>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#0284C7', background: '#E0F2FE', padding: '4px 10px', borderRadius: '20px' }}>🔵 กำลังใช้งาน</span>
          <h3 style={{ fontSize: '28px', color: '#0F172A', margin: '12px 0 0 0', fontWeight: '900' }}>{activeCount} รายการ</h3>
        </div>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#15803D', background: '#DCFCE7', padding: '4px 10px', borderRadius: '20px' }}>✅ คืนสำเร็จแล้ว</span>
          <h3 style={{ fontSize: '28px', color: '#0F172A', margin: '12px 0 0 0', fontWeight: '900' }}>{completedCount} รายการ</h3>
        </div>
      </div>

      {/* รายการประวัติยืม */}
      {borrowings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', color: '#64748B' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>📭</span>
          <p style={{ fontSize: '16px', margin: 0 }}>ยังไม่มีประวัติการขอยืมอุปกรณ์</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {borrowings.map((item) => (
            <div key={item.id} style={{
              background: '#FFFFFF',
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div style={{ flex: '1 1 320px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: '#0F172A', fontSize: '18px', fontWeight: '800' }}>{item.equipmentName}</h4>
                  <span style={{
                    background: item.status === 'รออนุมัติ' ? '#FEF3C7' : item.status === 'กำลังใช้งาน' ? '#E0F2FE' : '#DCFCE7',
                    color: item.status === 'รออนุมัติ' ? '#D97706' : item.status === 'กำลังใช้งาน' ? '#0284C7' : '#15803D',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    ● {item.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '13px', color: '#475569' }}>
                  <div>📌 <strong>จำนวนที่ยืม:</strong> {item.quantity} ชิ้น</div>
                  <div>📅 <strong>กำหนดการ:</strong> {item.borrowDate} ถึง {item.returnDate}</div>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748B' }}>💬 <strong>วัตถุประสงค์:</strong> {item.purpose}</p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {item.status === 'รออนุมัติ' && (
                  <button 
                    onClick={() => handleCancel(item.id)}
                    style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                  >
                    ยกเลิกคำขอ
                  </button>
                )}

                {item.status === 'กำลังใช้งาน' && (
                  <button 
                    onClick={() => handleReturn(item.id)}
                    style={{ background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)' }}
                  >
                    🔄 คืนอุปกรณ์นี้
                  </button>
                )}

                {item.status === 'คืนสำเร็จ' && (
                  <button 
                    onClick={() => {
                      setSelectedItemForReview(item);
                      setReviewModalOpen(true);
                    }}
                    style={{ background: '#16A34A', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)' }}
                  >
                    ⭐ เขียนรีวิวอุปกรณ์
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal เขียนรีวิว */}
      {reviewModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '24px', maxWidth: '480px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#0F172A', fontSize: '20px', fontWeight: '900' }}>✍️ เขียนรีวิว: {selectedItemForReview?.equipmentName}</h3>
            
            <form onSubmit={handleSubmitReview}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>ให้คะแนนความพึงพอใจ:</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', background: '#F8FAFC' }}>
                  <option value={5}>⭐⭐⭐⭐⭐ (5 ดาว - ดีเยี่ยม)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 ดาว - ดีมาก)</option>
                  <option value={3}>⭐⭐⭐ (3 ดาว - ปานกลาง)</option>
                  <option value={2}>⭐⭐ (2 ดาว - พอใช้)</option>
                  <option value={1}>⭐ (1 ดาว - ควรปรับปรุง)</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>ความคิดเห็นเพิ่มเติม:</label>
                <textarea 
                  rows="4" 
                  placeholder="แชร์ความรู้สึกเกี่ยวกับการใช้งาน สภาพอุปกรณ์..." 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setReviewModalOpen(false)} style={{ background: '#F1F5F9', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
                  ยกเลิก
                </button>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)', color: '#FFFFFF', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)' }}>
                  ส่งรีวิว
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}