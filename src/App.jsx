import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RequireRole from './components/RequireRole';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const MyBorrowings = () => <div style={{ padding: '40px' }}><h1>📜 ประวัติการยืมของฉัน</h1></div>;
const AdminDashboard = () => <div style={{ padding: '40px' }}><h1>🛡️ หน้าจัดการหลังบ้าน (Admin)</h1></div>;

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/my-borrowings" element={
            <ProtectedRoute>
              <MyBorrowings />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <RequireRole allowedRole="admin">
              <AdminDashboard />
            </RequireRole>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}