import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// صفحات تسجيل الدخول والتوجيه المبدئي
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding'; 
import Categories from './pages/Categories';

// === واجهة الزبائن (المتجر العام) ===
import StoreLayout from './layouts/StoreLayout';
import Shop from './pages/Shop';
import Stores from './pages/Stores';
import ProductLanding from './pages/ProductLanding'; 
import Cart from './pages/Cart';

// === واجهة الإدارة (لوحة التحكم) ===
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Employees from './pages/Employees';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import StoreBuilder from './pages/StoreBuilder'; 
import LandingPages from './pages/LandingPages';
import ShippingCompanies from './pages/ShippingCompanies';

// مكون الحارس الأمني (Protected Route) للوحة التحكم
const ProtectedRoute = ({ children, permissionKey }) => {
  const userStr = localStorage.getItem('productDeskUser');
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  if (user.role === 'admin') {
    return children;
  }

  if (permissionKey && (!user.permissions || !user.permissions[permissionKey])) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        
        {/* ========================================= */}
        {/* 1. مسارات الواجهة العامة (المتجر للزبائن) */}
        {/* ========================================= */}
        <Route path="/" element={<StoreLayout />}>
        <Route path="categories" element={<Categories />} />
        <Route path="cart" element={<Cart />} />
          {/* تم حذف صفحة الهبوط وتوجيه الزائر مباشرة إلى السوق */}
          <Route index element={<Navigate to="/shop" replace />} />
          <Route path="shop" element={<Shop />} />
          
          {/* --- تمت إضافة مسار صفحة المتاجر هنا --- */}
          <Route path="stores" element={<Stores />} /> 
          
          <Route path="p/:id" element={<ProductLanding />} /> 
        </Route>

        {/* مسارات تسجيل الدخول والخروج والتوجيه */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* ========================================= */}
        {/* 2. مسارات لوحة التحكم (محمية بكلمة مرور) */}
        {/* ========================================= */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          
          <Route index element={<Dashboard />} />
          
          <Route path="products" element={
            <ProtectedRoute permissionKey="products">
              <Products />
            </ProtectedRoute>
          } />
          
          <Route path="sales" element={
            <ProtectedRoute permissionKey="sales">
              <Sales />
            </ProtectedRoute>
          } />

          <Route path="orders" element={
            <ProtectedRoute permissionKey="sales">
              <Orders />
            </ProtectedRoute>
          } />

          <Route path="builder" element={
            <ProtectedRoute permissionKey="products">
              <StoreBuilder />
            </ProtectedRoute>
          } />
          
          <Route path="landings" element={
            <ProtectedRoute permissionKey="products">
              <LandingPages />
            </ProtectedRoute>
          } />
          
          <Route path="employees" element={
            <ProtectedRoute permissionKey="employees">
              <Employees />
            </ProtectedRoute>
          } />

          <Route path="shipping" element={
            <ProtectedRoute permissionKey="products">
              <ShippingCompanies />
            </ProtectedRoute>
          } />
          
          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<Settings />} />
          
        </Route>
      </Routes>
    </Router>
  );
}