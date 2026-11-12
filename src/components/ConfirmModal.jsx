import React from 'react';
import Modal from './Modal';
import Notice from './Notice';
import { btnGhost, btnDanger, btnPrimary } from './formStyles';

export default function ConfirmModal({ title, children, confirmLabel = 'ยืนยัน', danger = false, busy = false, error, onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel} busy={busy} maxWidth={440}>
      <h3 style={{ margin: '0 0 10px 0', color: '#0F172A', fontSize: '20px', fontWeight: '900' }}>{title}</h3>
      <div style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>{children}</div>
      <Notice>{error}</Notice>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button type="button" onClick={onCancel} disabled={busy} style={btnGhost}>ยกเลิก</button>
        <button type="button" onClick={onConfirm} disabled={busy}
          style={{ ...(danger ? btnDanger : btnPrimary), opacity: busy ? 0.6 : 1 }}>
          {busy ? 'กำลังดำเนินการ...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
