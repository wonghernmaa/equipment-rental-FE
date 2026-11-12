import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api';
import { LoadingState, EmptyState, ErrorState } from '../components/UIStates';
import { statusMeta, formatDateTime } from '../utils/format';

const SUMMARY = [
  { status: 'pending', icon: '⏳' },
  { status: 'approved', icon: '🔵' },
  { status: 'returned', icon: '✅' },
  { status: 'rejected', icon: '❌' },
];

// ประวัติการยืมของฉัน -> GET /api/me/borrow-requests
// หมายเหตุ: BE ให้เฉพาะแอดมินเป็นคนกดอนุมัติ/ปฏิเสธ/รับคืน สมาชิกจึงดูสถานะได้อย่างเดียว
export default function MyBorrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBorrowings(await api.myBorrows());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const count = (status) => borrowings.filter((b) => b.status === status).length;

  return (
    <div style={{ maxWidth: '1040px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ color: '#0F172A', fontSize: '28px', margin: '0 0 8px 0', fontWeight: '900' }}>📦 ประวัติการยืมอุปกรณ์ของฉัน</h2>
        <p style={{ color: '#64748B', fontSize: '15px', margin: 0 }}>ติดตามสถานะคำขอยืมของคุณ เมื่อได้รับอนุมัติให้นำอุปกรณ์ไปรับและนำมาคืนตามกำหนด</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {SUMMARY.map(({ status, icon }) => {
          const m = statusMeta(status);
          return (
            <div key={status} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: m.color, background: m.bg, padding: '4px 10px', borderRadius: '20px' }}>{icon} {m.label}</span>
              <h3 style={{ fontSize: '28px', color: '#0F172A', margin: '12px 0 0 0', fontWeight: '900' }}>{loading ? '-' : count(status)} รายการ</h3>
            </div>
          );
        })}
      </div>

      {loading ? (
        <LoadingState message="กำลังโหลดประวัติการยืมของคุณ..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : borrowings.length === 0 ? (
        <>
          <EmptyState title="ยังไม่มีประวัติการขอยืมอุปกรณ์" description="คุณยังไม่ได้ทำรายการขอยืมอุปกรณ์ใดๆ ในระบบ ลองเลือกชมและยืมอุปกรณ์จากหน้าแค็ตตาล็อกได้เลยครับ" />
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/equipments" style={{ color: '#0284C7', fontWeight: '700', textDecoration: 'none' }}>ไปดูรายการอุปกรณ์ ➔</Link>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {borrowings.map((item) => {
            const meta = statusMeta(item.status);
            return (
              <div key={item.id} style={{
                background: '#FFFFFF', padding: '24px', borderRadius: '20px',
                border: item.status === 'rejected' ? '1px solid #FCA5A5' : '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <h4 style={{ margin: 0, color: '#0F172A', fontSize: '18px', fontWeight: '800' }}>{item.equipmentName}</h4>
                  <span style={{ background: meta.bg, color: meta.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>● {meta.label}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '13px', color: '#475569' }}>
                  <div>📌 <strong>จำนวนที่ยืม:</strong> {item.quantity} ชิ้น</div>
                  <div>📅 <strong>กำหนดการ:</strong> {item.borrowDate} ถึง {item.returnDate}</div>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#94A3B8' }}>
                  ส่งคำขอเมื่อ {formatDateTime(item.createdAt)}
                  {item.returnedAt && ` · คืนเมื่อ ${formatDateTime(item.returnedAt)}`}
                </p>

                {item.status === 'pending' && (
                  <div style={{ marginTop: '12px', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', color: '#B45309' }}>
                    ⏳ รอแอดมินตรวจสอบและอนุมัติคำขอ
                  </div>
                )}
                {item.status === 'approved' && (
                  <div style={{ marginTop: '12px', background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', color: '#0369A1' }}>
                    🔵 อนุมัติแล้ว — กรุณานำอุปกรณ์มาคืนภายใน {item.returnDate} แอดมินจะเป็นผู้กดรับคืนในระบบ
                  </div>
                )}
                {item.status === 'rejected' && (
                  <div style={{ marginTop: '12px', background: '#FEF2F2', border: '1px solid #FECACA', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', color: '#DC2626' }}>
                    ❌ คำขอนี้ไม่ได้รับการอนุมัติ หากมีข้อสงสัยกรุณาติดต่อผู้ดูแลระบบ
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
