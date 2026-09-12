import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, 
  Users, Settings, Menu, X, Bell, AlertTriangle, CheckCircle, Info, CheckCircle2, LogOut, Building, ClipboardList, MonitorSmartphone, Store,
  Truck, Layout
} from 'lucide-react';

const translations = {
  ar: {
    dashboard: 'الصفحة الرئيسية',
    products: 'المنتجات',
    sales: 'المبيعات',
    orders: 'الطلبات',
    landingPages: 'صفحات الهبوط',
    shipping: 'شركات التوصيل',
    employees: 'إدارة الموظفين',
    storeBuilder: 'تخصيص المتجر',
    settings: 'الإعدادات',
    notifications: 'الإشعارات',
    markAllRead: 'تحديد الكل كمقروء',
    noNotifications: 'لا توجد إشعارات جديدة',
    logout: 'تسجيل الخروج',
    confirmLogout: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
    shop: 'السوق',
    myStore: 'إدارة المتجر',
    profile: {
      accountInfo: 'معلومات الحساب',
      accountType: 'نوع الحساب:',
      email: 'البريد الإلكتروني:',
      phone: 'رقم الهاتف:',
      admin: 'المدير العام',
      employee: 'موظف'
    }
  },
  en: {
    dashboard: 'Home',
    products: 'Products',
    sales: 'Sales',
    orders: 'Orders',
    landingPages: 'Landing Pages',
    shipping: 'Shipping Companies',
    employees: 'Employees',
    storeBuilder: 'Store Builder',
    settings: 'Settings',
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'No new notifications',
    logout: 'Log Out',
    confirmLogout: 'Are you sure you want to log out?',
    shop: 'Marketplace',
    myStore: 'Store Management',
    profile: {
      accountInfo: 'Account Info',
      accountType: 'Account Type:',
      email: 'Email Address:',
      phone: 'Phone Number:',
      admin: 'Administrator',
      employee: 'Employee'
    }
  }
};

const initialNotifications = [
  { id: 1, type: 'success', text: 'تم تحديث النظام: جميع الصفحات الآن متزامنة بالكامل!', time: 'الآن', read: false },
];

