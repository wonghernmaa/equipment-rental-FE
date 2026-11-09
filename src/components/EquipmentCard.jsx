import React from 'react';

export default function EquipmentCard({ equipment, onBorrow }) {
  const isAvailable = equipment.availableStock > 0;

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '10px',
      overflow: 'hidden',
      border: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'all 0.2s ease',
      ':hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
    }}>
      <div>
        <div style={{ width: '100%', height: '140px', overflow: 'hidden', background: '#F1F5F9' }}>
          <img 
            src={equipment.image} 
            alt={equipment.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ padding: '12px' }}>
          <span style={{
            fontSize: '11px',
            color: '#2563EB',
            background: '#EFF6FF',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            {equipment.category}
          </span>
          <h3 style={{ fontSize: '14px', margin: '8px 0 4px 0', color: '#1E293B', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {equipment.name}
          </h3>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {equipment.description}
          </p>
        </div>
      </div>

      <div style={{ padding: '12px', paddingTop: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '12px' }}>
          <span style={{ color: '#64748B' }}>คงเหลือ:</span>
          <span style={{ fontWeight: 'bold', color: isAvailable ? '#16A34A' : '#DC2626' }}>
            {equipment.availableStock} / {equipment.totalStock} ชิ้น
          </span>
        </div>

        <button
          onClick={() => onBorrow(equipment)}
          disabled={!isAvailable}
          style={{
            width: '100%',
            padding: '8px',
            background: isAvailable ? '#2563EB' : '#94A3B8',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: isAvailable ? 'pointer' : 'not-allowed',
            fontSize: '13px'
          }}
        >
          {isAvailable ? 'ยืมอุปกรณ์' : 'ของหมด'}
        </button>
      </div>
    </div>
  );
}