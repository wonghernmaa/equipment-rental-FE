import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('equipment_user');
    return savedUser ? JSON.parse(savedUser) : { role: 'guest', name: 'ผู้เยี่ยมชม' };
  });

  useEffect(() => {
    localStorage.setItem('equipment_user', JSON.stringify(user));
  }, [user]);

  // ฟังก์ชันจำลองการเข้าสู่ระบบเพื่อเทสสิทธิ์
  const login = (roleType) => {
    if (roleType === 'admin') {
      setUser({ role: 'admin', name: 'ท่านผู้ดูแลระบบ (Admin)' });
    } else if (roleType === 'member') {
      setUser({ role: 'member', name: 'กฤษฎา คงแก้ว (650710668)' });
    }
  };

  const logout = () => {
    setUser({ role: 'guest', name: 'ผู้เยี่ยมชม' });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);