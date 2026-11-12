import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RequireRole from './components/RequireRole';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Equipments from './pages/Equipments';
import EquipmentDetail from './pages/EquipmentDetail'; 
import Login from './pages/Login';
import Register from './pages/Register';
import MyBorrowings from './pages/MyBorrowings';
import AdminDashboard from './pages/AdminDashboard';
import AdminEquipments from './pages/AdminEquipments';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/equipments" element={<Equipments />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/register" element={<Register />} />

            <Route path="/my-borrowings" element={
              <ProtectedRoute roles={['member', 'admin']}>
                <MyBorrowings />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <RequireRole allowedRole="admin">
                <AdminDashboard />
              </RequireRole>
            } />

            <Route path="/admin/equipments" element={
              <RequireRole allowedRole="admin">
                <AdminEquipments />
              </RequireRole>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}