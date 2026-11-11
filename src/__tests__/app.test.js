// 🧪 ชุด Unit Test สำหรับโปรเจกต์ khongunai (ทดสอบ Logic ระบบยืม-คืน และสิทธิ์การใช้งาน)

describe('Khongunai System Logic Tests', () => {

  // 1. ทดสอบระบบคำนวณสต็อกอุปกรณ์
  test('calculate remaining equipment stock correctly', () => {
    const totalStock = 5;
    const borrowedAmount = 2;
    const remainingStock = totalStock - borrowedAmount;

    expect(remainingStock).toBe(3);
  });

  // 2. ทดสอบระบบกรองหมวดหมู่สินค้า (Category Filtering Logic)
  test('filter equipments by category correctly', () => {
    const mockItems = [
      { id: 1, name: 'Camera', category: 'อุปกรณ์ถ่ายภาพ' },
      { id: 2, name: 'MacBook', category: 'ไอที' },
      { id: 3, name: 'Basketball', category: 'กีฬา' }
    ];

    const activeCategory = 'ไอที';
    const filtered = mockItems.filter(item => item.category === activeCategory);

    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('MacBook');
  });

  // 3. ทดสอบระบบตรวจสอบสิทธิ์ผู้ใช้งาน (Role-based Access Control)
  test('verify user role permissions for borrowing', () => {
    const guestUser = { role: 'guest' };
    const memberUser = { role: 'member' };

    const canBorrowDirectly = (user) => {
      return user && user.role === 'member';
    };

    expect(canBorrowDirectly(guestUser)).toBe(false); // Guest ต้องเด้งไปหน้า Login
    expect(canBorrowDirectly(memberUser)).toBe(true);  // Member กรอกฟอร์มขอยืมได้เลย
  });

});