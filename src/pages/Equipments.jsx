import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import useEquipments from '../hooks/useEquipments';
import useCategories from '../hooks/useCategories';
import { CATEGORY_ICON } from '../constants';
import EquipmentCard from '../components/EquipmentCard';
import AuthModal from '../components/AuthModal';
import BorrowModal from '../components/BorrowModal';
import { EmptyState, ErrorState } from '../components/UIStates';

const STATUS_OPTIONS = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'available', label: '🟢 พร้อมยืม' },
  { value: 'out', label: '🔴 ของหมด' },
];

const SORTS = {
  name: { label: 'ชื่อ ก-ฮ', fn: (a, b) => a.name.localeCompare(b.name, 'th') },
  available: { label: 'คงเหลือมากสุด', fn: (a, b) => b.availableQty - a.availableQty || a.name.localeCompare(b.name, 'th') },
  newest: { label: 'เพิ่มล่าสุด', fn: (a, b) => b.id - a.id },
};

export default function Equipments() {
  const { canBorrow } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearch = new URLSearchParams(location.search).get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState('ทั้งหมด');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('name');

  const { items, loading, error, reload } = useEquipments();
  const categories = useCategories();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const searchRef = useRef(null);
  const [intro, setIntro] = useState(true); // แอนิเมชันเข้าฉากเล่นครั้งเดียวตอนโหลดข้อมูลเสร็จ

  useEffect(() => {
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    if (loading || error) return undefined;
    const t = setTimeout(() => setIntro(false), 1200);
    return () => clearTimeout(t);
  }, [loading, error]);

  // กด "/" เพื่อกระโดดไปช่องค้นหา (เมื่อไม่ได้พิมพ์อยู่ในช่องอื่น)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        e.preventDefault();
        if (searchRef.current) searchRef.current.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // ค้นหา + สถานะ ก่อน แล้วค่อยนับต่อหมวด (ตัวเลขบนชิปจึงตรงกับสิ่งที่จะเห็นเมื่อกด)
  const baseFiltered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((it) => {
      const okSearch = !q || it.name.toLowerCase().includes(q) || (it.description || '').toLowerCase().includes(q);
      const okStatus = status === 'all' || (status === 'available' ? it.availableQty > 0 : it.availableQty === 0);
      return okSearch && okStatus;
    });
  }, [items, searchQuery, status]);

  const countByCategory = useMemo(() => {
    const m = {};
    baseFiltered.forEach((it) => { m[it.category] = (m[it.category] || 0) + 1; });
    return m;
  }, [baseFiltered]);

  const visible = useMemo(() => {
    const list = category === 'ทั้งหมด' ? baseFiltered : baseFiltered.filter((it) => it.category === category);
    return [...list].sort(SORTS[sort].fn);
  }, [baseFiltered, category, sort]);

  const availableNow = items.filter((it) => it.availableQty > 0).length;
  const hasFilter = searchQuery.trim() !== '' || category !== 'ทั้งหมด' || status !== 'all';
  const clearFilters = () => { setSearchQuery(''); setCategory('ทั้งหมด'); setStatus('all'); };

  const handleBorrowClick = (equipment) => {
    if (!canBorrow) {
      setAuthModalOpen(true);
    } else {
      setSelectedEquipment(equipment);
      setBorrowModalOpen(true);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '32px auto 64px', padding: '0 20px' }}>
      {/* Hero + ช่องค้นหาใหญ่ */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #0369A1 100%)',
        borderRadius: '28px', padding: '40px 44px 36px', color: '#fff', marginBottom: '28px',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)', position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-60px', top: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,.35), transparent 70%)' }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '34px', margin: '0 0 8px', fontWeight: 800, letterSpacing: '-0.5px' }}>อุปกรณ์ทั้งหมด</h2>
            <p style={{ color: '#A5B4C8', fontSize: '15px', margin: 0 }}>เลือกอุปกรณ์ที่ต้องการ แล้วส่งคำขอยืมได้ในไม่กี่คลิก</p>
          </div>
          {!loading && !error && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', padding: '10px 18px', borderRadius: '14px' }}>
                <strong style={{ fontSize: '22px', color: '#38BDF8', display: 'block', lineHeight: 1.1 }}>{items.length}</strong>
                <span style={{ fontSize: '12px', color: '#A5B4C8' }}>รายการในคลัง</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', padding: '10px 18px', borderRadius: '14px' }}>
                <strong style={{ fontSize: '22px', color: '#4ADE80', display: 'block', lineHeight: 1.1 }}>{availableNow}</strong>
                <span style={{ fontSize: '12px', color: '#A5B4C8' }}>พร้อมยืมตอนนี้</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <span aria-hidden="true" style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>🔍</span>
          <input
            ref={searchRef}
            className="eq-search"
            type="text"
            aria-label="ค้นหาอุปกรณ์"
            placeholder="ค้นหาชื่อหรือรายละเอียด เช่น กล้อง, โน้ตบุ๊ก..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <button onClick={() => { setSearchQuery(''); searchRef.current && searchRef.current.focus(); }} aria-label="ล้างคำค้นหา"
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: '#E2E8F0', color: '#475569', borderRadius: '10px', padding: '6px 12px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
              ล้าง ✕
            </button>
          ) : (
            <kbd aria-hidden="true" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', border: '1px solid #CBD5E1', background: '#F1F5F9', color: '#64748B', borderRadius: '8px', padding: '3px 10px', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit' }}>/</kbd>
          )}
        </div>
      </section>

      {/* แถบตัวกรอง */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 20px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div className="eq-chips" role="group" aria-label="กรองตามหมวดหมู่" style={{ flex: '1 1 420px', minWidth: 0 }}>
          <button className="eq-chip" aria-pressed={category === 'ทั้งหมด'} onClick={() => setCategory('ทั้งหมด')}>
            ✨ ทั้งหมด <span className="n">{baseFiltered.length}</span>
          </button>
          {categories.map((c) => (
            <button key={c} className="eq-chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
              {CATEGORY_ICON[c] || '📦'} {c} <span className="n">{countByCategory[c] || 0}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="eq-seg" role="group" aria-label="กรองตามสถานะ">
            {STATUS_OPTIONS.map((o) => (
              <button key={o.value} aria-pressed={status === o.value} onClick={() => setStatus(o.value)}>{o.label}</button>
            ))}
          </div>
          <select aria-label="เรียงลำดับ" value={sort} onChange={(e) => setSort(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#fff', fontWeight: 700, fontSize: '13px', color: '#334155', cursor: 'pointer', fontFamily: 'inherit' }}>
            {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>เรียง: {s.label}</option>)}
          </select>
        </div>
      </div>

      {/* สรุปผล */}
      {!loading && !error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', minHeight: '28px' }} aria-live="polite">
          <p style={{ margin: 0, color: '#64748B', fontSize: '14px', fontWeight: 600 }}>
            แสดง <strong style={{ color: '#0F172A' }}>{visible.length}</strong> จาก {items.length} รายการ
          </p>
          {hasFilter && (
            <button onClick={clearFilters} style={{ border: 'none', background: '#E0F2FE', color: '#0369A1', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      )}

      {/* รายการ */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }} aria-busy="true" aria-label="กำลังโหลดแค็ตตาล็อกอุปกรณ์">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="eq-skel" />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : visible.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {visible.map((equipment, i) => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              onBorrow={handleBorrowClick}
              onOpen={(eq) => navigate(`/equipment/${eq.id}`)}
              enterDelay={intro ? Math.min(i, 11) * 45 : undefined}
            />
          ))}
        </div>
      ) : (
        <div>
          <EmptyState
            title="ไม่พบอุปกรณ์ที่ตรงกับที่ค้นหา"
            description="ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่และสถานะอื่นดูอีกครั้ง"
          />
          {hasFilter && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button onClick={clearFilters} style={{ border: 'none', background: '#0F172A', color: '#fff', padding: '10px 22px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <BorrowModal isOpen={borrowModalOpen} onClose={() => setBorrowModalOpen(false)} equipment={selectedEquipment} onSuccess={() => reload({ silent: true })} />
    </div>
  );
}
