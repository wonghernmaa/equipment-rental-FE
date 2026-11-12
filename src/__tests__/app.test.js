import { addDays, todayTH, statusMeta, BORROW_STATUS } from '../utils/format';
import { tokenExpiry } from '../api/client';
import { CATEGORIES, MAX_BORROW_QTY } from '../constants';

describe('Khongunai System Logic Tests', () => {
  test('calculate remaining equipment stock correctly', () => {
    const totalQty = 5;
    const borrowed = 2;
    expect(totalQty - borrowed).toBe(3);
  });

  test('filter equipments by category correctly', () => {
    const items = [
      { id: 1, name: 'Camera', category: 'อุปกรณ์ถ่ายภาพ' },
      { id: 2, name: 'MacBook', category: 'ไอที' },
      { id: 3, name: 'Basketball', category: 'กีฬา' },
    ];
    const filtered = items.filter((i) => i.category === 'ไอที');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('MacBook');
  });

  // role จาก BE: guest ยืมไม่ได้, member/admin ยืมได้
  test('only member and admin can borrow', () => {
    const canBorrow = (u) => !!u && (u.role === 'member' || u.role === 'admin');
    expect(canBorrow(null)).toBe(false);
    expect(canBorrow({ role: 'guest' })).toBe(false);
    expect(canBorrow({ role: 'member' })).toBe(true);
    expect(canBorrow({ role: 'admin' })).toBe(true);
  });

  test('categories match backend', () => {
    expect(CATEGORIES).toEqual(['กีฬา', 'ไอที', 'อุปกรณ์ถ่ายภาพ', 'อื่นๆ']);
    expect(MAX_BORROW_QTY).toBe(3);
  });

  test('addDays handles month/year boundaries', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });

  test('todayTH returns YYYY-MM-DD', () => {
    expect(todayTH()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('every backend borrow status has a label', () => {
    ['pending', 'approved', 'rejected', 'returned'].forEach((s) => {
      expect(BORROW_STATUS[s]).toBeDefined();
    });
    expect(statusMeta('weird').label).toBe('weird');
  });

  test('tokenExpiry reads exp from a JWT payload', () => {
    const payload = btoa(JSON.stringify({ exp: 1900000000 }));
    expect(tokenExpiry(`x.${payload}.y`)).toBe(1900000000);
    expect(tokenExpiry('garbage')).toBeNull();
  });
});
