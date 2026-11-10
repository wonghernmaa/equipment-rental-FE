import React, { useState } from 'react';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      studentName: "กฤษฎา คงแก้ว",
      studentId: "650710668",
      equipmentName: "Sony Mirrorless Camera Alpha 6400",
      quantity: 1,
      borrowDate: "2026-11-15",
      returnDate: "2026-11-18",
      purpose: "ถ่ายโปรเจกต์วิดีโอส่งอาจารย์",
      status: "รออนุมัติ"
    },
    {
      id: 2,
      studentName: "สมชาย ใจดี",
      studentId: "650710999",
      equipmentName: "Shure SM58 Vocal Microphone",
      quantity: 2,
      borrowDate: "2026-11-12",
      returnDate: "2026-11-14",
      purpose: "จัดกิจกรรมดนตรี",
      status: "รออนุมัติ"
    }
  ]);

  const handleApprove = (id) => {
    setRequests(requests.map(item => 
      item.id === id ? { ...item, status: 'กำลังใช้งาน' } : item
    ));
  };

  const handleReject = (id) => {
    setRequests(requests.map(item => 
      item.id === id ? { ...item, status: 'ปฏิเสธคำขอ' } : item
    ));
  };

  const pendingCount = requests.filter(r => r.status === 'รออนุมัติ').length;

  return (
    <div style={{ maxWidth: '1040px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Admin Control Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: '24px',
        padding: '36px 40px',
        color: '#FFFFFF',
        marginBottom: '32px',
        boxShadow: '0 15px 30px rgba(15, 23, 42, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <span style={{ background: 'rgba(253, 224, 71, 0.15)', color: '#FDE047', border: '1px solid rgba(253, 224, 71, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
            🛡️ ADMIN CONTROL PANEL
          </span>
          <h2 style={{ fontSize: '28px', margin: '12px 0 6px 0', fontWeight: '900' }}>หน้าจัดการหลังบ้าน khongunai</h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>ตรวจสอบและอนุมัติคำขอยืมอุปกรณ์จากสมาชิกในระบบ</p>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '14px 24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', fontWeight: '600' }}>คำขอที่รอการอนุมัติ</span>
          <strong style={{ fontSize: '28px', color: '#FDE047', fontWeight: '900' }}>{pendingCount} รายการ</strong>
        </div>
      </div>

      {/* คำขอยืมอุปกรณ์ทั้งหมด */}
      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', color: '#64748B' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>✨</span>
          <p style={{ fontSize: '16px', margin: 0 }}>ไม่มีคำขอยืมอุปกรณ์ที่รอการอนุมัติ</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {requests.map((item) => (
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
              <div style={{ flex: '1 1 340px' }}>
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

                <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '12px', border: '1px solid #F1F5F9', fontSize: '13px', color: '#334155', marginBottom: '10px' }}>
                  <div>🧑‍🎓 <strong>ผู้ขอยืม:</strong> {item.studentName} (ID: {item.studentId})</div>
                  <div style={{ marginTop: '4px' }}>📌 <strong>จำนวน:</strong> {item.quantity} ชิ้น | 📅 <strong>วันที่ยืม-คืน:</strong> {item.borrowDate} ถึง {item.returnDate}</div>
                </div>

                <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>💬 <strong>วัตถุประสงค์:</strong> {item.purpose}</p>
              </div>

              {/* ปุ่มการอนุมัติ */}
              {item.status === 'รออนุมัติ' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleApprove(item.id)}
                    style={{
                      padding: '10px 22px',
                      background: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    อนุมัติคำขอ
                  </button>
                  <button 
                    onClick={() => handleReject(item.id)}
                    style={{
                      padding: '10px 20px',
                      background: '#FEE2E2',
                      color: '#DC2626',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    ปฏิเสธ
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}