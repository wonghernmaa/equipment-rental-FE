import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

// 🌟 นำเข้า UI States ที่เราสร้างไว้ (ปรับ Path ให้ตรงกับโฟลเดอร์ components ของคุณ)
import { LoadingState, EmptyState } from '../components/UIStates';

export default function MyBorrowings() {
  const { user } = useAuth();

  // 🔄 เพิ่ม State สำหรับจำลองการโหลดข้อมูล
  const [loading, setLoading] = useState(true);

  const [borrowings, setBorrowings] = useState([
    {
      id: 1,
      equipmentName: "Sony Mirrorless Camera Alpha 6400",
      quantity: 1,
      borrowDate: "2026-11-15",
      returnDate: "2026-11-18",
      purpose: "ถ่ายโปรเจกต์วิดีโอส่งอาจารย์",
      status: "รออนุมัติ",
      rejectReason: ""
    },
    {
      id: 2,
      equipmentName: "Shure SM58 Vocal Microphone",
      quantity: 2,
      borrowDate: "2026-11-10",
      returnDate: "2026-11-12",
      purpose: "อัดเสียงพอดแคสต์กิจกรรม",
      status: "ถูกปฏิเสธ",
      rejectReason: "อุปกรณ์ชิ้นนี้ถูกจองคิวซ่อมบำรุงประจำสัปดาห์ ไม่สามารถให้ยืมได้ในเวลานี้ครับ"
    }
  ]);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // จำลองการโหลดข้อมูลประวัติการยืม
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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

    setBorrowings(borrowings.filter(item => item.id !== selectedItemForReview.id));
    setReviewModalOpen(false);
    setSuccessModalOpen(true);
    setComment('');
  };

  const pendingCount = borrowings.filter(i => i.status === 'รออนุมัติ').length;
  const activeCount = borrowings.filter(i => i.status === 'กำลังใช้งาน').length;
  const rejectedCount = borrowings.filter(i => i.status === 'ถูกปฏิเสธ').length;

  return (
    <div style={{ maxWidth: '1040px', margin: '40px auto', padding: '0 20px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ color: '#0F172A', fontSize: '28px', margin: '0 0 8px 0', fontWeight: '900' }}>
          📦 ประวัติการยืมอุปกรณ์ของฉัน
        </h2>
        <p style={{ color: '#64748B', fontSize: '15px', margin: 0 }}>
          ติดตามสถานะคำขอ ตรวจสอบเหตุผลจากแอดมิน และจัดการอุปกรณ์ของคุณ
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
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#DC2626', background: '#FEE2E2', padding: '4px 10px', borderRadius: '20px' }}>❌ ถูกปฏิเสธ</span>
          <h3 style={{ fontSize: '28px', color: '#0F172A', margin: '12px 0 0 0', fontWeight: '900' }}>{rejectedCount} รายการ</h3>
        </div>
      </div>

      {/* 🚀 การจัดการแสดงผลตามสถานะ Loading และ Empty State */}
      {loading ? (
        <LoadingState message="กำลังโหลดประวัติการยืมของคุณ..." />
      ) : borrowings.length === 0 ? (
        <EmptyState 
          title="ยังไม่มีประวัติการขอยืมอุปกรณ์" 
          description="คุณยังไม่ได้ทำรายการขอยืมอุปกรณ์ใดๆ ในระบบ ลองเลือกชมและยืมอุปกรณ์จากหน้าแค็ตตาล็อกได้เลยครับ" 
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {borrowings.map((item) => (
            <div key={item.id} style={{
              background: '#FFFFFF',
              padding: '24px',
              borderRadius: '20px',
              border: item.status === 'ถูกปฏิเสธ' ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
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
                    background: item.status === 'รออนุมัติ' ? '#FEF3C7' : item.status === 'กำลังใช้งาน' ? '#E0F2FE' : item.status === 'คืนสำเร็จ' ? '#DCFCE7' : '#FEE2E2',
                    color: item.status === 'รออนุมัติ' ? '#D97706' : item.status === 'กำลังใช้งาน' ? '#0284C7' : item.status === 'คืนสำเร็จ' ? '#15803D' : '#DC2626',
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

                {/* กล่องแสดงเหตุผลจากแอดมินกรณีถูกปฏิเสธ */}
                {item.status === 'ถูกปฏิเสธ' && item.rejectReason && (
                  <div style={{ marginTop: '12px', background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: '#DC2626', lineHeight: '1.5' }}>
                    ❌ <strong>เหตุผลที่ไม่สามารถยืมได้ (จากแอดมิน):</strong> {item.rejectReason}
                  </div>
                )}
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

                {item.status === 'ถูกปฏิเสธ' && (
                  <button 
                    onClick={() => handleCancel(item.id)}
                    style={{ background: '#F1F5F9', color: '#475569', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                  >
                    ลบประวัติรายการนี้
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Modal ขอบคุณรีวิว */}
      {successModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', padding: '36px', borderRadius: '24px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>💖</span>
            <h3 style={{ margin: '0 0 8px 0', color: '#0F172A', fontSize: '22px', fontWeight: '900' }}>ขอบคุณสำหรับรีวิวครับ!</h3>
            <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.6' }}>
              ความคิดเห็นของคุณถูกบันทึกและนำไปแสดงในหน้ารายละเอียดอุปกรณ์เรียบร้อยแล้ว
            </p>
            <button 
              onClick={() => setSuccessModalOpen(false)}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)' }}
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}