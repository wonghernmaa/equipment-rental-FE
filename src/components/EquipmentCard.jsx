import React from 'react';
import SafeImage from './SafeImage';

// การ์ดอุปกรณ์ (ใช้ทั้งหน้าแรกและหน้าอุปกรณ์ทั้งหมด)
// onOpen: ถ้าส่งมา การ์ดทั้งใบกด/กด Enter เพื่อเปิดรายละเอียดได้
// enterDelay: (ms) ถ้าส่งมา การ์ดจะเล่นแอนิเมชันเข้าฉากพร้อมหน่วงเวลานี้
export default function EquipmentCard({ equipment, onBorrow, onOpen, enterDelay }) {
  const { availableQty: avail, totalQty: total } = equipment;
  const isAvailable = avail > 0;
  const isLow = isAvailable && total > 1 && avail / total <= 0.25;
  const pct = total > 0 ? Math.round((avail / total) * 100) : 0;
  const tone = !isAvailable ? 'out' : isLow ? 'low' : 'ok';
  const barColor = { ok: '#22C55E', low: '#F59E0B', out: '#EF4444' }[tone];
  const badgeText = { ok: 'พร้อมยืม', low: `เหลือน้อย`, out: 'ของหมด' }[tone];

  const interactive = typeof onOpen === 'function';
  const handleKey = (e) => {
    if (interactive && e.key === 'Enter' && e.target === e.currentTarget) onOpen(equipment);
  };

  return (
    <article
      className={`eq-card${isAvailable ? '' : ' is-out'}${enterDelay !== undefined ? ' eq-enter' : ''}`}
      style={enterDelay !== undefined ? { animationDelay: `${enterDelay}ms` } : undefined}
      role={interactive ? 'link' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `ดูรายละเอียด ${equipment.name}` : undefined}
      onClick={interactive ? () => onOpen(equipment) : undefined}
      onKeyDown={handleKey}
    >
      <div className="eq-media">
        <SafeImage src={equipment.imageUrl} alt={equipment.name} iconSize={44} />
        <span className="eq-badge left">{equipment.category}</span>
        <span className={`eq-badge right ${tone}`}>{badgeText}</span>
      </div>

      <div style={{ padding: '16px 18px 0', flex: 1 }}>
        <h3 style={{ fontSize: '16px', margin: '0 0 6px 0', color: '#0F172A', fontWeight: 800, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {equipment.name}
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {equipment.description || 'ไม่มีรายละเอียด'}
        </p>
      </div>

      <div style={{ padding: '14px 18px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px', fontSize: '12px' }}>
          <span style={{ color: '#64748B', fontWeight: 600 }}>คงเหลือ</span>
          <span style={{ color: '#0F172A' }}>
            <strong style={{ fontSize: '15px', color: barColor }}>{avail}</strong> / {total} ชิ้น
          </span>
        </div>
        <div className="eq-bar" role="img" aria-label={`คงเหลือ ${avail} จาก ${total} ชิ้น`}>
          <span style={{ width: `${pct}%`, background: barColor }} />
        </div>

        <button
          className="eq-btn"
          style={{ marginTop: '14px' }}
          onClick={(e) => { e.stopPropagation(); onBorrow(equipment); }}
          disabled={!isAvailable}
        >
          {isAvailable ? 'ยืมอุปกรณ์' : 'ของหมดชั่วคราว'}
        </button>
      </div>
    </article>
  );
}
