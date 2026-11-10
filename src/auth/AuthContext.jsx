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
  const login = (username, password) => {
  // บัญชีทดสอบ Member
  if (username === 'ponza0191' && password === '1234') {
    const memberUser = { username: 'ponza0191', name: 'กฤษฎา คงแก้ว', role: 'member' };
    setUser(memberUser);
    localStorage.setItem('user', JSON.stringify(memberUser));
    return true;
  }
  
  // บัญชีทดสอบ Admin
  if (username === 'admin' && password === '1234') {
    const adminUser = { username: 'admin', name: 'ผู้ดูแลระบบ', role: 'admin' };
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    return true;
  }

  // กรณีอื่นๆ (ถ้ามีระบบ Backend จริงค่อยเชื่อมตรงนี้)
  return false;
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