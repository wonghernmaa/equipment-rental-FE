import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as api from '../api';
import AdminTabs from '../components/AdminTabs';
import ConfirmModal from '../components/ConfirmModal';
import Notice from '../components/Notice';
import { LoadingState, EmptyState, ErrorState } from '../components/UIStates';
import { statusMeta, formatDateTime, todayTH } from '../utils/format';

const FILTERS = [
  { value: 'pending', label: '⏳ รออนุมัติ' },
  { value: 'approved', label: '🔵 กำลังยืม' },
  { value: 'returned', label: '✅ คืนแล้ว' },
  { value: 'rejected', label: '❌ ปฏิเสธ' },
  { value: '', label: 'ทั้งหมด' },
];

const ACTIONS = {
  approve: { call: api.adminApprove, done: 'อนุมัติคำขอแล้ว (หักสต็อกเรียบร้อย)' },
  reject: { call: api.adminReject, done: 'ปฏิเสธคำขอแล้ว' },
  return: { call: api.adminReturn, done: 'รับคืนอุปกรณ์แล้ว (คืนสต็อกเรียบร้อย)' },
};

const statCard = (label, value, color = '#38BDF8') => (
  <div key={label} style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '14px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', minWidth: '120px' }}>
    <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>{label}</span>
    <strong style={{ fontSize: '22px', color }}>{value}</strong>
  </div>
);

