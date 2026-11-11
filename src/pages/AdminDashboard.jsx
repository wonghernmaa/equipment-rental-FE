import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

// 🌟 นำเข้า UI States ที่เราสร้างไว้ (ปรับ Path ให้ตรงกับโฟลเดอร์ components ของคุณ)
import { LoadingState, EmptyState } from '../components/UIStates';

export default function AdminDashboard() {
  const { user } = useAuth();

  // 🔄 เพิ่ม State สำหรับจำลองการโหลดข้อมูลหลังบ้าน
  const [loading, setLoading] = useState(true);

  // รายการคำขอยืมจำลอง
  const [requests, setRequests] = useState([
    {
      id: 1,
      equipmentName: "Sony Mirrorless Camera Alpha 6400",
      userName: "กฤษฎา คงแก้ว",
      userId: "650710668",
      quantity: 1,
      borrowDate: "2026-11-15",
      returnDate: "2026-11-18",
      purpose: "ถ่ายโปรเจกต์วิดีโอส่งอาจารย์",
      status: "กำลังใช้งาน"
    },
    {
      id: 2,
      equipmentName: "Shure SM58 Vocal Microphone",
      userName: "สมชาย ใจดี",
      userId: "650710999",
      quantity: 2,
      borrowDate: "2026-11-12",
      returnDate: "2026-11-14",
      purpose: "จัดกิจกรรมดนตรี",
      status: "รออนุมัติ"
    }
  ]);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // จำลองการโหลดข้อมูลแอดมิน
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // ฟังก์ชันอนุมัติ
  const handleApprove = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'กำลังใช้งาน' } : req
    ));
  };

  // เปิด Modal กรอกเหตุผลปฏิเสธ
  const openRejectModal = (req) => {
    setSelectedRequest(req);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  // ยืนยันการปฏิเสธพร้อมเหตุผล
  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;

    setRequests(requests.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, status: 'ถูกปฏิเสธ', rejectReason: rejectReason } 
        : req
    ));

    setRejectModalOpen(false);
    setSelectedRequest(null);
    setRejectReason('');
  };

  // ฟังก์ชันลบรายการออกจากหน้าจอแอดมิน (เคลียร์ไม่ให้รก)
  const handleDeleteRequest = (id) => {
    setRequests(requests.filter(item => item.id !== id));
  };

  const pendingCount = requests.filter(r => r.status === 'รออนุมัติ').length;

  return (
    <div style={{ maxWidth: '1040px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Admin Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0284C7 100%)',
        borderRadius: '24px',
        padding: '36px 40px',
        color: '#FFFFFF',
        marginBottom: '32px',
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
            🛡️ ADMIN CONTROL PANEL
          </span>
          <h2 style={{ fontSize: '30px', margin: '12px 0 6px 0', fontWeight: '900', letterSpacing: '-0.5px' }}>
            หน้าจัดการหลังบ้าน khongunai
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
            ตรวจสอบและอนุมัติคำขอยืมอุปกรณ์จากสมาชิกในระบบ
          </p>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>คำขอที่รอการอนุมัติ</span>
          <strong style={{ fontSize: '24px', color: '#38BDF8' }}>{pendingCount} รายการ</strong>
        </div>
      </div>

      {/* 🚀 การจัดการแสดงผลตามสถานะ Loading และ Empty State */}
      {loading ? (
        <LoadingState message="กำลังโหลดข้อมูลคำขอจากระบบหลังบ้าน..." />
      ) : requests.length === 0 ? (
        <EmptyState 
          title="ไม่มีรายการคำขอค้างอยู่ในระบบตอนนี้" 
          description="ยอดเยี่ยม! คุณได้จัดการตรวจสอบคำขอยืมอุปกรณ์ทั้งหมดเรียบร้อยแล้ว" 
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {requests.map((item) => (
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
              <div style={{ flex: '1 1 350px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: '#0F172A', fontSize: '18px', fontWeight: '800' }}>{item.equipmentName}</h4>
                  <span style={{
                    background: item.status === 'รออนุมัติ' ? '#FEF3C7' : item.status === 'กำลังใช้งาน' ? '#E0F2FE' : '#FEE2E2',
                    color: item.status === 'รออนุมัติ' ? '#D97706' : item.status === 'กำลังใช้งาน' ? '#0284C7' : '#DC2626',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    ● {item.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
                  <div>👤 <strong>ผู้ขอยืม:</strong> {item.userName} (ID: {item.userId})</div>
                  <div>📌 <strong>จำนวน:</strong> {item.quantity} ชิ้น</div>
                </div>
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
                  📅 <strong>วันที่ยืม-คืน:</strong> {item.borrowDate} ถึง {item.returnDate}
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>💬 <strong>วัตถุประสงค์:</strong> {item.purpose}</p>

                {/* แสดงเหตุผลถ้าถูกปฏิเสธ */}
                {item.status === 'ถูกปฏิเสธ' && item.rejectReason && (
                  <div style={{ marginTop: '10px', background: '#FEF2F2', border: '1px solid #FECACA', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', color: '#DC2626' }}>
                    ❌ <strong>เหตุผลที่ปฏิเสธ:</strong> {item.rejectReason}
                  </div>
                )}
              </div>

              {/* Action Buttons ตามสถานะ */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {item.status === 'รออนุมัติ' ? (
                  <>
                    <button 
                      onClick={() => handleApprove(item.id)}
                      style={{ background: '#16A34A', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)' }}
                    >
                      ✓ อนุมัติ
                    </button>
                    <button 
                      onClick={() => openRejectModal(item)}
                      style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}
                    >
                      ✕ ปฏิเสธ
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleDeleteRequest(item.id)}
                    style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                  >
                    🗑️ ลบรายการออก
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal กรอกเหตุผลเมื่อกดปฏิเสธ */}
      {rejectModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '24px', maxWidth: '460px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#0F172A', fontSize: '20px', fontWeight: '900' }}>⚠️ ระบุเหตุผลการปฏิเสธคำขอ</h3>
            <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 20px 0' }}>
              อุปกรณ์: <strong style={{ color: '#0F172A' }}>{selectedRequest?.equipmentName}</strong> ของคุณ <span style={{ color: '#0F172A' }}>{selectedRequest?.userName}</span>
            </p>

            <form onSubmit={handleConfirmReject}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>เหตุผลที่ไม่สามารถอนุมัติได้:</label>
                <textarea 
                  rows="4"
                  placeholder="กรุณาระบุข้อมูล"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setRejectModalOpen(false)} 
                  style={{ background: '#F1F5F9', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)' }}
                >
                  ยืนยัน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}