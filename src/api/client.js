// ตัวกลางยิง HTTP ไปหา BE (Go API) ทุกคำขอผ่านที่นี่ที่เดียว
// - แนบ Authorization: Bearer <token> ให้อัตโนมัติ
// - แปลง error ของ BE ({"error":{"code","message"}}) เป็น ApiError
// - ตั๋วหมดอายุ/ไม่ถูกต้อง (401) -> เรียก handler ให้ออกจากระบบ

export const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080').replace(/\/+$/, '');

const TOKEN_KEY = 'equipment_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// อ่านเวลาหมดอายุ (วินาที) จาก JWT ฝั่ง client เพื่อเช็กเบื้องต้นเท่านั้น (BE เป็นคนตรวจจริง)
export function tokenExpiry(token) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(part));
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status; // 0 = ติดต่อเซิร์ฟเวอร์ไม่ได้
    this.code = code;
  }
}

let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

// code ที่ BE ใช้บอกว่า "ตั๋วใช้ไม่ได้แล้ว" (ต่างจาก BAD_CREDENTIALS/WRONG_PASSWORD ที่เป็นรหัสผิดเฉย ๆ)
const SESSION_DEAD_CODES = ['BAD_TOKEN', 'MEMBER_GONE'];

export async function request(path, { method = 'GET', body, formData, query, auth = true } = {}) {
  const headers = {};
  const token = auth ? tokenStore.get() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (formData) {
    payload = formData; // ให้เบราว์เซอร์ใส่ Content-Type + boundary เอง
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let url = `${API_URL}${path}`;
  if (query) {
    const qs = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, v);
    });
    const s = qs.toString();
    if (s) url += `?${s}`;
  }

  let res;
  try {
    res = await fetch(url, { method, headers, body: payload });
  } catch {
    throw new ApiError(0, 'NETWORK', 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตหรือลองใหม่อีกครั้ง');
  }

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* ตอบกลับไม่ใช่ JSON (เช่น 502 จาก Render ตอนเซิร์ฟเวอร์กำลังตื่น) */
  }

  if (!res.ok) {
    const e = data && data.error;
    let message = e && e.message;
    if (!message) {
      message = [502, 503, 504].includes(res.status)
        ? 'เซิร์ฟเวอร์กำลังเริ่มทำงาน ลองใหม่อีกครั้งในอีกสักครู่'
        : `เกิดข้อผิดพลาด (${res.status})`;
    }
    const err = new ApiError(res.status, (e && e.code) || `HTTP_${res.status}`, message);
    if (res.status === 401 && token && SESSION_DEAD_CODES.includes(err.code) && onUnauthorized) {
      onUnauthorized(err);
    }
    throw err;
  }
  return data;
}