const globalInitialProducts = [
  { id: 1, name: 'سماعات رأس لاسلكية سوني', code: 'PRD-X9A2B', category: 'إلكترونيات', price: 350, netProfit: 100, stock: 45, sales: 120, lastSaleDate: Date.now() - 7200000, description: 'سماعات عازلة للضوضاء.', mainImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400&q=80', extraImages: [], createdAt: Date.now() },
];

export default function MainLayout() {
  const storedUser = JSON.parse(localStorage.getItem('productDeskUser'));

  const [currentUser, setCurrentUser] = useState(storedUser || {
    name: 'مدير النظام',
    email: 'admin@productdesk.com',
    phone: '+213 555 000 000',
    role: 'admin',
    jobCode: 'EMP-0001',
    permissions: { products: true, sales: true, employees: true }
  });

  const [globalSettings, setGlobalSettings] = useState({
    lang: currentUser.lang || 'ar',
    theme: 'light',
    currency: 'DA',
    companyName: 'Product Desk',
    companyLogo: null 
  });

  const [products, setProducts] = useState(globalInitialProducts);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  const isRtl = globalSettings.lang === 'ar';
  const t = translations[globalSettings.lang] || translations.ar;

  useEffect(() => {
    if (globalSettings.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [globalSettings.theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setIsNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addNotification = (type, text) => setNotifications(prev => [{ id: Date.now(), type, text, time: 'الآن', read: false }, ...prev]);
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  
  const handleLogout = () => { 
    if (window.confirm(t.confirmLogout)) {
      localStorage.removeItem('productDeskUser');
      navigate('/login');
    }
  };

  const getNotificationIcon = (type) => {
    if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    if (type === 'success') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  const menuItems = [
    { name: t.dashboard, icon: LayoutDashboard, path: '/admin', visible: true },
    { name: t.products, icon: Package, path: '/admin/products', visible: currentUser.role === 'admin' || currentUser.permissions.products },
    { name: t.sales, icon: ShoppingCart, path: '/admin/sales', visible: currentUser.role === 'admin' || currentUser.permissions.sales },
    { name: t.orders, icon: ClipboardList, path: '/admin/orders', visible: currentUser.role === 'admin' || currentUser.permissions.sales },
    { name: t.storeBuilder, icon: MonitorSmartphone, path: '/admin/builder', visible: currentUser.role === 'admin' }, 
    { name: t.landingPages, icon: Layout, path: '/admin/landings', visible: currentUser.role === 'admin' },
    { name: t.shipping, icon: Truck, path: '/admin/shipping', visible: currentUser.role === 'admin' },
    { name: t.employees, icon: Users, path: '/admin/employees', visible: currentUser.role === 'admin' || currentUser.permissions.employees },
    { name: t.settings, icon: Settings, path: '/admin/settings', visible: true },
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      
      {/* القائمة الجانبية: تدفع المحتوى بسلاسة دون طبقة ضبابية */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ease-in-out flex-shrink-0 z-20 overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <div className="w-64 flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-700 h-16 flex-shrink-0">
            <div className="flex items-center gap-2 text-indigo-400">
              {globalSettings.companyLogo ? (
                <img src={globalSettings.companyLogo} alt="Logo" className="w-8 h-8 rounded-md object-cover bg-white" />
              ) : (
                <Building className="w-6 h-6" />
              )}
              <span className="text-xl font-bold truncate">{globalSettings.companyName}</span>
            </div>
            {/* زر إغلاق القائمة من الداخل */}
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="p-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
            {menuItems.filter(item => item.visible).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}>
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
            })}
          </nav>

          <div className="p-4 border-t border-slate-700 flex-shrink-0">
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors whitespace-nowrap">
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">{t.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 h-full">
        <header className="relative bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 lg:px-6 z-10 transition-colors duration-300 flex-shrink-0">
          
          <div className="flex items-center gap-4 z-10">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="px-4 py-1.5 rounded-md text-sm font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm flex items-center gap-2 select-none">
              <Store className="w-4 h-4" /> {t.myStore}
            </div>
            <Link to="/shop" className="px-4 py-1.5 rounded-md text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> {t.shop}
            </Link>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 z-10">
            <div className="relative" ref={notificationsRef}>
              <button onClick={() => {setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false);}} className="relative p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <Bell className="w-5 h-5" />
                {notifications.filter(n=>!n.read).length > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>}
              </button>
              {isNotificationsOpen && (
                <div className={`absolute top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50 ${isRtl ? 'left-0' : 'right-0'}`}>
                  <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">{t.notifications}</h3>
                    <button onClick={markAllAsRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{t.markAllRead}</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((note) => (
                        <div key={note.id} className={`p-4 border-b border-slate-50 dark:border-slate-700/50 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!note.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                          <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(note.type)}</div>
                          <div>
                            <p className={`text-sm ${!note.read ? 'font-semibold text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{note.text}</p>
                            <p className="text-xs text-slate-400 mt-1">{note.time}</p>
                          </div>
                        </div>
                      ))
                    ) : <div className="p-6 text-center text-sm text-slate-500">{t.noNotifications}</div>}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button onClick={() => {setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false);}} className="w-10 h-10 rounded-full border-2 border-transparent hover:border-indigo-500 focus:outline-none focus:border-indigo-500 overflow-hidden transition-all duration-200 shadow-sm">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=6366f1&color=fff&bold=true`} alt={currentUser.name} className="w-full h-full object-cover" />
              </button>
              {isProfileOpen && (
                <div className={`absolute top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50 ${isRtl ? 'left-0' : 'right-0'}`}>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600 flex-shrink-0">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=6366f1&color=fff&bold=true`} alt={currentUser.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white truncate">{currentUser.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{t.profile.accountInfo}</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.profile.accountType}</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{currentUser.role === 'admin' ? t.profile.admin : t.profile.employee}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.profile.email}</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 break-all">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={handleLogout} className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                      <LogOut className="w-4 h-4" />{t.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-6 bg-slate-50/50 dark:bg-slate-900/50 w-full h-full">
          <Outlet context={{ 
            addNotification, 
            products, setProducts, 
            globalSettings, setGlobalSettings,
            currentUser, setCurrentUser
          }} /> 
        </div>
      </main>
      
      {/* تمت إزالة الطبقة الضبابية (Overlay) نهائياً */}
    </div>
  );
}