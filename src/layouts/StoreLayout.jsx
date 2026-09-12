import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Building, Menu, X, Moon, Sun, Globe, Store, UserCircle, 
  PackageSearch, Tags, LogOut 
} from 'lucide-react';

export default function StoreLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]); 
  
  const userStr = localStorage.getItem('productDeskUser');
  const user = userStr ? JSON.parse(userStr) : null;

  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState((user?.lang === 'en' || user?.lang === 'ar') ? user.lang : 'ar');
  
  const location = useLocation();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [theme, lang, isRtl]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleLogout = () => {
    localStorage.removeItem('productDeskUser');
    navigate('/login');
    setIsSidebarOpen(false);
  };

  const translations = {
    ar: { 
      shop: 'السوق', myStore: 'إدارة المتجر', login: 'تسجيل الدخول', rights: 'جميع الحقوق محفوظة.',
      menu: {
        stores: 'المتاجر',
        products: 'المنتجات',
        categories: 'التصنيفات',
        cart: 'سلة التسوق',
        settings: 'الإعدادات',
        logout: 'تسجيل الخروج',
        welcome: user ? `مرحباً، ${user.name.split(' ')[0]}` : 'مرحباً بك في السوق'
      }
    },
    en: { 
      shop: 'Marketplace', myStore: 'Store Management', login: 'Sign In', rights: 'All rights reserved.',
      menu: {
        stores: 'Stores',
        products: 'Products',
        categories: 'Categories',
        cart: 'Shopping Cart',
        settings: 'Settings',
        logout: 'Log Out',
        welcome: user ? `Hello, ${user.name.split(' ')[0]}` : 'Welcome to Marketplace'
      }
    }
  };

  const t = translations[lang] || translations.ar;

  const sidebarLinks = [
    { name: t.menu.stores, icon: Store, path: '/stores' },
    { name: t.menu.products, icon: PackageSearch, path: '/shop' },
    { name: t.menu.categories, icon: Tags, path: '/categories' },
    { name: t.menu.cart, icon: ShoppingCart, path: '/cart', badge: cartItems.length },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 text-slate-800 dark:text-slate-100 overflow-x-hidden">
      
      {/* الشريط العلوي (Header) */}
      <header className="relative bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 h-16 sm:h-20 flex items-center justify-between px-4 lg:px-8 z-40 transition-colors">
        
        {/* زر القائمة الجانبية والشعار */}
        <div className="flex items-center gap-3 z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          
          <Link to="/shop" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Building className="w-8 h-8" />
            <span className="font-extrabold text-2xl tracking-tight hidden md:block">Product Desk</span>
          </Link>
        </div>

        {/* أزرار التبديل الأنيقة (السوق / الإدارة) - تظهر الآن دائماً */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors z-10">
          <Link to="/admin" className="px-4 py-1.5 rounded-md text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all flex items-center gap-2">
            <Store className="w-4 h-4" /> {t.myStore}
          </Link>
          <div className="px-4 py-1.5 rounded-md text-sm font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm flex items-center gap-2 select-none cursor-default">
            <ShoppingCart className="w-4 h-4" /> {t.shop}
          </div>
        </div>

        {/* أدوات التحكم السريعة (يسار) */}
        <div className="flex items-center gap-2 sm:gap-4 z-10">
          
          {/* أزرار الوضع واللغة (مخفية في الشاشات الصغيرة جداً لتوفير المساحة) */}
          <div className="hidden sm:flex items-center gap-1 border-x border-slate-200 dark:border-slate-700 px-3 mx-1">
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors" title={theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}>
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors font-bold uppercase text-xs flex items-center gap-1" title="تغيير اللغة">
              <Globe className="w-4 h-4" /> {lang}
            </button>
          </div>

          <Link to="/cart" className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800 shadow-sm">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* أيقونة الحساب الاحترافية */}
          {user ? (
            <Link to="/admin" className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 pl-1.5 pr-4 py-1.5 rounded-full transition-colors">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&bold=true`} alt={user.name} className="w-7 h-7 rounded-full shadow-sm" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 hidden sm:block truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <Link to="/login" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md">
              <UserCircle className="w-5 h-5" />
              <span className="hidden sm:block">{t.login}</span>
            </Link>
          )}

        </div>
      </header>

      {/* القائمة الجانبية (لم تتغير) */}
      <div className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsSidebarOpen(false)}>
        <aside 
          className={`absolute top-0 bottom-0 ${isRtl ? 'right-0' : 'left-0'} w-72 bg-white dark:bg-slate-800 shadow-2xl transition-transform duration-300 flex flex-col`}
          style={{ transform: isSidebarOpen ? 'translateX(0)' : (isRtl ? 'translateX(100%)' : 'translateX(-100%)') }}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user ? (
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fff&color=4f46e5&bold=true`} className="w-10 h-10 rounded-full border-2 border-indigo-400" />
              ) : (
                <UserCircle className="w-10 h-10 opacity-80" />
              )}
              <span className="font-bold">{t.menu.welcome}</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-indigo-200 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {sidebarLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center justify-between px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-slate-400" />
                        {link.name}
                      </div>
                      {link.badge > 0 && (
                        <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{link.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <hr className="my-4 border-slate-200 dark:border-slate-700 mx-6" />

            <div className="px-6 pb-2 text-sm font-bold text-slate-400 uppercase tracking-wider">{t.menu.settings}</div>
            <ul className="space-y-1 px-3">
              <li className="sm:hidden">
                <button onClick={toggleTheme} className="w-full flex items-center justify-between px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors font-medium">
                  <div className="flex items-center gap-3">
                    {theme === 'light' ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-slate-400" />}
                    {theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}
                  </div>
                </button>
              </li>
              <li className="sm:hidden">
                <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="w-full flex items-center justify-between px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors font-medium">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-slate-400" />
                    تغيير اللغة ({lang === 'ar' ? 'English' : 'العربية'})
                  </div>
                </button>
              </li>
              
              {user && (
                <li>
                  <button onClick={handleLogout} className="w-full flex items-center justify-between px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium mt-2">
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5" />
                      {t.menu.logout}
                    </div>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>

      <main className="flex-1 flex flex-col">
        <Outlet context={{ cartItems, setCartItems, lang, isRtl }} />
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 text-center transition-colors mt-auto">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          © {new Date().getFullYear()} Product Desk. {t.rights}
        </p>
      </footer>

    </div>
  );
}