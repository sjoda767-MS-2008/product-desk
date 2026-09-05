import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Globe, ArrowRight, ArrowLeft, Sun, Moon, Briefcase, Building2, User, Phone, Key, ChevronDown } from 'lucide-react';

const translations = {
  ar: {
    welcome: 'مرحباً بعودتك',
    subtitle: 'قم بتسجيل الدخول للوصول إلى لوحة التحكم',
    accountType: 'نوع الحساب',
    adminRole: 'مدير / صاحب عمل',
    employeeRole: 'موظف',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    inviteCode: 'الرمز الوظيفي',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    rememberMe: 'حفظ معلومات الدخول',
    login: 'تسجيل الدخول',
    noAccount: 'ليس لديك حساب مدير؟',
    register: 'إنشاء حساب جديد',
  },
  en: {
    welcome: 'Welcome Back',
    subtitle: 'Log in to access your dashboard',
    accountType: 'Account Type',
    adminRole: 'Admin / Owner',
    employeeRole: 'Employee',
    fullName: 'Full Name',
    phone: 'Phone Number',
    inviteCode: 'Job Code',
    email: 'Email Address',
    password: 'Password',
    rememberMe: 'Remember Me',
    login: 'Sign In',
    noAccount: "Don't have an admin account?",
    register: 'Create new account',
  },
  fr: {
    welcome: 'Bon retour',
    subtitle: 'Connectez-vous pour accéder au tableau de bord',
    accountType: 'Type de compte',
    adminRole: 'Administrateur / Propriétaire',
    employeeRole: 'Employé',
    fullName: 'Nom complet',
    phone: 'Numéro de téléphone',
    inviteCode: 'Code d\'emploi',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    rememberMe: 'Se souvenir de moi',
    login: 'Se connecter',
    noAccount: "Vous n'avez pas de compte admin ?",
    register: 'Créer un compte',
  }
};

// قائمة الدول باستخدام صور الأعلام لضمان ظهورها في كل الأجهزة
const countries = [
  { code: 'dz', dialCode: '+213', name: 'Algeria' },
  { code: 'sa', dialCode: '+966', name: 'Saudi Arabia' },
  { code: 'ae', dialCode: '+971', name: 'UAE' },
  { code: 'eg', dialCode: '+20', name: 'Egypt' },
  { code: 'ma', dialCode: '+212', name: 'Morocco' },
  { code: 'us', dialCode: '+1', name: 'USA' },
  { code: 'fr', dialCode: '+33', name: 'France' },
  { code: 'gb', dialCode: '+44', name: 'UK' },
];

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [lang, setLang] = useState('ar');
  const [theme, setTheme] = useState('light');
  const [role, setRole] = useState('admin');
  const [rememberMe, setRememberMe] = useState(false);

  // حالات الحقول
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  
  // حالات قائمة الدول المخصصة
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // إغلاق قائمة الدول عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      name: role === 'employee' ? fullName : 'مدير النظام',
      email: email,
      phone: role === 'employee' ? `${selectedCountry.dialCode} ${phoneNumber}` : '+213 555 000 000',
      role: role,
      jobCode: role === 'employee' ? inviteCode : 'EMP-0001',
      lang: lang,
      permissions: role === 'admin' 
        ? { products: true, sales: true, employees: true } 
        : { products: false, sales: true, employees: false } 
    };

    localStorage.setItem('productDeskUser', JSON.stringify(userData));

    if (onLogin) onLogin(role);
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white transition-colors">
          {t.welcome}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400 transition-colors">
          {t.subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-200 dark:border-slate-700 transition-colors">
          
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="relative flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 py-1.5 px-3 outline-none cursor-pointer transition-colors"
              >
                <option value="ar">العربية (AR)</option>
                <option value="en">English (EN)</option>
                <option value="fr">Français (FR)</option>
              </select>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleLoginSubmit}>
            
            {/* اختيار نوع الحساب */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">
                {t.accountType}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex items-center justify-center gap-2 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    role === 'admin' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  {t.adminRole}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('employee')}
                  className={`flex items-center justify-center gap-2 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    role === 'employee' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  {t.employeeRole}
                </button>
              </div>
            </div>

            {role === 'employee' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                    {t.fullName}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${isRtl ? 'pr-10' : 'pl-10'}`}
                    />
                  </div>
                </div>

                {/* حقل رقم الهاتف المخصص مع علم الدولة */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                    {t.phone}
                  </label>
                  <div className="mt-1 flex rounded-lg shadow-sm border border-slate-300 dark:border-slate-600 overflow-visible dark:bg-slate-700 transition-colors">
                    
                    <div className="relative flex items-center" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center justify-between gap-1 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 border-slate-300 dark:border-slate-600 ${isRtl ? 'border-l' : 'border-r'} hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors min-w-[80px]`}
                        dir="ltr"
                      >
                        <img src={`https://flagcdn.com/w20/${selectedCountry.code}.png`} alt={selectedCountry.code} className="w-5 h-auto rounded-[2px]" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1.5">{selectedCountry.dialCode}</span>
                      </button>

                      {/* قائمة الدول المنسدلة */}
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-[100] max-h-48 overflow-y-auto" dir="ltr">
                          {countries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                              <img src={`https://flagcdn.com/w20/${c.code}.png`} alt={c.code} className="w-5 h-auto rounded-[2px]" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-12">{c.dialCode}</span>
                              <span className="text-xs text-slate-500 truncate">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 block w-full px-3 py-2 bg-transparent dark:text-white placeholder-slate-400 focus:outline-none sm:text-sm transition-colors"
                      placeholder="555 123 456"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                    {t.inviteCode}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                      <Key className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono transition-colors ${isRtl ? 'pr-10' : 'pl-10'}`}
                      dir="ltr"
                      placeholder="EMP-XXXX"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                {t.email}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${isRtl ? 'pr-10' : 'pl-10'}`}
                  dir="ltr"
                />
              </div>
            </div>

            {role === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                  {t.password}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${isRtl ? 'pr-10' : 'pl-10'}`}
                    dir="ltr"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded dark:border-slate-600 dark:bg-slate-700 cursor-pointer"
              />
              <label htmlFor="remember-me" className={`block text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none ${isRtl ? 'mr-2' : 'ml-2'}`}>
                {t.rememberMe}
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {t.login}
              </button>
            </div>
          </form>

          {role === 'admin' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600 transition-colors" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                    {t.noAccount}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link to="/register" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center justify-center gap-1 transition-colors">
                  {t.register}
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}