import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Employees from './pages/Employees';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Settings from './pages/Settings';

// مكون الحارس الأمني (Protected Route)
const ProtectedRoute = ({ children, permissionKey }) => {
  // 1. التحقق من وجود جلسة مسجلة في المتصفح
  const userStr = localStorage.getItem('productDeskUser');
  
  if (!userStr) {
    // إذا لم يكن مسجلاً، اطرده فوراً لصفحة تسجيل الدخول
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  // 2. المدير يملك الصلاحية المطلقة للدخول لأي مكان
  if (user.role === 'admin') {
    return children;
  }

  // 3. التحقق من صلاحيات الموظف الدقيقة
  // إذا طلبنا صلاحية معينة (مثل products) والموظف لا يملكها، أعده للرئيسية
  if (permissionKey && (!user.permissions || !user.permissions[permissionKey])) {
    return <Navigate to="/" replace />;
  }

  // إذا اجتاز كل الفحوصات، اسمح له بالدخول
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* المسارات العامة المفتوحة للجميع */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* المسارات المحمية تحت تخطيط MainLayout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* الصفحة الرئيسية (متاحة لكل من سجل دخوله) */}
          <Route index element={<Dashboard />} />
          
          {/* الصفحات التي تتطلب صلاحيات محددة للموظفين */}
          <Route 
            path="products" 
            element={
              <ProtectedRoute permissionKey="products">
                <Products />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="sales" 
            element={
              <ProtectedRoute permissionKey="sales">
                <Sales />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="employees" 
            element={
              <ProtectedRoute permissionKey="employees">
                <Employees />
              </ProtectedRoute>
            } 
          />
          
          {/* صفحات بدون صلاحيات مخصصة (تعتمد على إخفاء الأزرار في القائمة) */}
          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}