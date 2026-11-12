// วันนี้ตามเวลาไทย รูปแบบ YYYY-MM-DD (BE ตรวจวันที่ยืมด้วยเวลาไทยเหมือนกัน)
export function todayTH() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
}

// บวกวันให้ข้อความวันที่ YYYY-MM-DD (คำนวณแบบ UTC กันเวลาคลาด)
export function addDays(iso, n) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', dateStyle: 'medium', timeStyle: 'short' });
}

// สถานะคำขอยืมจาก BE -> ข้อความ/สีที่แสดงบน UI
export const BORROW_STATUS = {
  pending: { label: 'รออนุมัติ', bg: '#FEF3C7', color: '#D97706' },
  approved: { label: 'อนุมัติแล้ว (กำลังยืม)', bg: '#E0F2FE', color: '#0284C7' },
  rejected: { label: 'ถูกปฏิเสธ', bg: '#FEE2E2', color: '#DC2626' },
  returned: { label: 'คืนแล้ว', bg: '#DCFCE7', color: '#15803D' },
};

export function statusMeta(status) {
  return BORROW_STATUS[status] || { label: status, bg: '#F1F5F9', color: '#475569' };
}
