import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import { tokenStore, tokenExpiry, setUnauthorizedHandler } from '../api/client';

const AuthContext = createContext(null);
const USER_KEY = 'equipment_user';
export const SESSION_EXPIRED_KEY = 'session_expired';

function clearSession() {
  tokenStore.clear();
  localStorage.removeItem(USER_KEY);
}

// อ่านเซสชันที่เก็บไว้: ต้องมีทั้งตั๋วและข้อมูลสมาชิก และตั๋วยังไม่หมดอายุ
// (ข้อมูลจำลองรุ่นเก่า เช่น {role:'guest'} ที่ไม่มี id/ตั๋ว จะถูกทิ้ง)
function readSession() {
  try {
    const token = tokenStore.get();
    const raw = localStorage.getItem(USER_KEY);
    if (!token || !raw) return null;
    const user = JSON.parse(raw);
    const exp = tokenExpiry(token);
    if (!user || !user.id || !user.role || !exp || exp * 1000 <= Date.now()) {
      clearSession();
      return null;
    }
    return user;
  } catch {
    clearSession();
    return null;
  }
}

// user = null  -> ยังไม่ได้เข้าสู่ระบบ
// user.role    -> 'guest' (บัญชีผู้เยี่ยมชมที่สมัครไว้ ดูอุปกรณ์ได้อย่างเดียว) | 'member' | 'admin'
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const expire = useCallback(() => {
    sessionStorage.setItem(SESSION_EXPIRED_KEY, '1');
    logout();
  }, [logout]);

  // BE ตอบ 401 ว่าตั๋วใช้ไม่ได้ -> ออกจากระบบ
  useEffect(() => {
    setUnauthorizedHandler(expire);
    return () => setUnauthorizedHandler(null);
  }, [expire]);

  // ตั๋วอายุ 1 ชม. -> ออกจากระบบอัตโนมัติเมื่อหมดอายุ
  useEffect(() => {
    if (!user) return undefined;
    const exp = tokenExpiry(tokenStore.get() || '');
    const ms = exp ? exp * 1000 - Date.now() : 0;
    if (ms <= 0) {
      expire();
      return undefined;
    }
    const t = setTimeout(expire, Math.min(ms, 2 ** 31 - 1));
    return () => clearTimeout(t);
  }, [user, expire]);

  const login = async (email, password) => {
    const { token, member } = await api.login(email, password);
    tokenStore.set(token);
    localStorage.setItem(USER_KEY, JSON.stringify(member));
    sessionStorage.removeItem(SESSION_EXPIRED_KEY);
    setUser(member);
    return member;
  };

  const register = (payload) => api.register(payload);

  const role = user ? user.role : null;
  const value = {
    user,
    isLoggedIn: !!user,
    isAdmin: role === 'admin',
    canBorrow: role === 'member' || role === 'admin', // ตรงกับ middleware ฝั่ง BE
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
