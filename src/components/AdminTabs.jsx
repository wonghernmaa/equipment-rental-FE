import React from 'react';
import { NavLink } from 'react-router-dom';

// แท็บสลับระหว่างหน้าแอดมิน: คำขอยืม <-> จัดการอุปกรณ์
const tab = (active) => ({
  padding: '9px 18px', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: '800',
  color: active ? '#0F172A' : '#CBD5E1', background: active ? '#38BDF8' : 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
});

export default function AdminTabs() {
  return (
    <nav aria-label="เมนูแอดมิน" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>
      <NavLink to="/admin" end style={({ isActive }) => tab(isActive)}>📋 คำขอยืม</NavLink>
      <NavLink to="/admin/equipments" style={({ isActive }) => tab(isActive)}>🔧 จัดการอุปกรณ์</NavLink>
    </nav>
  );
}
