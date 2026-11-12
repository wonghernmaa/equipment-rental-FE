import React, { useState, useMemo } from 'react';
import * as api from '../api';
import useEquipments from '../hooks/useEquipments';
import useCategories from '../hooks/useCategories';
import SafeImage from '../components/SafeImage';
import AdminTabs from '../components/AdminTabs';
import EquipmentFormModal from '../components/EquipmentFormModal';
import ConfirmModal from '../components/ConfirmModal';
import Notice from '../components/Notice';
import { LoadingState, EmptyState, ErrorState } from '../components/UIStates';
import { inputStyle, btnPrimary } from '../components/formStyles';

// หน้าแอดมิน: เพิ่ม / แก้ไข / ลบ(ซ่อน) อุปกรณ์ทั้งหมด
export default function AdminEquipments() {
  const { items, loading, error, reload } = useEquipments();
  const categories = useCategories();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ทั้งหมด');
  const [formState, setFormState] = useState(null); // null = ปิด, { equipment } = เปิด (equipment null = เพิ่มใหม่)
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [notice, setNotice] = useState(null); // { type, text }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      const okCat = category === 'ทั้งหมด' || it.category === category;
      const okSearch = !q || it.name.toLowerCase().includes(q) || (it.description || '').toLowerCase().includes(q);
      return okCat && okSearch;
    });
  }, [items, search, category]);

  const outOfStock = items.filter((it) => it.availableQty === 0).length;

  const handleSaved = (saved, isEdit) => {
    setFormState(null);
    setNotice({ type: 'success', text: `${isEdit ? 'แก้ไข' : 'เพิ่ม'}อุปกรณ์ "${saved.name}" เรียบร้อยแล้ว` });
    reload({ silent: true });
  };

  const openDelete = (eq) => {
    setDeleting(eq);
    setDeleteError('');
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    setDeleteError('');
    try {
      await api.adminDeleteEquipment(deleting.id);
      setNotice({ type: 'success', text: `ลบอุปกรณ์ "${deleting.name}" แล้ว (ประวัติการยืมยังอยู่ครบ)` });
      setDeleting(null);
      reload({ silent: true });
    } catch (e) {
      // 409 HAS_ACTIVE_LOANS = ยังมีคำขอที่ค้างอยู่ / 404 = ถูกลบไปก่อนแล้ว
      setDeleteError(e.message);
      if (e.status === 404) reload({ silent: true });
    } finally {
      setDeleteBusy(false);
    }
  };

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
            <h2 style={{ fontSize: '30px', margin: '12px 0 6px 0', fontWeight: '900', letterSpacing: '-0.5px' }}>จัดการอุปกรณ์</h2>
            <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>เพิ่ม แก้ไขข้อมูล ปรับจำนวนสต็อก และลบอุปกรณ์ในคลัง</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '14px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>อุปกรณ์ทั้งหมด</span>
              <strong style={{ fontSize: '22px', color: '#38BDF8' }}>{items.length}</strong>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '14px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>ของหมด</span>
              <strong style={{ fontSize: '22px', color: outOfStock ? '#FCA5A5' : '#38BDF8' }}>{outOfStock}</strong>
            </div>
          </div>
        </div>
        <AdminTabs />
      </div>

      {notice && <Notice type={notice.type} onClose={() => setNotice(null)}>{notice.text}</Notice>}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        <input aria-label="ค้นหาอุปกรณ์" placeholder="🔍 ค้นหาชื่อหรือรายละเอียด..." value={search}
          onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, flex: '1 1 260px', background: '#FFFFFF' }} />
        <select aria-label="กรองหมวดหมู่" value={category} onChange={(e) => setCategory(e.target.value)}
          style={{ ...inputStyle, width: 'auto', background: '#FFFFFF', cursor: 'pointer', fontWeight: '600' }}>
          <option value="ทั้งหมด">ทุกหมวดหมู่</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setFormState({ equipment: null })} style={btnPrimary}>➕ เพิ่มอุปกรณ์</button>
      </div>

      {loading ? (
        <LoadingState message="กำลังโหลดรายการอุปกรณ์..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={items.length === 0 ? 'ยังไม่มีอุปกรณ์ในคลัง' : 'ไม่พบอุปกรณ์ที่ตรงกับตัวกรอง'}
          description={items.length === 0 ? 'กด "เพิ่มอุปกรณ์" เพื่อเริ่มสร้างรายการแรก' : 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่'}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((eq) => {
            const borrowed = eq.totalQty - eq.availableQty;
            return (
              <div key={eq.id} style={{
                background: '#FFFFFF', padding: '16px 20px', borderRadius: '20px', border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap',
              }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '14px', background: '#F1F5F9', overflow: 'hidden', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                }}>
                  <SafeImage src={eq.imageUrl} alt={eq.name} iconSize={28} />
                </div>

                <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, color: '#0F172A', fontSize: '16px', fontWeight: '800' }}>{eq.name}</h4>
                    <span style={{ fontSize: '11px', color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>{eq.category}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {eq.description || 'ไม่มีรายละเอียด'}
                  </p>
                </div>

                <div style={{ fontSize: '13px', color: '#475569', minWidth: '150px' }}>
                  <div>คงเหลือ: <strong style={{ color: eq.availableQty > 0 ? '#16A34A' : '#DC2626' }}>{eq.availableQty} / {eq.totalQty}</strong> ชิ้น</div>
                  <div style={{ color: '#94A3B8', fontSize: '12px' }}>ถูกยืมอยู่ {borrowed} ชิ้น</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setFormState({ equipment: eq })}
                    style={{ background: '#E0F2FE', color: '#0284C7', border: 'none', padding: '9px 16px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                    ✏️ แก้ไข
                  </button>
                  <button onClick={() => openDelete(eq)}
                    style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '9px 16px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                    🗑️ ลบ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formState && (
        <EquipmentFormModal
          key={formState.equipment ? formState.equipment.id : 'new'}
          equipment={formState.equipment}
          categories={categories}
          onClose={() => setFormState(null)}
          onSaved={handleSaved}
        />
      )}

      {deleting && (
        <ConfirmModal title="🗑️ ลบอุปกรณ์นี้?" danger confirmLabel="ยืนยันการลบ" busy={deleteBusy} error={deleteError}
          onConfirm={handleDelete} onCancel={() => setDeleting(null)}>
          อุปกรณ์ <strong style={{ color: '#0F172A' }}>{deleting.name}</strong> จะถูกซ่อนออกจากระบบ
          ส่วนประวัติการยืมเดิมยังอยู่ครบ — ลบไม่ได้หากยังมีคำขอที่รออนุมัติหรือยังไม่คืนของ
        </ConfirmModal>
      )}
    </div>
  );
}
