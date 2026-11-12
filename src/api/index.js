import { request } from './client';

export { ApiError, API_URL } from './client';

// ---------- Auth ----------
// register: BE รับ {email, password(>=8), displayName, role?: 'guest'|'member'}
export const register = (payload) => request('/api/auth/register', { method: 'POST', body: payload, auth: false });
// login: -> { token, member: {id, email, displayName, role} }
export const login = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: { email, password }, auth: false });

// ---------- สาธารณะ ----------
export const listCategories = async () => (await request('/api/categories', { auth: false })).items;
export const listEquipment = async ({ q, category } = {}) =>
  (await request('/api/equipment', { query: { q, category }, auth: false })).items;
export const getEquipment = (id) => request(`/api/equipment/${id}`, { auth: false });

// ---------- Member / Admin (ต้องมี role member หรือ admin) ----------
export const getMe = () => request('/api/me');
export const changePassword = (currentPassword, newPassword) =>
  request('/api/me/password', { method: 'PUT', body: { currentPassword, newPassword } });
export const myBorrows = async () => (await request('/api/me/borrow-requests')).items;
// borrowDate / returnDate รูปแบบ YYYY-MM-DD
export const createBorrow = ({ equipmentId, quantity, borrowDate, returnDate }) =>
  request('/api/borrow-requests', { method: 'POST', body: { equipmentId, quantity, borrowDate, returnDate } });

// ---------- Admin ----------
export const adminStats = () => request('/api/admin/stats');
export const adminListBorrows = async (status) =>
  (await request('/api/admin/borrow-requests', { query: { status } })).items;
export const adminApprove = (id) => request(`/api/admin/borrow-requests/${id}/approve`, { method: 'PUT' });
export const adminReject = (id) => request(`/api/admin/borrow-requests/${id}/reject`, { method: 'PUT' });
export const adminReturn = (id) => request(`/api/admin/borrow-requests/${id}/return`, { method: 'PUT' });

// payload: { name, description, category, imageUrl, totalQty }
export const adminCreateEquipment = (payload) => request('/api/admin/equipment', { method: 'POST', body: payload });
export const adminUpdateEquipment = (id, payload) =>
  request(`/api/admin/equipment/${id}`, { method: 'PUT', body: payload });
export const adminDeleteEquipment = (id) => request(`/api/admin/equipment/${id}`, { method: 'DELETE' });
// อัปโหลดรูป -> คืน { url } เอา url ไปใส่ imageUrl
export const adminUploadImage = (file) => {
  const fd = new FormData();
  fd.append('image', file);
  return request('/api/admin/upload-image', { method: 'POST', formData: fd });
};
