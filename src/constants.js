// หมวดหมู่สำรอง ใช้ระหว่างรอโหลดจาก GET /api/categories (ตรงกับ CHECK ใน schema.sql ของ BE)
export const CATEGORIES = ['กีฬา', 'ไอที', 'อุปกรณ์ถ่ายภาพ', 'อื่นๆ'];

// FE จำกัดการยืมต่อครั้ง (BE รับได้ถึง 100 แต่ทีมกำหนดไว้ที่ 3)
export const MAX_BORROW_QTY = 3;

// ข้อจำกัดของฟอร์มอุปกรณ์ ตรงกับ validation ใน BE (handler/admin.go, handler/upload.go)
export const EQUIPMENT_LIMITS = {
  nameMax: 100,
  descriptionMax: 2000,
  imageUrlMax: 500,
  qtyMax: 100000,
  imageBytesMax: 5 * 1024 * 1024,
  imageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};

export const ROLE_LABEL = {
  admin: 'ผู้ดูแลระบบ (Admin)',
  member: 'สมาชิก (Member)',
  guest: 'ผู้เยี่ยมชม (Guest)',
};

export const CATEGORY_ICON = { 'กีฬา': '⚽', 'ไอที': '💻', 'อุปกรณ์ถ่ายภาพ': '📷', 'อื่นๆ': '🧰' };