// หน้าแอดมิน: จัดการคำขอยืม (อนุมัติ / ปฏิเสธ / รับคืน) ต่อ BE จริง
export default function AdminDashboard() {
  const [status, setStatus] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null); // { action, request }
  const [confirmError, setConfirmError] = useState('');
  const reqId = useRef(0);

  const loadStats = useCallback(async () => {
    try {
      setStats(await api.adminStats());
    } catch {
      /* ตัวเลขสรุปโหลดไม่ได้ไม่ควรทำให้ทั้งหน้าพัง */
    }
  }, []);

  const loadRequests = useCallback(async (silent = false) => {
    const id = ++reqId.current;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const items = await api.adminListBorrows(status);
      if (id === reqId.current) {
        setRequests(items);
        setLoading(false);
      }
    } catch (e) {
      if (id === reqId.current) {
        setError(e.message);
        setLoading(false);
      }
    }
  }, [status]);

  useEffect(() => {
    loadRequests();
    return () => {
      reqId.current++;
    };
  }, [loadRequests]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const runAction = async (action, request) => {
    setBusyId(request.id);
    setConfirmError('');
    try {
      await ACTIONS[action].call(request.id);
      setNotice({ type: 'success', text: `${ACTIONS[action].done} — ${request.equipmentName}` });
      setConfirm(null);
      loadRequests(true);
      loadStats();
    } catch (e) {
      // เช่น 409 OUT_OF_STOCK / BAD_STATE (มีแอดมินอีกคนจัดการไปก่อน)
      if (confirm) setConfirmError(e.message);
      else setNotice({ type: 'error', text: e.message });
      if (e.code === 'BAD_STATE' || e.code === 'REQUEST_NOT_FOUND') {
        loadRequests(true);
        loadStats();
      }
    } finally {
      setBusyId(null);
    }
  };

  const today = todayTH();

  return (
    <div style={{ maxWidth: '1040px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0284C7 100%)', borderRadius: '24px',
        padding: '36px 40px', color: '#FFFFFF', marginBottom: '28px', boxShadow: '0 15px 35px rgba(15, 23, 42, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
              🛡️ ADMIN CONTROL PANEL
            </span>
            <h2 style={{ fontSize: '30px', margin: '12px 0 6px 0', fontWeight: '900', letterSpacing: '-0.5px' }}>หน้าจัดการหลังบ้าน khongunai</h2>
            <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>ตรวจสอบ อนุมัติ และรับคืนอุปกรณ์จากคำขอของสมาชิก</p>
          </div>
          {stats && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {statCard('รออนุมัติ', stats.pendingRequests)}
              {statCard('กำลังยืม', stats.activeLoans)}
              {statCard('ของหมด', `${stats.outOfStock}/${stats.equipment}`, stats.outOfStock ? '#FCA5A5' : '#38BDF8')}
              {statCard('สมาชิก', stats.members)}
            </div>
          )}
        </div>
        <AdminTabs />
      </div>

      {notice && <Notice type={notice.type} onClose={() => setNotice(null)}>{notice.text}</Notice>}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {FILTERS.map((f) => {
          const active = status === f.value;
          return (
            <button key={f.value || 'all'} onClick={() => setStatus(f.value)} aria-pressed={active}
              style={{
                padding: '9px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                border: active ? '1px solid #0284C7' : '1px solid #CBD5E1', background: active ? '#E0F2FE' : '#FFFFFF',
                color: active ? '#0284C7' : '#475569',
              }}>
              {f.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingState message="กำลังโหลดคำขอยืมจากระบบหลังบ้าน..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadRequests()} />
      ) : requests.length === 0 ? (
        <EmptyState title="ไม่มีรายการในหมวดนี้" description="เมื่อมีคำขอยืมใหม่จากสมาชิก จะแสดงที่นี่" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {requests.map((item) => {
            const meta = statusMeta(item.status);
            const overdue = item.status === 'approved' && item.returnDate < today;
            const busy = busyId === item.id;
            return (
              <div key={item.id} style={{
                background: '#FFFFFF', padding: '24px', borderRadius: '20px',
                border: item.status === 'rejected' ? '1px solid #FCA5A5' : overdue ? '1px solid #FDBA74' : '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: '20px',
              }}>
                <div style={{ flex: '1 1 350px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <h4 style={{ margin: 0, color: '#0F172A', fontSize: '18px', fontWeight: '800' }}>{item.equipmentName}</h4>
                    <span style={{ background: meta.bg, color: meta.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>● {meta.label}</span>
                    {overdue && (
                      <span style={{ background: '#FFEDD5', color: '#C2410C', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>⏰ เลยกำหนดคืน</span>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
                    <div>👤 <strong>ผู้ขอยืม:</strong> {item.memberName} <span style={{ color: '#94A3B8' }}>({item.memberEmail})</span></div>
                    <div>📌 <strong>จำนวน:</strong> {item.quantity} ชิ้น</div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
                    📅 <strong>วันที่ยืม-คืน:</strong> {item.borrowDate} ถึง {item.returnDate}
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>
                    ส่งคำขอเมื่อ {formatDateTime(item.createdAt)}
                    {item.returnedAt && ` · รับคืนเมื่อ ${formatDateTime(item.returnedAt)}`}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {item.status === 'pending' && (
                    <>
                      <button disabled={busy} onClick={() => runAction('approve', item)}
                        style={{ background: '#16A34A', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', opacity: busy ? 0.6 : 1 }}>
                        {busy ? 'กำลังทำรายการ...' : '✓ อนุมัติ'}
                      </button>
                      <button disabled={busy} onClick={() => { setConfirmError(''); setConfirm({ action: 'reject', request: item }); }}
                        style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', opacity: busy ? 0.6 : 1 }}>
                        ✕ ปฏิเสธ
                      </button>
                    </>
                  )}
                  {item.status === 'approved' && (
                    <button disabled={busy} onClick={() => { setConfirmError(''); setConfirm({ action: 'return', request: item }); }}
                      style={{ background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', opacity: busy ? 0.6 : 1 }}>
                      📥 รับคืนอุปกรณ์
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.action === 'reject' ? '⚠️ ปฏิเสธคำขอยืมนี้?' : '📥 ยืนยันรับคืนอุปกรณ์?'}
          danger={confirm.action === 'reject'}
          confirmLabel={confirm.action === 'reject' ? 'ยืนยันปฏิเสธ' : 'ยืนยันรับคืน'}
          busy={busyId === confirm.request.id}
          error={confirmError}
          onConfirm={() => runAction(confirm.action, confirm.request)}
          onCancel={() => setConfirm(null)}
        >
          {confirm.action === 'reject'
            ? <>คำขอยืม <strong style={{ color: '#0F172A' }}>{confirm.request.equipmentName}</strong> ของคุณ {confirm.request.memberName} จะถูกปฏิเสธ (ไม่กระทบสต็อก)</>
            : <>รับคืน <strong style={{ color: '#0F172A' }}>{confirm.request.equipmentName}</strong> จำนวน {confirm.request.quantity} ชิ้น จาก {confirm.request.memberName} และบวกสต็อกกลับเข้าคลัง</>}
        </ConfirmModal>
      )}
    </div>
  );
}
